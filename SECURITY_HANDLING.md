# YouTube Stream Automator: Security Architecture Design

This document details the security model, cryptographic algorithms, and protocol defenses implemented in the YouTube Stream Automator application to meet our strict security checklist.

---

## 🔐 1. Authentication & Session Security

To protect user sessions and defend against Cross-Site Scripting (XSS) and Session Hijacking:

- **Server-Side Encrypted Cookies**: The application uses `HttpOnly` cookie-based sessions named `youtube_stream_session`. Client-side JavaScript cannot read this cookie (`document.cookie` block).
- **Transport Layer Constraints**: The session cookies use the `Secure` flag (in production) to enforce transport over TLS/HTTPS, and `SameSite=Lax` to provide protection against Cross-Site Request Forgery (CSRF).
- **Session Expiration**: The session is bound to a strict 30-day expiration window. 
- **Session Helper Location**: Implemented inside [lib/session.ts](file:///d:/projects/livestream_set/lib/session.ts).

---

## 🔑 2. JSON Web Encryption (JWE) instead of plain JWT

A major flaw of typical JWT implementations is that the payload is base64-encoded, meaning client browsers can inspect credentials at rest. To avoid this, we use JSON Web Encryption (JWE):

- **AES-256-GCM Encryption**: The token payload containing the YouTube `accessToken` and `refreshToken` is encrypted with the `A256GCM` (Galois/Counter Mode) encryption algorithm using a direct (`dir`) key wrap.
- **Key Derivation**: We derive a 256-bit cryptographically secure key from the server-side environment variable `SESSION_SECRET` using Web Crypto API's SHA-256 digest on startup:
  ```typescript
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretData);
  ```
- **Result**: Third-party browser extensions or users cannot inspect the content of their authentication token. The credentials are encrypted at rest inside the user's browser storage.

---

## 🛡️ 3. Google OAuth 2.0 & CSRF Defenses

To defend against OAuth callback hijacking and authorization state hijacking:

- **OAuth Callback Code Exchange**: The exchange of Google's authorization `code` for credentials is done entirely on the server-side in [app/api/auth/callback/route.ts](file:///d:/projects/livestream_set/app/api/auth/callback/route.ts). The client secret `YOUTUBE_CLIENT_SECRET` is never exposed to the frontend.
- **Cryptographic State Parameter**:
  1. On login, the server generates a cryptographically random UUID state:
     ```typescript
     const state = crypto.randomUUID();
     ```
  2. This state is stored in a temporary 10-minute HttpOnly cookie (`oauth_state`) and passed to Google's authorize URL.
  3. Upon callback redirect, the server verifies that the state returned from Google matches the cookie state. If they mismatch or are missing, the request is instantly rejected (CSRF Block).
  4. The temporary cookie is immediately cleared.
- **Implementation Locations**:
  - State Generation: [login/route.ts](file:///d:/projects/livestream_set/app/api/auth/login/route.ts)
  - State Verification: [callback/route.ts](file:///d:/projects/livestream_set/app/api/auth/callback/route.ts)

---

## 🚨 4. IDOR / Authorization vs Authentication

To prevent Indirect Object Reference (IDOR) attacks:

- **Browser Data Is Untrusted**: The frontend browser never provides identifier parameters like `userId`, `channelId`, or `channelName` during API actions.
- **Server-Derived Identity**: In [create-stream/route.ts](file:///d:/projects/livestream_set/app/api/create-stream/route.ts), the channel identifier is derived directly by decrypting the secure session cookie. An attacker cannot modify parameters in the request payload to schedule a stream on someone else's channel.
- **Administrative Restrictions**: Access to the `/analytics` page is gated by checking the decrypted session's `channelName` against `OWNER_CHANNEL_NAME` (which defaults to `"Gamer's Code Lab"`). Other authenticated users are rejected with `403 Forbidden`.

---

## 🖥️ 5. Injected Security Headers

We enforce browser-side security boundaries by injecting security headers into all responses via [next.config.ts](file:///d:/projects/livestream_set/next.config.ts):

| Header | Value | Purpose |
| :--- | :--- | :--- |
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS globally. |
| **X-Frame-Options** | `SAMEORIGIN` | Protects against Clickjacking frame injections. |
| **X-Content-Type-Options** | `nosniff` | Blocks MIME-type sniffing. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects referral metadata leaks. |

---

## 🪵 6. Logging & Token Leaks Prevention

- **Log Sanitization**: The server-side logger only records action statistics (timestamps, titles, categories). Secure session tokens, Client Secrets, and JWE payloads are explicitly excluded from logs to prevent log-leakage.
- **Credential Storage**: Environment credentials (`YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `SESSION_SECRET`) are stored in `.env.local`, which is listed in `.gitignore` and never committed to version control.

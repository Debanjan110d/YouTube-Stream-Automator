# 📺 YouTube Stream Automator

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-red.svg?style=for-the-badge)](https://github.com/Debanjan110d/YouTube-Stream-Automator)
[![Next.js Framework](https://img.shields.io/badge/Framework-Next.js%2016-000000.svg?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Security JWE](https://img.shields.io/badge/Security-JWE%20%2F%20AES--256--GCM-blue.svg?style=for-the-badge)](file:///d:/projects/livestream_set/SECURITY_HANDLING.md)

An elegant, open-source livestream schedule manager built specifically for YouTube creators. Streamline your broadcast publishing pipelines by importing structured templates (Markdown, JSON, or YAML), compressing thumbnails client-side to satisfy payload boundaries, and automatically binding your broadcasts to OBS default ingest keys.

---

## ✨ Key Features

- **📂 Multi-Format File Parser**: Import structured Markdown frontmatter (`.md`, `.txt`), pure JSON (`.json`), or YAML (`.yaml`, `.yml`) config templates to pre-fill titles, descriptions, categories, and tags.
- **🎭 Multiple Title Option Selector**: If your template contains a list of alternative stream titles, the dashboard renders an interactive Title Pool. Click any option to populate the form instantly.
- **🗜️ Client-Side Thumbnail Compression**: Compresses thumbnail uploads in the browser using dynamic web workers to keep images under YouTube's strict size limits and Vercel's payload boundary.
- **🔑 OBS Stream Key Binding**: Automatically detects your channel's active default ingest stream key and binds it to the scheduled event.
- **🛡️ Secure Encrypted Sessions**: Session tokens are encrypted using **JSON Web Encryption (JWE)** with the `AES-256-GCM` algorithm. Credentials remain completely opaque (encrypted) in a secure, `HttpOnly` cookie.
- **⚙️ Dynamic Origin Resolution**: Automatically extracts request host metadata to construct redirect URIs, eliminating runtime errors and deployment mismatch overrides.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Debanjan110d/YouTube-Stream-Automator.git
cd YouTube-Stream-Automator
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in your root directory:
```env
# Google OAuth 2.0 Credentials (obtain from Google Cloud Console)
YOUTUBE_CLIENT_ID="your-google-client-id"
YOUTUBE_CLIENT_SECRET="your-google-client-secret"

# Secret key for encrypting user sessions (256-bit secure random key)
SESSION_SECRET="at-least-32-character-random-secret-string"

# The display title of your channel authorized to view the /analytics page
OWNER_CHANNEL_NAME="Gamer's Code Lab"
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ YouTube Channel & Google Cloud Setup (Prerequisites)

Before running the application in development or production, make sure you complete these two crucial setup steps:

### 1. Enable Live Streaming on YouTube
YouTube requires account verification before allowing automated scheduling or broadcasts:
1. Go to **[YouTube Studio](https://studio.youtube.com)**.
2. Click **Create** (top right) and select **Go Live**.
3. If prompt appears, complete the phone verification check.
4. **Google takes exactly 24 hours to activate live streaming.** You will receive a `403 Forbidden` error if you try to use the scheduling tool before this activation completes.

### 2. Configure Google Cloud Credentials
1. Go to the **[Google Cloud Console](https://console.cloud.google.com)**.
2. Search and enable the **YouTube Data API v3** in the API library.
3. Configure your **OAuth Consent Screen** (Branding, Support Email, and Scopes: `.../auth/youtube` and `.../auth/userinfo.profile`).
4. Generate an **OAuth 2.0 Client ID (Web Application)**.
5. Add Authorized Redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://[your-app].vercel.app/api/auth/callback`

---

## 📁 Importing Templates
The scheduler accepts three main formats. View our **[Import Templates Guide](file:///d:/projects/livestream_set/IMPORT_TEMPLATES.md)** for copy-pasteable files.

### Example Markdown Config:
```markdown
---
title: "Building an API Route in Next.js 🚀 #webdev"
type: "28"
privacy: "public"
tags: ["nextjs", "typescript", "api"]
---
Welcome to today's stream!
In this coding session, we are setting up serverless endpoints...
```

---

## ⚡ Zero-Config Dynamic Origin Resolution (Production Fix)

In serverless environments, hardcoding `NEXT_PUBLIC_APP_URL` can easily lead to deployment failures and redirect mismatches. To solve this, the application dynamically resolves the callback host at runtime:

```typescript
// Dynamically resolves host and protocol from the request URL
const appUrl = new URL(request.url).origin;
const redirectUri = `${appUrl}/api/auth/callback`;
```

This ensures that the app works seamlessly across:
- **Localhost Development**: `http://localhost:3000`
- **Vercel Preview Deployments**: `https://*-git-main-vercel.app`
- **Custom Production Domains**: `https://your-domain.com`

*Note: You only need to add your production URL to the **Authorized redirect URIs** in your Google Cloud Console Credentials page.*

---

## 📄 Documentation

- Detailed Security Architecture: **[SECURITY_HANDLING.md](file:///d:/projects/livestream_set/SECURITY_HANDLING.md)**
- Copy-Paste Config Formats: **[IMPORT_TEMPLATES.md](file:///d:/projects/livestream_set/IMPORT_TEMPLATES.md)**

---

## 👤 Author
Developed and maintained with ❤️ by **[Debanjan110d](https://github.com/Debanjan110d)**.
If you find this project helpful, please drop a ⭐ on our GitHub repository!

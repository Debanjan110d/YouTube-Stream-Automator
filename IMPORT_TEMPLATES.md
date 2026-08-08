# YouTube Stream Automator: Import File Templates

This document provides copy-pasteable templates for the three file formats supported by the uploader: **Markdown (with YAML Frontmatter)**, **JSON**, and **YAML**. 

You can feed these templates directly to your AI (like Gemini, ChatGPT, or Claude) to generate your stream setup configurations.

---

## 1. Markdown Template (`.md` or `.txt`)

This format is ideal if you like writing rich descriptions in Markdown. The metadata is defined at the very top between triple-dash `---` boundaries (YAML Frontmatter), and the body content below the second `---` is parsed as your stream description.

### Copy-Pasteable Template:
```markdown
---
title: "Building a Next.js API route 🚀 #webdev #nextjs"
type: "28"
privacy: "public"
tags: ["nextjs", "typescript", "api", "web development", "backend", "live coding"]
---
Welcome to today's livestream session!

In this episode, we are going to build clean API endpoints inside Next.js using Typecheck verification and structured layout architectures.

### 📌 Schedule
- 00:00 - Introduction & Setup
- 15:00 - Database Design & Schema
- 45:00 - Writing Route Handlers
- 1:15:00 - Q&A Session
```

---

## 2. YAML Template (`.yaml` or `.yml`)

If you want a flat structure defining both metadata and description keys, a pure YAML file is supported.

### Copy-Pasteable Template:
```yaml
title:
  - "Building a Task Manager with React ⚡ #reactjs #programming"
  - "How to code a Task Tracker from Scratch 🚀 #react #tutorial"
  - "Live Coding: Building a React Dashboard 💻 #webdev"
category: "28"
privacy: "unlisted"
tags:
  - react
  - javascript
  - task manager
  - frontend
  - hooks
description: |
  Hey everyone, welcome back to the channel!
  
  Today, we are building a Task Manager application using clean React state hooks and standard CSS layout grids.
  
  Make sure to ask questions in the live chat!
```

---

## 3. JSON Template (`.json`)

If you are generating configs programmatically or outputting structured schema from LLMs, JSON format is fully supported.

### Copy-Pasteable Template:
```json
{
  "titles": [
    "Complete OAuth 2.0 Integration Setup 🔐 #websecurity #oauth",
    "How Google Login Works on Next.js ⚡ #nextjs #auth",
    "Coding OAuth Sessions from Scratch 💻 #programming"
  ],
  "categoryId": "28",
  "privacyStatus": "public",
  "tags": ["oauth2", "google login", "session", "security", "node js", "web dev"],
  "description": "Welcome to Gamer's Code Lab!\n\nIn this session, we will deep dive into securing Google and YouTube API logins, managing offline refresh tokens, and encrypting cookie payloads using server-side JWE.\n\nCheck out the GitHub link in the description for the full source code."
}
```

---

## ⚙️ Key Definitions

When generating your configurations, refer to these allowed key names and values:

### Categories (IDs)
- **`28`** : Science & Technology (Recommended default for programming)
- **`20`** : Gaming
- **`27`** : Education
- **`24`** : Entertainment
- **`10`** : Music
- **`22`** : People & Blogs
- **`26`** : Howto & Style

### Privacy Levels
- **`public`** : Visible to anyone on YouTube
- **`unlisted`** : Access restricted to link holders
- **`private`** : Only you can view the video

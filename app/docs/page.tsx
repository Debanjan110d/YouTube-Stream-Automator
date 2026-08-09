'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText, 
  FileCode, 
  Braces,
  HelpCircle,
  BookOpen,
  Sparkles,
  PlayCircle,
  Video,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Settings
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';


const MD_TEMPLATE = `---
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
- 1:15:00 - Q&A Session`;


const JSON_TEMPLATE = `{
  "titles": [
    "Complete OAuth 2.0 Integration Setup 🔐 #websecurity #oauth",
    "How Google Login Works on Next.js ⚡ #nextjs #auth",
    "Coding OAuth Sessions from Scratch 💻 #programming"
  ],
  "categoryId": "28",
  "privacyStatus": "public",
  "tags": ["oauth2", "google login", "session", "security", "node js", "web dev"],
  "description": "Welcome to Gamer's Code Lab!\\n\\nIn this session, we will deep dive into securing Google and YouTube API logins, managing offline refresh tokens, and encrypting cookie payloads using server-side JWE.\\n\\nCheck out the GitHub link in the description for the full source code."
}`;


const YAML_TEMPLATE = `title:
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
  
  Make sure to ask questions in the live chat!`;


export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'guide' | 'md' | 'json' | 'yaml'>('guide');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between font-sans">
      
      <div>
        <DashboardHeader channelInfo={null} onLogout={() => {}} />

        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          
          {/* Header navigation */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-[#ff0000]" />
                Documentation & Guides
              </h2>
              <p className="text-xs text-zinc-400">Learn how to configure your account and parse stream scheduling files.</p>
            </div>
            
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back Home
            </Link>
          </div>

          {/* Formats Tabs Container */}
          <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-md">
            
            {/* Tabs Header Selection */}
            <div className="flex flex-wrap border-b border-[#2d2d2d] bg-[#171717]">
              
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'guide' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="h-4 w-4 text-[#ff0000]" /> Setup & Usage Guide
              </button>

              <button
                onClick={() => setActiveTab('md')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'md' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="h-4 w-4" /> Markdown (YAML Frontmatter)
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'json' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Braces className="h-4 w-4" /> JSON Configuration
              </button>

              <button
                onClick={() => setActiveTab('yaml')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'yaml' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileCode className="h-4 w-4" /> Raw YAML
              </button>

            </div>

            {/* Config Content Panel */}
            <div className="p-6 space-y-6">
              
              {activeTab === 'guide' ? (
                <div className="space-y-8">
                  
                  {/* Prerequisites section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-amber-500" />
                      1. Prerequisites (Must Do Before Using)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="bg-[#171717] border border-[#2d2d2d] p-5 rounded-2xl space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="p-2 bg-amber-500/10 rounded-lg text-amber-500 text-xs font-bold font-mono">STEP A</span>
                          <div>
                            <h4 className="font-bold text-xs text-zinc-100">Enable Live Streaming on YouTube</h4>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                              YouTube requires phone verification before you can go live. If live streaming is disabled on your channel, scheduling will fail with a <code>403 Forbidden</code> account error.
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#1f1f1f] p-3 rounded-xl border border-[#2d2d2d] text-[11px] text-zinc-400 space-y-2">
                          <p className="font-semibold text-zinc-200">How to request activation:</p>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Go to <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#ff5555] hover:underline inline-flex items-center gap-0.5">YouTube Studio <ExternalLink className="h-2.5 w-2.5" /></a></li>
                            <li>Click **Create (Go Live)** and complete the phone verification.</li>
                            <li>Wait **exactly 24 hours** for YouTube to verify and activate your channel.</li>
                          </ol>
                        </div>
                      </div>

                      <div className="bg-[#171717] border border-[#2d2d2d] p-5 rounded-2xl space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500 text-xs font-bold font-mono">STEP B</span>
                          <div>
                            <h4 className="font-bold text-xs text-zinc-100">Enable YouTube Data API v3</h4>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                              Your Google Cloud Project must have authorization APIs enabled to allow scheduling requests from the dashboard.
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#1f1f1f] p-3 rounded-xl border border-[#2d2d2d] text-[11px] text-zinc-400 space-y-2 font-sans">
                          <p className="font-semibold text-zinc-200">How to set up credentials:</p>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Open the <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="h-2.5 w-2.5" /></a></li>
                            <li>Search and enable the **YouTube Data API v3** in your API library.</li>
                            <li>Create an **OAuth 2.0 Client ID (Web Application)**.</li>
                            <li>Add the redirect URI: <code>https://[your-app].vercel.app/api/auth/callback</code> (or <code>http://localhost:3000/api/auth/callback</code> for local).</li>
                          </ol>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Operational instructions section */}
                  <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-[#ff0000]" />
                      2. Step-by-Step Scheduling Guide
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      
                      <div className="bg-[#171717] border border-[#2d2d2d] p-4 rounded-xl space-y-2">
                        <div className="text-lg font-bold text-zinc-600">01</div>
                        <h4 className="font-bold text-zinc-200">Connect Channel</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Click **Connect YouTube Channel** and sign in. Your access credentials are JWE-encrypted and stored securely in client-side cookies.
                        </p>
                      </div>

                      <div className="bg-[#171717] border border-[#2d2d2d] p-4 rounded-xl space-y-2">
                        <div className="text-lg font-bold text-zinc-600">02</div>
                        <h4 className="font-bold text-zinc-200">Drop Config File</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Drag and drop your Markdown file, JSON, or YAML template. The client-side parser automatically extracts metadata, tags, and description.
                        </p>
                      </div>

                      <div className="bg-[#171717] border border-[#2d2d2d] p-4 rounded-xl space-y-2">
                        <div className="text-lg font-bold text-zinc-600">03</div>
                        <h4 className="font-bold text-zinc-200">Refine Settings</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Pick a title from your template pool, edit the description, adjust scheduled time, and upload a thumbnail (auto-compressed to stay under 1MB).
                        </p>
                      </div>

                      <div className="bg-[#171717] border border-[#2d2d2d] p-4 rounded-xl space-y-2">
                        <div className="text-lg font-bold text-zinc-600">04</div>
                        <h4 className="font-bold text-zinc-200">Sync & Broadcast</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Click **Generate & Schedule stream**. The app creates the broadcast, uploads the thumbnail, binds OBS stream keys, and saves logs.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Post-Sync OBS configurations warning */}
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-amber-400">Crucial OBS Settings Reminder</h4>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        YouTube APIs do not support enabling **Subscriber-Only Chat** or setting **Gaming Game Titles** programmatically. Once your stream is successfully scheduled, open your YouTube Studio Live Control Room and toggle these settings manually before clicking start in OBS!
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400 font-semibold font-mono">
                      {activeTab === 'md' ? 'template.md / template.txt' : activeTab === 'json' ? 'template.json' : 'template.yaml / template.yml'}
                    </span>
                    
                    <button
                      onClick={() => handleCopy(
                        activeTab === 'md' ? MD_TEMPLATE : activeTab === 'json' ? JSON_TEMPLATE : YAML_TEMPLATE
                      )}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-[#ff0000] hover:bg-[#cc0000] rounded-lg text-white font-semibold text-xs transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Format
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code editor view block */}
                  <pre className="bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl p-4 overflow-x-auto text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed max-h-[480px]">
                    <code>
                      {activeTab === 'md' ? MD_TEMPLATE : activeTab === 'json' ? JSON_TEMPLATE : YAML_TEMPLATE}
                    </code>
                  </pre>
                </>
              )}

            </div>

          </div>

          {/* Details metadata instructions */}
          {activeTab !== 'guide' && (
            <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-zinc-100">Key Schema Fields</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#171717] border border-[#2d2d2d] p-3.5 rounded-xl space-y-1">
                  <p className="font-bold text-[#ff3333]">title / titles</p>
                  <p className="text-zinc-400 leading-normal">
                    Either a single string title or an array of strings representing alternative title options. Multiple title arrays will display a selection pool in the dashboard.
                  </p>
                </div>

                <div className="bg-[#171717] border border-[#2d2d2d] p-3.5 rounded-xl space-y-1">
                  <p className="font-bold text-blue-400">tags</p>
                  <p className="text-zinc-400 leading-normal">
                    An array of string values representing search tags (SEO keywords). These are converted automatically to help users search for your broadcasts.
                  </p>
                </div>

                <div className="bg-[#171717] border border-[#2d2d2d] p-3.5 rounded-xl space-y-1">
                  <p className="font-bold text-emerald-400">type / category / categoryId</p>
                  <p className="text-zinc-400 leading-normal">
                    The category code matching YouTube specifications: Use **&quot;28&quot;** for Science & Technology, or **&quot;20&quot;** for Gaming.
                  </p>
                </div>

                <div className="bg-[#171717] border border-[#2d2d2d] p-3.5 rounded-xl space-y-1">
                  <p className="font-bold text-purple-400">privacy / privacyStatus</p>
                  <p className="text-zinc-400 leading-normal">
                    Controls broadcast access: Use **&quot;public&quot;**, **&quot;unlisted&quot;**, or **&quot;private&quot;** (must be lowercase).
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2d2d2d] bg-[#0f0f0f] py-6 text-center text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 YouTube Stream Automator. All rights reserved.</p>
          
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <a 
            href="https://github.com/Debanjan110d" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            Debanjan110d
          </a>
        </div>
      </footer>

    </div>
  );
}

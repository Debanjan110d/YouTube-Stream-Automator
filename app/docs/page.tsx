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
  HelpCircle
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
  const [activeTab, setActiveTab] = useState<'md' | 'json' | 'yaml'>('md');
  const [copied, setCopied] = useState(false);


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between font-sans">
      
      <div>
        {/* We pass null for channelInfo as this is a public docs page */}
        <DashboardHeader channelInfo={null} onLogout={() => {}} />

        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          
          {/* Header navigation */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-[#ff0000]" />
                Template Formats
              </h2>
              <p className="text-xs text-zinc-400">Copy and paste these templates into your AI assistants to generate stream config files.</p>
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
            <div className="flex border-b border-[#2d2d2d] bg-[#171717]">
              
              <button
                onClick={() => setActiveTab('md')}
                className={`flex-1 sm:flex-initial py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'md' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="h-4 w-4" /> Markdown (YAML Frontmatter)
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`flex-1 sm:flex-initial py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'json' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Braces className="h-4 w-4" /> JSON Configuration
              </button>

              <button
                onClick={() => setActiveTab('yaml')}
                className={`flex-1 sm:flex-initial py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
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

            </div>

          </div>

          {/* Details metadata instructions */}
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

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2d2d2d] bg-[#0f0f0f] py-6 text-center text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 YouTube Stream Automator. All rights reserved.</p>
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

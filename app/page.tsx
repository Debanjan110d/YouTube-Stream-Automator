'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  BarChart2, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  FileCode,
  Copy,
  Check,
  Video
} from 'lucide-react';


const MD_TEMPLATE = `---
title: "Building a Next.js API route 🚀 #webdev #nextjs"
type: "28"
privacy: "public"
game: "Software Development"
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
  "gameName": "Software Development",
  "tags": ["oauth2", "google login", "session", "security", "node js", "web dev"],
  "description": "Welcome to Gamer's Code Lab!\\n\\nIn this session, we will deep dive into securing Google and YouTube API logins, managing offline refresh tokens, and encrypting cookie payloads using server-side JWE.\\n\\nCheck out the GitHub link in the description for the full source code."
}`;


const YAML_TEMPLATE = `title:
  - "Building a Task Manager with React ⚡ #reactjs #programming"
  - "How to code a Task Tracker from Scratch 🚀 #react #tutorial"
  - "Live Coding: Building a React Dashboard 💻 #webdev"
category: "28"
privacy: "unlisted"
game: "Software Development"
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


export default function PublicHomePage() {
  const [homeTab, setHomeTab] = useState<'md' | 'json' | 'yaml'>('md');
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState<number | null>(null);


  // Fetch real stargazers count dynamically from GitHub on page load
  useEffect(() => {
    fetch('https://api.github.com/repos/Debanjan110d/YouTube-Stream-Automator')
      .then(res => res.json())
      .then(data => {
        if (data && data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(err => console.error('Error fetching stargazers:', err));
  }, []);


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Floating background mesh accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff0000]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00e701]/3 rounded-full blur-3xl pointer-events-none" />


      {/* Header section */}
      <header className="border-b border-[#2d2d2d] bg-[#0f0f0f]/90 backdrop-blur-md sticky top-0 z-40 relative">
        <div className="h-[2px] bg-gradient-to-r from-[#ff0000] via-[#527d0c] to-[#00e701] w-full absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between mt-[2px]">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-[#ff0000] to-[#00e701] p-1.5 rounded-lg flex items-center justify-center shadow-md">
              <Tv className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Stream <span className="font-normal text-zinc-300">Automator</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/docs" 
              className="text-xs font-semibold text-zinc-400 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-3.5 py-2 rounded-xl transition-all border border-[#3f3f3f]"
            >
              Template Formats
            </Link>
            <Link 
              href="/analytics" 
              className="text-xs font-semibold text-zinc-400 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-3.5 py-2 rounded-xl transition-all border border-[#3f3f3f]"
            >
              System Analytics
            </Link>
            
            {/* Dynamic Github Source Star Count in Header */}
            <a 
              href="https://github.com/Debanjan110d/YouTube-Stream-Automator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-[#1f1f1f] hover:bg-[#2d2d2d] px-3.5 py-2 rounded-xl border border-[#2d2d2d] transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>Source</span>
              <span className="bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                ★ {stars !== null ? stars : '0'}
              </span>
            </a>

            <Link 
              href="/dashboard" 
              className="py-2 px-4 bg-[#ff0000] hover:bg-[#cc0000] rounded-xl text-white font-bold text-xs transition-colors shadow-lg shadow-black/40"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>


      {/* Hero section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 sm:py-24 flex flex-col items-center justify-center text-center space-y-16 z-10">
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff0000]/10 to-[#00e701]/10 border border-zinc-800 text-xs text-zinc-300 font-semibold uppercase tracking-wider mb-2 mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5 text-[#ff0000]" /> YouTube & Kick Automation Tool
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Schedule Streams on YouTube & Kick <br />
              <span className="bg-gradient-to-r from-[#ff0000] via-[#527d0c] to-[#00e701] bg-clip-text text-transparent">
                Simultaneously in One Click
              </span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Automate your broadcast publishing pipelines. Drop your stream configuration file, select your game title, compress your thumbnail, and go live on both platforms instantly.
            </p>
          </div>

          {/* Three button cluster (Launch dashboard, View analytics, View Source) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto pt-4 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/analytics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#2d2d2d] border border-[#2d2d2d] text-zinc-100 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 text-sm"
            >
              <BarChart2 className="h-4 w-4 text-[#ff0000]" /> View Analytics
            </Link>
            <a
              href="https://github.com/Debanjan110d/YouTube-Stream-Automator"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#2d2d2d] border border-[#2d2d2d] text-zinc-100 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 text-sm group"
            >
              <svg className="h-4 w-4 text-[#ff0000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>View Source</span>
              <span className="bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                ★ {stars !== null ? stars : '0'}
              </span>
            </a>
          </div>
        </div>


        {/* Features grid */}
        <section className="w-full pt-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">Pipeline Automation Features</h3>
            <p className="text-xs text-zinc-400">Streamlining all required setup steps into one visual flow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            
            {/* Card 1 */}
            <div className="bg-[#1f1f1f] border border-[#2d2d2d] p-6 rounded-2xl space-y-4 shadow-md hover:border-[#ff0000]/30 transition-colors group">
              <div className="bg-[#ff0000]/10 p-2.5 rounded-xl text-[#ff0000] w-fit">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">Multi-File Parser</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Imports Markdown frontmatter, JSON, or YAML configs to pre-fill titles, tags, and category variables.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1f1f1f] border border-[#2d2d2d] p-6 rounded-2xl space-y-4 shadow-md hover:border-[#ff0000]/30 transition-colors group">
              <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 w-fit">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">Browser Compression</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Runs client-side thumbnail image compression to keep files under Vercel payload and YouTube size limits.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1f1f1f] border border-[#2d2d2d] p-6 rounded-2xl space-y-4 shadow-md hover:border-[#00e701]/30 transition-colors group">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 w-fit">
                <Video className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">YouTube & Kick Sync</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Resolves gaming categories dynamically and syncs stream titles and games to Kick.com in parallel with YouTube.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#1f1f1f] border border-[#2d2d2d] p-6 rounded-2xl space-y-4 shadow-md hover:border-[#ff0000]/30 transition-colors group">
              <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-400 w-fit">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">JWE Secure Sessions</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tokens are encrypted server-side using AES-256-GCM. Cookie payloads remain completely opaque to clients.
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* Visual architecture diagram */}
        <section className="w-full max-w-4xl bg-[#1f1f1f]/50 border border-[#2d2d2d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md text-left">
          <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-[#ff0000]" />
            Pipeline Architecture Flow
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs font-semibold">
            <div className="bg-[#272727] border border-[#3f3f3f] p-4 rounded-xl text-center flex-1 w-full sm:w-auto">
              <p className="text-zinc-200">1. Upload Template</p>
              <p className="text-[10px] text-zinc-500 mt-1">.json, .yaml, .md, or .txt</p>
            </div>
            
            <div className="text-zinc-600 hidden sm:block">➜</div>
            
            <div className="bg-[#272727] border border-[#3f3f3f] p-4 rounded-xl text-center flex-1 w-full sm:w-auto">
              <p className="text-zinc-200">2. Local Browser Parse</p>
              <p className="text-[10px] text-zinc-500 mt-1">Client-side parser & compressor</p>
            </div>
            
            <div className="text-zinc-600 hidden sm:block">➜</div>
            
            <div className="bg-[#272727] border border-[#3f3f3f] p-4 rounded-xl text-center flex-1 w-full sm:w-auto">
              <p className="text-zinc-200">3. JWE Encryption</p>
              <p className="text-[10px] text-zinc-500 mt-1">HttpOnly Cookie validation</p>
            </div>
            
            <div className="text-zinc-600 hidden sm:block">➜</div>
            
            <div className="bg-[#ff0000]/10 border border-[#ff0000]/20 p-4 rounded-xl text-center flex-1 w-full sm:w-auto text-[#ff3333]">
              <p className="font-bold">4. Sync Broadcast</p>
              <p className="text-[10px] text-zinc-400 mt-1">Create, set metadata, bind to OBS</p>
            </div>
          </div>
        </section>


        {/* Template Formats Codeblock Section */}
        <section className="w-full max-w-4xl space-y-6 pt-8 text-left">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <FileCode className="h-6 w-6 text-[#ff0000]" />
              Interactive Template Formats
            </h3>
            <p className="text-xs text-zinc-400">Copy these formats directly here to prepare your import files.</p>
          </div>

          <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-md">
            
            <div className="flex border-b border-[#2d2d2d] bg-[#171717]">
              
              <button
                onClick={() => setHomeTab('md')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  homeTab === 'md' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Markdown (YAML Frontmatter)
              </button>

              <button
                onClick={() => setHomeTab('json')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  homeTab === 'json' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                JSON Configuration
              </button>

              <button
                onClick={() => setHomeTab('yaml')}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  homeTab === 'yaml' 
                    ? 'border-[#ff0000] text-white bg-white/[0.02]' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Raw YAML
              </button>

            </div>

            <div className="p-5 space-y-4">
              
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-500">
                  {homeTab === 'md' ? 'template.md' : homeTab === 'json' ? 'template.json' : 'template.yaml'}
                </span>
                
                <button
                  onClick={() => handleCopy(
                    homeTab === 'md' ? MD_TEMPLATE : homeTab === 'json' ? JSON_TEMPLATE : YAML_TEMPLATE
                  )}
                  className="inline-flex items-center gap-1 bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold px-3 py-1.5 rounded-lg transition-all"
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

              <pre className="bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl p-4 overflow-x-auto text-xs text-zinc-300 font-mono leading-relaxed max-h-[300px]">
                <code>
                  {homeTab === 'md' ? MD_TEMPLATE : homeTab === 'json' ? JSON_TEMPLATE : YAML_TEMPLATE}
                </code>
              </pre>

            </div>

          </div>
        </section>

      </main>


      {/* Footer section */}
      <footer className="border-t border-[#2d2d2d] bg-[#0f0f0f] py-6 text-center text-xs text-zinc-500 z-10">
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

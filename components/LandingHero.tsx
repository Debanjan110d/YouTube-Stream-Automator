'use client';

import { Sparkles, FileText, FileImage, Tv } from 'lucide-react';

interface LandingHeroProps {
  loginUrl: string;
}

export default function LandingHero({ loginUrl }: LandingHeroProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white p-6 relative overflow-hidden">
      {/* Glowing background meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff0000]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#00e701]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff0000]/10 to-[#00e701]/10 border border-zinc-800 text-xs text-zinc-300 font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5 text-[#ff0000]" /> YouTube & Kick Automation Tool
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Multi-Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff0000] to-[#00e701]">Stream Automator</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Instantly schedule and synchronize live streams on YouTube and Kick. Parse Markdown, JSON, or YAML template configs, compress your thumbnails, and go live instantly.
          </p>
        </div>

        <div className="p-1 rounded-2xl bg-[#1f1f1f] border border-[#2d2d2d] shadow-2xl space-y-6 max-w-md mx-auto">
          <div className="p-6 space-y-4 text-left">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-[#ff0000]/10 text-[#ff0000] flex-shrink-0 h-fit">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Multiple File Parsers</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Drop Markdown, JSON, or YAML configuration templates to pre-fill titles, categories, and tags instantly.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 flex-shrink-0 h-fit">
                <FileImage className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Client-Side Compression</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Compress heavy Canva thumbnail designs down to target YouTube margins instantly inside your browser.</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <a
              href={loginUrl}
              className="w-full inline-flex items-center justify-center gap-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-black/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Tv className="h-5 w-5" />
              Connect YouTube Channel
            </a>
          </div>
        </div>
        
        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
          Secure token management. The application uses server-side JWE encryption to protect your authorization tokens.
        </p>
      </div>
    </div>
  );
}

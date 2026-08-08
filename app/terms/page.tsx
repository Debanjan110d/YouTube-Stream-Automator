'use client';

import Link from 'next/link';
import { Tv, ArrowLeft, FileText, Scale, Shield, AlertCircle } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';


export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between font-sans">
      
      <div>
        <DashboardHeader channelInfo={null} onLogout={() => {}} />

        <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#2d2d2d]">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Scale className="h-6 w-6 text-[#ff0000]" />
                Terms of Service
              </h2>
              <p className="text-xs text-zinc-400">Last updated: August 8, 2026</p>
            </div>
            
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back Home
            </Link>
          </div>

          {/* Terms Articles */}
          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed font-sans">
            
            <section className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-[#ff0000]" /> 1. Acceptance of Terms
              </h3>
              <p>
                By authenticating your YouTube account and using the YouTube Stream Automator application, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must not authorize the application.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-blue-400" /> 2. Description of Service
              </h3>
              <p>
                YouTube Stream Automator is an open-source schedule utility designed to streamline broadcasting setups. The service connects to Google YouTube APIs to schedule live stream broadcasts, associate categories and search tags, bind OBS stream keys, and upload compressed thumbnails.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-amber-400" /> 3. YouTube API Constraints & Manual Settings
              </h3>
              <p>
                Due to limitations and restrictions in the YouTube Data API v3, certain features cannot be completed programmatically by this application and must be toggled manually inside the YouTube Studio Live Control Room:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
                <li>Specific **Game Titles** for the Gaming category.</li>
                <li>**Subscriber-Only Chat** filters and settings.</li>
              </ul>
              <p>
                Users acknowledge that it is their responsibility to finalize these settings in YouTube Studio before starting their broadcasts.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="h-4.5 w-4.5 text-purple-400" /> 4. Disclaimer of Warranties
              </h3>
              <p>
                The application is provided &quot;as is&quot; without warranty of any kind. The developers are not liable for any API quota limit restrictions, stream connection interruptions, or configuration mismatch settings caused by YouTube API disruptions.
              </p>
            </section>

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

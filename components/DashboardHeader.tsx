'use client';

import { Tv, LogOut, BarChart2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  channelInfo: { name: string; avatar: string } | null;
  onLogout: () => void;
}

export default function DashboardHeader({ channelInfo, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-[#2d2d2d] bg-[#0f0f0f] sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#ff0000] p-1.5 rounded-lg flex items-center justify-center">
              <Tv className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
              YouTube <span className="font-normal text-zinc-300">Stream Automator</span>
            </h1>
          </Link>

          <Link 
            href="/docs" 
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-3 py-1.5 rounded-full transition-all border border-[#3f3f3f]"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#ff0000]" />
            Templates
          </Link>

          <Link 
            href="/analytics" 
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-3 py-1.5 rounded-full transition-all border border-[#3f3f3f]"
          >
            <BarChart2 className="h-3.5 w-3.5 text-[#ff0000]" />
            Analytics
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {channelInfo && (
            <div className="flex items-center gap-3 bg-[#212121] border border-[#2d2d2d] rounded-full pl-2 pr-4 py-1.5">
              {channelInfo.avatar ? (
                <img
                  src={channelInfo.avatar}
                  alt={channelInfo.name}
                  className="h-7 w-7 rounded-full border border-zinc-700 object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                  YT
                </div>
              )}
              <span className="text-sm font-semibold text-zinc-200 truncate max-w-[120px] sm:max-w-none">
                {channelInfo.name}
              </span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="p-2 sm:px-4 sm:py-2 rounded-xl bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-zinc-300 hover:text-white transition-all flex items-center gap-2 text-sm font-semibold"
            title="Logout"
          >
            <LogOut className="h-4 w-4 text-zinc-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        
      </div>
    </header>
  );
}

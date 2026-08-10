'use client';

import { useState, useRef, useEffect } from 'react';
import { Tv, LogOut, BarChart2, HelpCircle, User, ShieldCheck, Key, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  channelInfo: { name: string; avatar: string } | null;
  onLogout: () => void;
}

export default function DashboardHeader({ channelInfo, onLogout }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-[#2d2d2d] bg-[#0f0f0f] sticky top-0 z-40 transition-all relative">
      {/* Dynamic multi-platform theme top stripe */}
      <div className="h-[2px] bg-gradient-to-r from-[#ff0000] via-[#527d0c] to-[#00e701] w-full absolute top-0 left-0" />
      
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-4 sm:gap-6 mt-[2px]">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-[#ff0000] to-[#00e701] p-1.5 rounded-lg flex items-center justify-center shadow-md">
              <Tv className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
              Stream <span className="font-normal text-zinc-300">Automator</span>
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
            <div className="relative" ref={dropdownRef}>
              
              {/* Profile Pill Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-[#212121] hover:bg-[#2b2b2b] border border-[#2d2d2d] rounded-full pl-2 pr-4 py-1.5 transition-all outline-none"
              >
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
              </button>

              {/* Profile Dropdown Popover */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-5 shadow-2xl z-50 animate-slide-up space-y-4">
                  
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-3 pb-3.5 border-b border-[#2d2d2d]">
                    {channelInfo.avatar ? (
                      <img
                        src={channelInfo.avatar}
                        alt={channelInfo.name}
                        className="h-11 w-11 rounded-full border border-zinc-600 object-cover"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold text-white">
                        YT
                      </div>
                    )}
                    <div className="space-y-0.5 max-w-[150px]">
                      <h4 className="text-sm font-bold text-white truncate leading-tight">{channelInfo.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold tracking-wide uppercase">YouTube Creator</p>
                    </div>
                  </div>

                  {/* Connection Credentials Info */}
                  <div className="space-y-2 text-xs">
                    
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[11px] text-zinc-200">OAuth Connection</p>
                        <p className="text-[9px] text-zinc-500">YouTube API Scope Active</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-300 pt-1">
                      <Key className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[11px] text-zinc-200">Session Security</p>
                        <p className="text-[9px] text-zinc-500">JWE Encrypted Token Cookie</p>
                      </div>
                    </div>

                  </div>

                  {/* Actions Area */}
                  <div className="pt-3 border-t border-[#2d2d2d] flex flex-col gap-2">
                    
                    <Link
                      href="/analytics"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full py-2 px-3 rounded-lg hover:bg-white/[0.03] text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 border border-transparent hover:border-[#2d2d2d]"
                    >
                      <BarChart2 className="h-4 w-4 text-[#ff0000]" />
                      View Analytics
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#272727] hover:bg-[#ff0000]/10 hover:text-[#ff0000] border border-[#3f3f3f] hover:border-[#ff0000]/30 text-zinc-300 transition-all text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect Channel
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {!channelInfo && (
            <button
              onClick={onLogout}
              className="p-2 sm:px-4 sm:py-2 rounded-xl bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-zinc-300 hover:text-white transition-all flex items-center gap-2 text-sm font-semibold"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-zinc-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
}

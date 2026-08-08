'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  BarChart2, 
  AlertTriangle, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  Lock, 
  Tag, 
  Globe, 
  Users, 
  Video,
  ExternalLink
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';


interface LogEntry {
  timestamp: string;
  channelName: string;
  channelAvatar: string;
  videoId: string;
  title: string;
  categoryId: string;
  privacyStatus: string;
}


export default function AnalyticsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [channelInfo, setChannelInfo] = useState<{ name: string; avatar: string } | null>(null);
  
  const [analyticsData, setAnalyticsData] = useState<LogEntry[]>([]);
  const [ownerChannel, setOwnerChannel] = useState('');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');


  useEffect(() => {
    fetchSessionAndAnalytics();
  }, []);


  const fetchSessionAndAnalytics = async () => {
    try {
      // 1. Verify general authentication status
      const statusRes = await fetch('/api/auth/status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsAuthenticated(true);
        setChannelInfo({ name: statusData.channelName, avatar: statusData.channelAvatar });
        
        // 2. Fetch Owner Analytics
        const analyticsRes = await fetch('/api/analytics');
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAuthorized(true);
          setAnalyticsData(analyticsData.data || []);
          setOwnerChannel(analyticsData.ownerChannel || "Gamer's Code Lab");
        } else {
          setAuthorized(false);
          const errData = await analyticsRes.json();
          setErrorMsg(errData.error || 'Access to analytics is restricted.');
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };


  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setIsAuthenticated(false);
        setChannelInfo(null);
        setAuthorized(null);
      }
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };


  // Calculate high level stats from logged entries
  const totalStreams = analyticsData.length;
  
  const uniqueChannels = new Set(analyticsData.map(log => log.channelName.toLowerCase().trim())).size;


  // Loader view
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff0000] mx-auto" />
          <p className="text-sm font-medium text-zinc-400">Loading administrator logs...</p>
        </div>
      </div>
    );
  }


  // Unauthenticated page redirect
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] text-white p-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="bg-[#ff0000]/10 p-4 rounded-full w-fit mx-auto text-[#ff0000]">
            <Lock className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Authentication Required</h2>
            <p className="text-sm text-zinc-400">Please connect your channel on the home page before accessing analytics.</p>
          </div>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#ff0000] hover:bg-[#cc0000] rounded-xl text-white font-semibold transition-all text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }


  // Unauthorized (Not Owner) View
  if (authorized === false) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
        <DashboardHeader channelInfo={channelInfo} onLogout={handleLogout} />
        
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="bg-red-500/10 border border-red-500/20 text-[#ff0000] p-4 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-red-500">Access Restricted</h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {errorMsg || `This dashboard contains administrator metrics and is only accessible by the owner channel ("${ownerChannel || "Gamer's Code Lab"}").`}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] rounded-xl text-zinc-100 font-semibold transition-all text-xs"
              >
                <ArrowLeft className="h-4 w-4" /> Return to Dashboard
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-[#2d2d2d] bg-[#0f0f0f] py-6 text-center text-xs text-zinc-500">
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


  // Authorized Owner View
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans">
      <DashboardHeader channelInfo={channelInfo} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Page title and navigation */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-[#ff0000]" />
              System Analytics
            </h2>
            <p className="text-xs text-zinc-400">Monitoring usage statistics and stream scheduling pipelines.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Stats card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Scheduled Streams</p>
              <p className="text-3xl font-extrabold text-white">{totalStreams}</p>
            </div>
            <div className="p-3 bg-[#ff0000]/10 text-[#ff0000] rounded-xl">
              <Video className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Creators</p>
              <p className="text-3xl font-extrabold text-white">{uniqueChannels}</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Admin Channel</p>
              <p className="text-lg font-bold text-[#ff0000] truncate max-w-[180px]" title={ownerChannel}>
                {ownerChannel}
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Globe className="h-6 w-6" />
            </div>
          </div>

        </div>

        {/* Logged streams data table */}
        <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-[#2d2d2d]">
            <h3 className="font-bold text-zinc-100 text-sm">Historical Sync Logs</h3>
          </div>
          
          <div className="overflow-x-auto">
            {analyticsData.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#2d2d2d] bg-[#171717] text-zinc-400 font-semibold">
                    <th className="p-4">Time</th>
                    <th className="p-4">Creator / Channel</th>
                    <th className="p-4">Stream Info</th>
                    <th className="p-4 text-center">Video Target</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.map((log, index) => (
                    <tr 
                      key={log.videoId + '-' + index} 
                      className="border-b border-[#2d2d2d]/60 hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-4 text-zinc-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-zinc-200">
                        <div className="flex items-center gap-2.5">
                          {log.channelAvatar ? (
                            <img 
                              src={log.channelAvatar} 
                              alt={log.channelName} 
                              className="w-6 h-6 rounded-full border border-zinc-700"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                              YT
                            </div>
                          )}
                          <span className="truncate max-w-[140px] sm:max-w-none">{log.channelName}</span>
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <p className="font-medium text-white max-w-sm sm:max-w-md truncate" title={log.title}>
                          {log.title}
                        </p>
                        <div className="flex gap-2 text-[10px]">
                          <span className="bg-[#272727] text-zinc-400 px-1.5 py-0.5 rounded border border-[#3f3f3f]">
                            Cat: {log.categoryId === '28' ? 'Science' : log.categoryId === '20' ? 'Gaming' : log.categoryId}
                          </span>
                          <span className="bg-red-500/10 text-[#ff3333] px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-semibold">
                            {log.privacyStatus}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {log.videoId ? (
                          <a
                            href={`https://studio.youtube.com/video/${log.videoId}/livestreaming`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#ff0000] hover:underline font-semibold"
                          >
                            Studio <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-zinc-500 italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-zinc-500 space-y-2">
                <Video className="h-8 w-8 text-zinc-600 mx-auto" />
                <p className="text-xs">No streams scheduled yet. Sync logs will be populated here.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="border-t border-[#2d2d2d] bg-[#0f0f0f] py-6 text-center text-xs text-zinc-500 mt-auto">
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

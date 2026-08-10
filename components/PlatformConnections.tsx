'use client';

import { useState } from 'react';
import { ShieldCheck, Video, Link2, XCircle, LogOut, Key, Loader2 } from 'lucide-react';

interface PlatformConnectionsProps {
  youtubeInfo: { name: string; avatar: string } | null;
  kickInfo: { slug: string; name: string; avatar: string } | null;
  onDisconnectKick: () => void;
  showFeedback: (type: 'success' | 'error', message: string) => void;
}

export default function PlatformConnections({
  youtubeInfo,
  kickInfo,
  onDisconnectKick,
  showFeedback
}: PlatformConnectionsProps) {
  const [disconnecting, setDisconnecting] = useState(false);
  const [copyingMcp, setCopyingMcp] = useState(false);

  const handleConnectKick = () => {
    // Redirect user to start the Kick OAuth 2.1 PKCE authorization flow
    window.location.href = '/api/auth/login/kick';
  };

  const handleDisconnectKick = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch('/api/auth/disconnect/kick', { method: 'POST' });
      if (res.ok) {
        onDisconnectKick();
        showFeedback('success', 'Disconnected Kick channel.');
      } else {
        showFeedback('error', 'Failed to disconnect Kick channel.');
      }
    } catch (err) {
      showFeedback('error', 'Network error disconnecting Kick.');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleCopyMcpToken = async () => {
    setCopyingMcp(true);
    try {
      const res = await fetch('/api/auth/mcp-token');
      if (res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.token);
        showFeedback('success', 'MCP Session Key copied to clipboard!');
      } else {
        showFeedback('error', 'Please log in to YouTube first.');
      }
    } catch (e) {
      showFeedback('error', 'Failed to copy session key.');
    } finally {
      setCopyingMcp(false);
    }
  };

  return (
    <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-5 space-y-4 shadow-md">
      
      {/* Title */}
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#2d2d2d] pb-3">
        <Link2 className="h-4 w-4 text-[#ff0000]" /> Linked Broadcast Platforms
      </h3>

      <div className="space-y-3">
        
        {/* YouTube Channel status */}
        <div className="bg-[#171717] border border-[#2d2d2d] p-3.5 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {youtubeInfo?.avatar ? (
              <img
                src={youtubeInfo.avatar}
                alt={youtubeInfo.name}
                className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                YT
              </div>
            )}
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white max-w-[140px] truncate">{youtubeInfo?.name || 'YouTube Channel'}</h4>
              <p className="text-[9px] text-[#ff3333] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-pulse" />
                Connected
              </p>
            </div>
          </div>
          
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
        </div>

        {/* Kick Channel status */}
        {kickInfo ? (
          <div className="bg-[#171717] border border-[#2d2d2d] p-3.5 rounded-xl flex items-center justify-between gap-3 animate-slide-up">
            <div className="flex items-center gap-3">
              {kickInfo.avatar ? (
                <img
                  src={kickInfo.avatar}
                  alt={kickInfo.name}
                  className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                  K
                </div>
              )}
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white max-w-[120px] truncate">{kickInfo.name}</h4>
                <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDisconnectKick}
              disabled={disconnecting}
              className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-[#2d2d2d] transition-all flex-shrink-0"
              title="Disconnect Kick"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConnectKick}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md group border border-emerald-500/20"
          >
            <Video className="h-4 w-4 text-emerald-200 group-hover:scale-110 transition-all" />
            Connect Kick Channel
          </button>
        )}

        {/* MCP Client key copy button */}
        <button
          type="button"
          onClick={handleCopyMcpToken}
          disabled={copyingMcp}
          className="w-full mt-2 py-2.5 px-4 bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-zinc-300 hover:text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          {copyingMcp ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Copying Session Key...
            </>
          ) : (
            <>
              <Key className="h-3.5 w-3.5 text-zinc-500" />
              Copy MCP Session Key
            </>
          )}
        </button>

      </div>
    </div>
  );
}

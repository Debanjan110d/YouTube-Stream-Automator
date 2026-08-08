'use client';

import { Loader2, RefreshCw } from 'lucide-react';

interface QuickActionsProps {
  onLoadLastStream: () => void;
  loadingLastStream: boolean;
}

export default function QuickActions({ onLoadLastStream, loadingLastStream }: QuickActionsProps) {
  return (
    <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-5 space-y-4 shadow-md">
      <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quick Actions</h2>
      <button
        type="button"
        onClick={onLoadLastStream}
        disabled={loadingLastStream}
        className="w-full flex items-center justify-center gap-2.5 bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-zinc-100 font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingLastStream ? (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        ) : (
          <RefreshCw className="h-4 w-4 text-[#ff0000]" />
        )}
        Load Last Stream Settings
      </button>
    </div>
  );
}

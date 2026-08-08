'use client';

import { Check, AlertTriangle, Loader2, Sparkles, ExternalLink } from 'lucide-react';

interface SyncStep {
  id: number;
  label: string;
  status: 'idle' | 'running' | 'success' | 'error';
}

interface SyncOverlayProps {
  isSyncing: boolean;
  syncSteps: SyncStep[];
  syncStatus: 'idle' | 'loading' | 'success' | 'error';
  syncError: string;
  syncResultVideoId: string;
  thumbnailProvided: boolean;
  boundStream: boolean;
  onClose: () => void;
}

export default function SyncOverlay({
  isSyncing,
  syncSteps,
  syncStatus,
  syncError,
  syncResultVideoId,
  thumbnailProvided,
  boundStream,
  onClose
}: SyncOverlayProps) {
  if (!isSyncing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden text-white">
        
        {/* Top gradient glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#ff0000]" />
        
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold tracking-tight">Syncing to YouTube</h3>
          <p className="text-xs text-zinc-400">Please do not close this browser tab while we build the livestream.</p>
        </div>

        {/* Progress Steps list */}
        <div className="space-y-4 py-2">
          {syncSteps.map((step) => (
            <div key={step.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {step.status === 'running' && (
                  <div className="h-5 w-5 rounded-full border border-[#ff0000] border-t-transparent animate-spin flex-shrink-0" />
                )}
                {step.status === 'success' && (
                  <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center flex-shrink-0 text-[10px]">
                    ✓
                  </div>
                )}
                {step.status === 'error' && (
                  <div className="h-5 w-5 rounded-full bg-red-500/10 border border-red-500 text-red-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                    !
                  </div>
                )}
                {step.status === 'idle' && (
                  <div className="h-5 w-5 rounded-full border border-zinc-700 flex-shrink-0" />
                )}
                <span className={`text-sm ${
                  step.status === 'running' ? 'text-white font-medium animate-pulse' :
                  step.status === 'success' ? 'text-zinc-300' :
                  step.status === 'error' ? 'text-red-400' : 'text-zinc-500'
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Final Success or Error content */}
        {syncStatus === 'success' && (
          <div className="space-y-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-300">Successfully Scheduled!</h4>
                  <p className="text-xs text-zinc-400 mt-1">The livestream has been scheduled and configured on your channel.</p>
                </div>
              </div>
            </div>

            {/* Post-Sync Action Reminder Card (Subscriber Chat & Game title API constraints) */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2.5">
              <div className="flex gap-2.5 items-start">
                <Sparkles className="h-4.5 w-4.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">YouTube Studio Next Steps</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    YouTube API restrictions prevent programmatically setting the <strong>Game Title</strong> and <strong>Subscriber-Only Chat</strong>. 
                  </p>
                  <ul className="list-disc list-inside text-[10px] text-zinc-500 mt-2 space-y-1">
                    <li>Edit video details in Studio to set the specific game name.</li>
                    <li>Toggle Live Chat to &quot;Subscribers-only&quot; inside Control Room.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {syncResultVideoId && (
                <a
                  href={`https://studio.youtube.com/video/${syncResultVideoId}/livestreaming`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-1.5 py-3 px-4 bg-[#ff0000] hover:bg-[#cc0000] rounded-xl text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  Open YouTube Studio <ExternalLink className="h-4 w-4" />
                </a>
              )}
              
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-300">Sync Pipeline Failed</h4>
                <p className="text-xs text-zinc-400 mt-1">{syncError}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-[#272727] hover:bg-[#3f3f3f] border border-[#3f3f3f] text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close & Edit Form
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

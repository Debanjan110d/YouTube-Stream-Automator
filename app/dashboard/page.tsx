'use client';

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { parseStreamFile } from '@/lib/mdParser';
import Link from 'next/link';

// Import modular components
import LandingHero from '@/components/LandingHero';
import DashboardHeader from '@/components/DashboardHeader';
import QuickActions from '@/components/QuickActions';
import MarkdownUploader from '@/components/MarkdownUploader';
import ThumbnailUploader from '@/components/ThumbnailUploader';
import TagManager from '@/components/TagManager';
import SyncOverlay from '@/components/SyncOverlay';

import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Settings, 
  Clock,
  Tv,
  Lock,
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';

// YouTube popular categories list
const CATEGORIES = [
  { id: '28', name: 'Science & Technology' },
  { id: '20', name: 'Gaming' },
  { id: '27', name: 'Education' },
  { id: '24', name: 'Entertainment' },
  { id: '10', name: 'Music' },
  { id: '22', name: 'People & Blogs' },
  { id: '26', name: 'Howto & Style' },
  { id: '17', name: 'Sports' },
  { id: '23', name: 'Comedy' },
];

// Privacy options
const PRIVACY_OPTIONS = [
  { value: 'public', name: 'Public (Everyone can see)' },
  { value: 'unlisted', name: 'Unlisted (Only people with link)' },
  { value: 'private', name: 'Private (Only you can see)' },
];


export default function StreamAutomatorDashboard() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [channelInfo, setChannelInfo] = useState<{ name: string; avatar: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form input states
  const [title, setTitle] = useState('');
  const [titleOptions, setTitleOptions] = useState<string[]>([]); // Dynamic title choice pool
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('28');
  const [privacyStatus, setPrivacyStatus] = useState('public');
  const [scheduledTime, setScheduledTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Thumbnail states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<string | null>(null);

  // Pipeline execution & step progress states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncError, setSyncError] = useState('');
  const [syncResultVideoId, setSyncResultVideoId] = useState('');
  const [boundStream, setBoundStream] = useState(false);
  const [syncSteps, setSyncSteps] = useState<{
    id: number;
    label: string;
    status: 'idle' | 'running' | 'success' | 'error';
  }[]>([
    { id: 1, label: 'Creating YouTube Broadcast Event', status: 'idle' },
    { id: 2, label: 'Applying Category & SEO Search Tags', status: 'idle' },
    { id: 3, label: 'Uploading Compressed Stream Thumbnail', status: 'idle' },
    { id: 4, label: 'Binding Broadcast to OBS Stream Key', status: 'idle' },
  ]);

  // Loading last stream states
  const [loadingLastStream, setLoadingLastStream] = useState(false);
  const [uiFeedback, setUiFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  // Check authentication and setup initial default schedule date on mount
  useEffect(() => {
    fetchAuthStatus();
    
    // Default schedule time: 10 minutes in the future formatted locally
    const defaultDate = new Date(Date.now() + 10 * 60 * 1000);
    const tzOffset = defaultDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(defaultDate.getTime() - tzOffset).toISOString().slice(0, 16);
    setScheduledTime(localISOTime);
  }, []);


  const fetchAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setChannelInfo({ name: data.channelName, avatar: data.channelAvatar });
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
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
      }
    } catch (e) {
      console.error('Logout request failed:', e);
    }
  };


  const showFeedback = (type: 'success' | 'error', message: string) => {
    setUiFeedback({ type, message });
    setTimeout(() => setUiFeedback(null), 4000);
  };


  // Parses stream configuration from uploaded file (JSON, Markdown, YAML, YML, TXT)
  const handleMarkdownUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseStreamFile(text, file.name);
        
        setTitle(parsed.title);
        setTitleOptions(parsed.titles || []);
        setDescription(parsed.description);
        setCategoryId(parsed.categoryId);
        setTags(parsed.tags);
        setPrivacyStatus(parsed.privacyStatus);

        showFeedback('success', `Parsed "${file.name}"! Config applied.`);
      } catch (err) {
        showFeedback('error', 'Formatting error. Could not parse configuration variables.');
      }
    };
    reader.readAsText(file);
  };


  // Client-side image compression handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setOriginalSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
    setCompressing(true);

    try {
      const options = {
        maxSizeMB: 0.95, // Limit size to under 1MB to prevent server payload boundaries
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      };

      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      setThumbnailFile(compressedFile);
      setThumbnailPreview(URL.createObjectURL(compressedFile));
      setCompressedSize((compressedFile.size / 1024 / 1024).toFixed(2) + ' MB');
    } catch (error) {
      console.error('Compression failed, falling back to original:', error);
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setCompressedSize((file.size / 1024 / 1024).toFixed(2) + ' MB (uncompressed)');
    } finally {
      setCompressing(false);
    }
  };


  const handleClearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setOriginalSize(null);
    setCompressedSize(null);
  };


  // Load configuration parameters from previous broadcast
  const handleLoadLastStream = async () => {
    setLoadingLastStream(true);
    try {
      const res = await fetch('/api/previous-stream');
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setTitleOptions([data.title]);
        setDescription(data.description);
        setTags(data.tags);
        setCategoryId(data.categoryId);
        setPrivacyStatus(data.privacyStatus);
        showFeedback('success', 'Loaded last stream details!');
      } else {
        const err = await res.json();
        showFeedback('error', err.message || 'Failed to retrieve previous stream.');
      }
    } catch (e) {
      showFeedback('error', 'API error loading previous stream.');
    } finally {
      setLoadingLastStream(false);
    }
  };


  // Coordinates POST pipeline to create and setup YouTube streams
  const handleSyncToYouTube = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      showFeedback('error', 'Please enter a stream title.');
      return;
    }
    if (!scheduledTime) {
      showFeedback('error', 'Please specify a schedule time.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('loading');
    setSyncError('');

    // Reset step tracker status
    setSyncSteps([
      { id: 1, label: 'Creating YouTube Broadcast Event', status: 'running' },
      { id: 2, label: 'Applying Category & SEO Search Tags', status: 'idle' },
      { id: 3, label: 'Uploading Compressed Stream Thumbnail', status: 'idle' },
      { id: 4, label: 'Binding Broadcast to OBS Stream Key', status: 'idle' },
    ]);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);
      formData.append('privacyStatus', privacyStatus);
      formData.append('scheduledTime', scheduledTime);
      formData.append('tags', JSON.stringify(tags));

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      // Start network request
      const responsePromise = fetch('/api/create-stream', {
        method: 'POST',
        body: formData,
      });

      // Quick visual updates for step transition micro-animations
      setTimeout(() => {
        setSyncSteps(prev => {
          if (prev[0].status === 'running') {
            return prev.map(s => s.id === 1 ? { ...s, status: 'success' } : s.id === 2 ? { ...s, status: 'running' } : s);
          }
          return prev;
        });
      }, 2000);

      setTimeout(() => {
        setSyncSteps(prev => {
          if (prev[1].status === 'running') {
            return prev.map(s => s.id === 2 ? { ...s, status: 'success' } : s.id === 3 ? { ...s, status: 'running' } : s);
          }
          return prev;
        });
      }, 4000);

      setTimeout(() => {
        setSyncSteps(prev => {
          if (prev[2].status === 'running') {
            return prev.map(s => s.id === 3 ? { ...s, status: 'success' } : s.id === 4 ? { ...s, status: 'running' } : s);
          }
          return prev;
        });
      }, 6000);

      const res = await responsePromise;
      const data = await res.json();

      if (res.ok) {
        setSyncSteps([
          { id: 1, label: 'Creating YouTube Broadcast Event', status: 'success' },
          { id: 2, label: 'Applying Category & SEO Search Tags', status: 'success' },
          { id: 3, label: 'Uploading Compressed Stream Thumbnail', status: thumbnailFile ? 'success' : 'idle' },
          { id: 4, label: 'Binding Broadcast to OBS Stream Key', status: data.boundStream ? 'success' : 'idle' },
        ]);
        setSyncResultVideoId(data.videoId);
        setBoundStream(data.boundStream);
        setSyncStatus('success');
      } else {
        setSyncSteps((prev) =>
          prev.map((step) =>
            step.status === 'running' || step.status === 'idle'
              ? { ...step, status: 'error' }
              : step
          )
        );
        setSyncStatus('error');
        setSyncError(data.error || 'Failed to complete scheduling pipeline.');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncError(err.message || 'Connection failure.');
      setSyncSteps((prev) => prev.map((s) => ({ ...s, status: 'error' })));
    }
  };


  // Auth Loading placeholder
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff0000] mx-auto" />
          <p className="text-sm font-medium tracking-wide text-zinc-400">Verifying session details...</p>
        </div>
      </div>
    );
  }


  // Login View
  if (!isAuthenticated) {
    return <LandingHero loginUrl="/api/auth/login" />;
  }


  // Dashboard View
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white relative font-sans flex flex-col justify-between">
      {/* Floating background mesh accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ff0000]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff0000]/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        <DashboardHeader channelInfo={channelInfo} onLogout={handleLogout} />

        <main className="max-w-7xl mx-auto px-6 py-8">

          {/* Templates Guide Banner */}
          <div className="bg-[#ff0000]/10 border border-[#ff0000]/20 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                <Sparkles className="h-4 w-4 text-[#ff0000] animate-pulse" /> First Time Here? Optimize Your Workflow!
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Drag and drop a <strong>Markdown (.md)</strong>, <strong>JSON (.json)</strong>, or <strong>YAML (.yaml)</strong> configuration template to automatically fill in all titles, descriptions, categories, and SEO tags.
              </p>
            </div>
            <Link 
              href="/docs" 
              className="flex-shrink-0 text-xs font-semibold text-white bg-[#ff0000] hover:bg-[#cc0000] px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              Copy Template Formats
            </Link>
          </div>
          
          {/* Floating feedback notification toast */}
          {uiFeedback && (
            <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl transition-all duration-300 animate-slide-up ${
              uiFeedback.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
                : 'bg-red-950/90 border-red-500/30 text-red-300'
            }`}>
              {uiFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertTriangle className="h-5 w-5 text-red-400" />}
              <span className="text-sm font-semibold tracking-wide">{uiFeedback.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left panel: Uploaders and side controls */}
            <div className="lg:col-span-4 space-y-6">
              <QuickActions onLoadLastStream={handleLoadLastStream} loadingLastStream={loadingLastStream} />
              <MarkdownUploader onMarkdownUpload={handleMarkdownUpload} showFeedback={showFeedback} />
              <ThumbnailUploader 
                thumbnailPreview={thumbnailPreview}
                compressing={compressing}
                originalSize={originalSize}
                compressedSize={compressedSize}
                onImageUpload={handleImageUpload}
                onClear={handleClearThumbnail}
                showFeedback={showFeedback}
              />
            </div>

            {/* Right panel: Configurations form */}
            <div className="lg:col-span-8">
              <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
                
                <div className="flex justify-between items-center pb-4 border-b border-[#2d2d2d]">
                  <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                    <Settings className="h-4.5 w-4.5 text-[#ff0000]" />
                    Stream Configuration
                  </h2>
                  <span className="text-xs text-zinc-400 bg-[#272727] border border-[#3f3f3f] px-2.5 py-1 rounded-md font-semibold">
                    YouTube Studio Sync
                  </span>
                </div>

                <form onSubmit={handleSyncToYouTube} className="space-y-6">
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                      Stream Title <span className="text-red-500">*</span>
                    </label>
                    
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Setting up clean API endpoints using Next.js 🚀 #livecoding"
                      maxLength={100}
                      className="w-full bg-[#171717] border border-[#2d2d2d] focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000]/50 rounded-xl px-4 py-3 text-white transition-all outline-none text-sm font-sans"
                      required
                    />
                    
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Include 1-2 searchable keywords.</span>
                      <span className={title.length > 70 ? 'text-amber-400 font-semibold' : ''}>
                        {title.length}/100
                      </span>
                    </div>

                    {/* Multiple Title Option Selector */}
                    {titleOptions.length > 1 && (
                      <div className="bg-[#272727]/30 border border-[#2d2d2d] rounded-xl p-4 mt-3 space-y-2.5">
                        <p className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#ff0000]" />
                          Multiple Title Options Found:
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {titleOptions.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setTitle(opt)}
                              className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all ${
                                title === opt 
                                  ? 'bg-[#ff0000]/10 border-[#ff0000] text-white font-medium' 
                                  : 'bg-[#171717] border-[#2d2d2d] text-zinc-400 hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Stream Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Welcome to today's stream! Today we'll cover..."
                      rows={6}
                      className="w-full bg-[#171717] border border-[#2d2d2d] focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000]/50 rounded-xl p-4 text-white transition-all outline-none font-sans text-sm"
                    />
                  </div>

                  {/* Grid Inputs (Category, Privacy, Time) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Tv className="h-4 w-4 text-zinc-400" /> Category
                      </label>
                      <div className="relative">
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2d2d2d] focus:border-[#ff0000] rounded-xl px-3 py-3 text-white transition-all outline-none appearance-none cursor-pointer text-sm font-sans"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                          ▼
                        </div>
                      </div>

                      {/* Dynamic Warning for Gaming Category */}
                      {categoryId === '20' && (
                        <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 leading-normal font-sans">
                          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                          API constraint: Set specific Game Title in YouTube Studio.
                        </p>
                      )}
                    </div>

                    {/* Privacy Status */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-zinc-400" /> Privacy
                      </label>
                      <div className="relative">
                        <select
                          value={privacyStatus}
                          onChange={(e) => setPrivacyStatus(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2d2d2d] focus:border-[#ff0000] rounded-xl px-3 py-3 text-white transition-all outline-none appearance-none cursor-pointer text-sm font-sans"
                        >
                          {PRIVACY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Scheduled Time */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-400" /> Scheduled Start <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-[#171717] border border-[#2d2d2d] focus:border-[#ff0000] rounded-xl px-3 py-2.5 text-white transition-all outline-none text-sm cursor-pointer font-sans"
                        required
                      />
                    </div>

                  </div>

                  {/* Enforced Guidelines Setting */}
                  <div className="bg-[#171717] border border-[#2d2d2d] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Family Safety Settings</h4>
                      <p className="text-[10px] text-zinc-400">This broadcast configuration is set according to YouTube Terms.</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      🚫 Not Made for Kids (Auto-enforced)
                    </span>
                  </div>

                  {/* SEO Search Tags */}
                  <TagManager tags={tags} onTagsChange={setTags} />

                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="w-full py-4 px-6 rounded-xl bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold tracking-wide transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm font-sans"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                          Scheduling Broadcast Event...
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5" />
                          Generate & Schedule stream to YouTube
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>

          {/* Sync Progress Overlay */}
          <SyncOverlay 
            isSyncing={isSyncing}
            syncSteps={syncSteps}
            syncStatus={syncStatus}
            syncError={syncError}
            syncResultVideoId={syncResultVideoId}
            thumbnailProvided={!!thumbnailFile}
            boundStream={boundStream}
            onClose={() => {
              setIsSyncing(false);
              setSyncStatus('idle');
            }}
          />

        </main>
      </div>

      {/* GitHub Footer links */}
      <footer className="border-t border-[#2d2d2d] bg-[#0f0f0f] py-6 text-center text-xs text-zinc-500 mt-12">
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

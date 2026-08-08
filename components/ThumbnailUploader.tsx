'use client';

import { useRef, DragEvent } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

interface ThumbnailUploaderProps {
  thumbnailPreview: string | null;
  compressing: boolean;
  originalSize: string | null;
  compressedSize: string | null;
  onImageUpload: (file: File) => void;
  onClear: () => void;
  showFeedback: (type: 'success' | 'error', message: string) => void;
}

export default function ThumbnailUploader({
  thumbnailPreview,
  compressing,
  originalSize,
  compressedSize,
  onImageUpload,
  onClear,
  showFeedback
}: ThumbnailUploaderProps) {
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    } else {
      showFeedback('error', 'Only image files (.png, .jpg, .jpeg) are accepted.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-6 space-y-4 shadow-md"
    >
      <h3 className="font-semibold text-zinc-100 text-sm">Stream Thumbnail</h3>
      
      {thumbnailPreview ? (
        <div className="relative rounded-xl overflow-hidden border border-[#2d2d2d] bg-black/40 group aspect-video">
          <img 
            src={thumbnailPreview} 
            alt="Thumbnail preview" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => imgInputRef.current?.click()}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-semibold border border-white/10 transition-all"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-300 text-xs font-semibold border border-red-500/20 transition-all"
            >
              Remove
            </button>
          </div>
          {compressing && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-[#ff0000] mx-auto" />
                <p className="text-xs text-zinc-400">Compressing Image...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => imgInputRef.current?.click()}
          className="border-2 border-dashed border-[#3f3f3f] hover:border-[#ff0000]/50 hover:bg-[#ff0000]/[0.02] rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group"
        >
          <div className="space-y-3">
            <div className="mx-auto w-10 h-10 rounded-lg bg-[#ff0000]/10 text-[#ff0000] flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-200">Drag and drop thumbnail file</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Supports PNG, JPG, JPEG (Max 10MB)</p>
            </div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={imgInputRef}
        onChange={handleFileChange}
        accept="image/*" 
        className="hidden" 
      />

      {originalSize && compressedSize && (
        <div className="bg-[#171717] border border-[#2d2d2d] rounded-lg p-3 flex justify-between items-center text-xs">
          <div className="space-y-0.5">
            <p className="text-zinc-500">Original Size</p>
            <p className="font-semibold text-zinc-300">{originalSize}</p>
          </div>
          <div className="h-6 w-px bg-[#2d2d2d]" />
          <div className="space-y-0.5 text-right">
            <p className="text-[#ff0000] font-medium">Compressed</p>
            <p className="font-semibold text-zinc-300">{compressedSize}</p>
          </div>
        </div>
      )}
    </div>
  );
}

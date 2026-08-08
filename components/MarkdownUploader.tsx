'use client';

import { useRef, DragEvent } from 'react';
import { FileText } from 'lucide-react';

interface MarkdownUploaderProps {
  onMarkdownUpload: (file: File) => void;
  showFeedback: (type: 'success' | 'error', message: string) => void;
}

export default function MarkdownUploader({ onMarkdownUpload, showFeedback }: MarkdownUploaderProps) {
  const mdInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isAcceptable = 
        file.name.endsWith('.md') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.json') || 
        file.name.endsWith('.yaml') || 
        file.name.endsWith('.yml');

      if (isAcceptable) {
        onMarkdownUpload(file);
      } else {
        showFeedback('error', 'Only .md, .txt, .json, .yaml, or .yml files are accepted.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onMarkdownUpload(file);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => mdInputRef.current?.click()}
      className="bg-[#1f1f1f] border-2 border-dashed border-[#3f3f3f] hover:border-[#ff0000]/50 hover:bg-[#ff0000]/[0.02] rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group"
    >
      <input 
        type="file" 
        ref={mdInputRef}
        onChange={handleFileChange}
        accept=".md,.txt,.json,.yaml,.yml" 
        className="hidden" 
      />
      
      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 rounded-xl bg-[#ff0000]/10 text-[#ff0000] flex items-center justify-center group-hover:scale-115 transition-all duration-300">
          <FileText className="h-6 w-6" />
        </div>
        
        <div>
          <h3 className="font-semibold text-zinc-100">Import Config File</h3>
          <p className="text-xs text-zinc-400 mt-1">Drag and drop file here, or click to browse</p>
          <p className="text-[10px] text-zinc-500 mt-2">Supports .md, .json, .yaml, .yml, .txt</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, DragEvent } from 'react';
import { FileText, ClipboardList, Braces, Copy } from 'lucide-react';

interface MarkdownUploaderProps {
  onMarkdownUpload: (file: File) => void;
  onTextParse: (text: string) => void;
  showFeedback: (type: 'success' | 'error', message: string) => void;
}

export default function MarkdownUploader({ 
  onMarkdownUpload, 
  onTextParse, 
  showFeedback 
}: MarkdownUploaderProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
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

  const handleApplyPaste = () => {
    if (!pasteText.trim()) {
      showFeedback('error', 'Please paste some configuration text first.');
      return;
    }
    onTextParse(pasteText);
  };

  return (
    <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-md">
      
      {/* Importer tab buttons */}
      <div className="flex border-b border-[#2d2d2d] bg-[#171717]">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'upload'
              ? 'border-[#ff0000] text-white bg-white/[0.01]'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> File Upload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'paste'
              ? 'border-[#ff0000] text-white bg-white/[0.01]'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ClipboardList className="h-3.5 w-3.5" /> Paste Config
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'upload' ? (
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => mdInputRef.current?.click()}
            className="border-2 border-dashed border-[#2d2d2d] hover:border-[#ff0000]/50 hover:bg-[#ff0000]/[0.02] rounded-xl p-6 text-center cursor-pointer transition-all duration-300 group"
          >
            <input 
              type="file" 
              ref={mdInputRef}
              onChange={handleFileChange}
              accept=".md,.txt,.json,.yaml,.yml" 
              className="hidden" 
            />
            
            <div className="space-y-3">
              <div className="mx-auto w-10 h-10 rounded-lg bg-[#ff0000]/10 text-[#ff0000] flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <FileText className="h-5 w-5" />
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-zinc-200">Import Config File</h4>
                <p className="text-[10px] text-zinc-500 mt-1">Drag file here, or click to browse</p>
                <p className="text-[9px] text-zinc-600 mt-2">Supports .md, .json, .yaml, .yml</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Paste your JSON, YAML, or Markdown content here...\n\nExample:\n{\n  "title": "Stream Title",\n  "tags": ["tag1", "tag2"]\n}`}
              className="w-full h-36 bg-[#171717] border border-[#2d2d2d] rounded-xl p-3 text-xs text-zinc-300 font-mono outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000]/50 placeholder-zinc-600 resize-none leading-relaxed"
            />
            <button
              type="button"
              onClick={handleApplyPaste}
              className="w-full py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Braces className="h-3.5 w-3.5" /> Apply Configuration
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

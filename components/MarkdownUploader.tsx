'use client';

import { useState, useRef, DragEvent } from 'react';
import { FileText, ClipboardList, Braces, Sparkles } from 'lucide-react';

interface MarkdownUploaderProps {
  onMarkdownUpload: (file: File) => void;
  onTextParse: (text: string) => void;
  showFeedback: (type: 'success' | 'error', message: string) => void;
}

const MD_SAMPLE = `---
title: "Next.js Live Coding Session 🚀 #webdev #nextjs"
type: "28"
privacy: "unlisted"
tags: ["nextjs", "typescript", "api", "livecoding"]
---
Welcome to my stream! 

In today's coding session, we are setting up serverless endpoints, defining secure session hooks, and binding database structures. 

Be sure to ask questions in the chat!`;

const JSON_SAMPLE = `{
  "titles": [
    "Building an App Logins from Scratch 🔐 #oauth #security",
    "Complete Google Sign-In Integration ⚡ #nextjs #auth"
  ],
  "categoryId": "28",
  "privacyStatus": "unlisted",
  "tags": ["oauth2", "google login", "session", "webdev"],
  "description": "Welcome! In this broadcast we build secure user login portals from scratch using client-side cookie decryptions."
}`;

const YAML_SAMPLE = `title:
  - "React Hook Forms Guide 💻 #reactjs"
  - "Live Coding: Parsing Complex Forms in React 🚀 #tutorial"
category: "20"
privacy: "public"
tags:
  - react
  - forms
  - webdev
description: |
  Hey everyone, welcome back to the channel!
  
  Today, we are writing clean form components with validator bindings.`;

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
              placeholder={`Paste your JSON, YAML, or Markdown content here...\n\nOr click one of the quick template generator buttons below to edit a sample configuration on the go!`}
              className="w-full h-36 bg-[#171717] border border-[#2d2d2d] rounded-xl p-3 text-xs text-zinc-300 font-mono outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000]/50 placeholder-zinc-600 resize-none leading-relaxed"
            />
            
            {/* Quick sample template injector writer */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500 py-1">
              <span className="flex items-center gap-1 text-zinc-400">
                <Sparkles className="h-3 w-3 text-[#ff0000]" /> Templates:
              </span>
              <button 
                type="button" 
                onClick={() => setPasteText(MD_SAMPLE)} 
                className="hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-2 py-1 rounded transition-colors"
              >
                Markdown
              </button>
              <button 
                type="button" 
                onClick={() => setPasteText(JSON_SAMPLE)} 
                className="hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-2 py-1 rounded transition-colors"
              >
                JSON
              </button>
              <button 
                type="button" 
                onClick={() => setPasteText(YAML_SAMPLE)} 
                className="hover:text-white bg-[#272727] hover:bg-[#3f3f3f] px-2 py-1 rounded transition-colors"
              >
                YAML
              </button>
            </div>

            <button
              type="button"
              onClick={handleApplyPaste}
              className="w-full py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md mt-1"
            >
              <Braces className="h-3.5 w-3.5" /> Apply Configuration
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

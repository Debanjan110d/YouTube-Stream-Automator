'use client';

import { useState, KeyboardEvent } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
}

export default function TagManager({ tags, onTagsChange }: TagManagerProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const cleanTag = newTag.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      onTagsChange([...tags, cleanTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
        <Tag className="h-4 w-4 text-[#ff0000]" /> Stream Tags ({tags.length})
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add search tag (press Enter)"
          className="flex-1 bg-[#171717] border border-[#2d2d2d] focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000]/50 rounded-xl px-4 py-2.5 text-white transition-all outline-none text-sm font-sans"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] rounded-xl text-white font-semibold transition-all flex items-center gap-1.5 text-sm"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-3 bg-[#171717] border border-[#2d2d2d] rounded-xl max-h-32 overflow-y-auto">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1.5 bg-[#2d2d2d] border border-[#3f3f3f] text-zinc-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
            >
              {tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                className="text-zinc-500 hover:text-red-400 focus:outline-none transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-zinc-500 italic">No tags added yet. Search tags improve search visibility.</p>
      )}
    </div>
  );
}

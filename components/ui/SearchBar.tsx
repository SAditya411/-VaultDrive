'use client';

import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search files…' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-1 max-w-md group">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-violet-400 transition-colors"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
      />
      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

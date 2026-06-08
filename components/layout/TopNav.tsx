'use client';

import { Upload } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';

interface TopNavProps {
  title: string;
  subtitle?: string;
  search?: { value: string; onChange: (v: string) => void };
  onUpload?: () => void;
}

export default function TopNav({ title, subtitle, search, onUpload }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b border-white/8 bg-[#0a0a0f]/80 backdrop-blur-xl">
      {/* Title – left-padded on mobile for hamburger */}
      <div className="flex-1 pl-10 lg:pl-0 min-w-0">
        <h2 className="text-lg font-semibold text-white truncate leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      {search && (
        <div className="hidden sm:flex flex-1 max-w-sm">
          <SearchBar value={search.value} onChange={search.onChange} />
        </div>
      )}

      {/* Upload CTA */}
      {onUpload && (
        <button
          onClick={onUpload}
          id="upload-btn"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>
      )}
    </header>
  );
}

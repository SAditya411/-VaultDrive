'use client';

import { Bell, Search, Upload } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';

interface TopNavProps {
  title: string;
  subtitle?: string;
  search?: { value: string; onChange: (v: string) => void };
  onUpload?: () => void;
}

export default function TopNav({ title, subtitle, search, onUpload }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-5 py-4 border-b border-white/60 bg-white/24 backdrop-blur-2xl">
      {/* Title – left-padded on mobile for hamburger */}
      <div className="flex-1 pl-10 lg:pl-0 min-w-0">
        <h2 className="text-lg font-semibold text-black truncate leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-black/40 mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      {search && (
        <div className="hidden sm:flex flex-1 max-w-sm">
          <SearchBar value={search.value} onChange={search.onChange} />
        </div>
      )}

      <button
        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/55 border border-white/70 text-black/55 hover:text-black transition-colors"
        title="Search"
      >
        <Search size={17} />
      </button>

      <button
        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/55 border border-white/70 text-black/55 hover:text-black transition-colors"
        title="Notifications"
      >
        <Bell size={17} />
      </button>

      {/* Upload CTA */}
      {onUpload && (
        <button
          onClick={onUpload}
          id="upload-btn"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-sm font-medium shadow-lg shadow-black/10 transition-all hover:bg-black/85 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>
      )}
    </header>
  );
}

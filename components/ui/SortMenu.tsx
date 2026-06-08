'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { SortOption } from '@/types';

interface SortMenuProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'size_desc', label: 'Largest first' },
  { value: 'size_asc', label: 'Smallest first' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
];

export default function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <ArrowUpDown size={14} />
        <span>{current?.label ?? 'Sort'}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 glass-card rounded-xl py-1 shadow-xl z-50 border border-white/10">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {opt.label}
              {value === opt.value && <Check size={14} className="text-violet-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

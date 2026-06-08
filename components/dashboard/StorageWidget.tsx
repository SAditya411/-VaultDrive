'use client';

import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/formatters';

interface StorageWidgetProps {
  used: number;
  total?: number; // bytes; defaults to 1GB Supabase free tier
}

export default function StorageWidget({ used, total = 1073741824 }: StorageWidgetProps) {
  const percent = Math.min(100, (used / total) * 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const color =
    percent > 85 ? '#ef4444' : percent > 60 ? '#f59e0b' : '#8b5cf6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl p-6 border border-white/8"
    >
      <div className="flex items-center gap-2 mb-5">
        <HardDrive size={16} className="text-violet-400" />
        <h3 className="text-sm font-semibold text-white">Storage</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* SVG ring */}
        <div className="relative shrink-0">
          <svg width="128" height="128" className="-rotate-90">
            {/* Track */}
            <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            {/* Progress */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">{Math.round(percent)}%</span>
            <span className="text-[10px] text-white/40">used</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-white/40 mb-1">Used</p>
            <p className="text-base font-semibold text-white">{formatFileSize(used)}</p>
          </div>
          <div className="h-px bg-white/8" />
          <div>
            <p className="text-xs text-white/40 mb-1">Available</p>
            <p className="text-base font-semibold text-white">{formatFileSize(total - used)}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Total</p>
            <p className="text-sm text-white/60">{formatFileSize(total)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0–100
  status?: 'uploading' | 'success' | 'error' | 'pending';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusColors = {
  pending: 'bg-white/20',
  uploading: 'bg-gradient-to-r from-violet-500 to-blue-500',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  error: 'bg-gradient-to-r from-red-500 to-rose-500',
};

export default function ProgressBar({ progress, status = 'uploading', showLabel = false, size = 'md' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1' : 'h-1.5';
  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${statusColors[status]}`}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/50 mt-1 text-right">
          {status === 'success' ? 'Done' : status === 'error' ? 'Failed' : `${Math.round(progress)}%`}
        </p>
      )}
    </div>
  );
}

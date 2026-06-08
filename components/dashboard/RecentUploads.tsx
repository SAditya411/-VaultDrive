'use client';

import { motion } from 'framer-motion';
import { Clock, Image, Video, Music, FileText, File, Archive } from 'lucide-react';
import { FileRecord } from '@/types';
import { getFileCategory } from '@/lib/utils/fileIcons';
import { formatFileSize, formatDate, truncateFileName } from '@/lib/utils/formatters';
import Link from 'next/link';

const ICON_MAP = {
  image: { icon: Image, color: 'text-violet-400' },
  video: { icon: Video, color: 'text-rose-400' },
  audio: { icon: Music, color: 'text-green-400' },
  pdf: { icon: FileText, color: 'text-red-400' },
  document: { icon: FileText, color: 'text-blue-400' },
  spreadsheet: { icon: FileText, color: 'text-emerald-400' },
  archive: { icon: Archive, color: 'text-amber-400' },
  text: { icon: FileText, color: 'text-slate-400' },
  other: { icon: File, color: 'text-slate-400' },
};

interface RecentUploadsProps {
  files: FileRecord[];
}

export default function RecentUploads({ files }: RecentUploadsProps) {
  const recent = files.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-2xl border border-white/8"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Recent Uploads</h3>
        </div>
        <Link href="/files" className="text-xs text-white/40 hover:text-violet-400 transition-colors">
          View all →
        </Link>
      </div>

      {/* List */}
      {recent.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-white/30">No files uploaded yet</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {recent.map((file, i) => {
            const category = getFileCategory(file.file_type);
            const { icon: Icon, color } = ICON_MAP[category];
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/4 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0">
                  <Icon size={15} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate font-medium">{truncateFileName(file.file_name, 32)}</p>
                  <p className="text-xs text-white/30">{formatFileSize(file.file_size)}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0">{formatDate(file.uploaded_at)}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

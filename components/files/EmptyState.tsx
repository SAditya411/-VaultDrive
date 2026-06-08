'use client';

import { CloudOff, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  type?: 'files' | 'folders' | 'search';
  onUpload?: () => void;
}

const CONFIG = {
  files: {
    icon: CloudOff,
    title: 'No files yet',
    description: 'Upload your first file to get started.',
    action: 'Upload Files',
  },
  folders: {
    icon: CloudOff,
    title: 'No folders yet',
    description: 'Create a folder to organize your files.',
    action: null,
  },
  search: {
    icon: CloudOff,
    title: 'No results found',
    description: 'Try a different search term.',
    action: null,
  },
};

export default function EmptyState({ type = 'files', onUpload }: EmptyStateProps) {
  const { icon: Icon, title, description, action } = CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Icon size={28} className="text-white/20" />
      </div>
      <h3 className="text-base font-semibold text-white/60 mb-2">{title}</h3>
      <p className="text-sm text-white/30 max-w-xs mb-6">{description}</p>
      {action && onUpload && (
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
        >
          <Upload size={16} />
          {action}
        </button>
      )}
    </motion.div>
  );
}

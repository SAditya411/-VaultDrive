'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  Files,
} from 'lucide-react';
import { FolderRecord } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

interface FolderCardProps {
  folder: FolderRecord;
  onRename: (id: string, oldName: string) => void;
  onDelete: (id: string, name: string) => void;
  onClick: (name: string) => void;
}

export default function FolderCard({ folder, onRename, onDelete, onClick }: FolderCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(folder.id, folder.name);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="group relative glass-card rounded-2xl p-5 border border-white/8 hover:border-white/16 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Folder icon */}
        <button
          onClick={() => onClick(folder.name)}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/25 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <FolderOpen size={22} className="text-amber-400" />
        </button>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-lg text-white/0 group-hover:text-white/50 hover:!text-white hover:bg-white/10 transition-all"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 top-full mt-1 w-36 glass-card rounded-xl py-1 border border-white/10 shadow-xl z-20"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => { onRename(folder.id, folder.name); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                <Pencil size={13} /> Rename
              </button>
              <div className="h-px bg-white/8 my-1" />
              <button
                onClick={handleDelete}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors ${
                  confirmDelete ? 'text-red-400 bg-red-500/10' : 'text-white/70 hover:text-red-400 hover:bg-red-500/8'
                }`}
              >
                <Trash2 size={13} />
                {confirmDelete ? 'Confirm?' : 'Delete'}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Info */}
      <button onClick={() => onClick(folder.name)} className="w-full text-left">
        <p className="text-sm font-semibold text-white mb-1 truncate">{folder.name}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-white/40">
            <Files size={12} />
            {folder.file_count ?? 0} file{(folder.file_count ?? 0) !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-white/30">{formatDate(folder.created_at)}</span>
        </div>
      </button>
    </motion.div>
  );
}

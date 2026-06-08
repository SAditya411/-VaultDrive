'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Trash2,
  Eye,
  FolderInput,
  MoreHorizontal,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  AlignLeft,
  Sheet,
  File,
} from 'lucide-react';
import { FileRecord } from '@/types';
import { formatFileSize, formatDate, truncateFileName } from '@/lib/utils/formatters';
import { getFileCategory, getCategoryColor } from '@/lib/utils/fileIcons';
import { getDownloadUrl } from '@/lib/utils/downloadUrl';

const ICON_MAP = {
  image: Image,
  video: Video,
  audio: Music,
  pdf: FileText,
  document: FileText,
  spreadsheet: Sheet,
  archive: Archive,
  text: AlignLeft,
  other: File,
};

interface FileCardProps {
  file: FileRecord;
  onPreview: (file: FileRecord) => void;
  onDelete: (id: string, storagePath: string) => void;
  onMove: (id: string) => void;
}

export default function FileCard({ file, onPreview, onDelete, onMove }: FileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const category = getFileCategory(file.file_type);
  const colorClass = getCategoryColor(category);
  const IconComponent = ICON_MAP[category];
  const downloadUrl = getDownloadUrl(file.file_url, file.file_name);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(file.id, file.storage_path);
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
      transition={{ duration: 0.2 }}
      className="group relative glass-card rounded-2xl p-4 border border-white/8 hover:border-white/16 transition-all duration-300 cursor-pointer"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        {/* File type icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
          <IconComponent size={18} className="text-white" />
        </div>

        {/* Actions menu */}
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
              className="absolute right-0 top-full mt-1 w-40 glass-card rounded-xl py-1 border border-white/10 shadow-xl z-20"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onPreview(file); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                <Eye size={14} /> Preview
              </button>
              <a
                href={downloadUrl}
                download={file.file_name}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                <Download size={14} /> Download
              </a>
              <button
                onClick={(e) => { e.stopPropagation(); onMove(file.id); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                <FolderInput size={14} /> Move
              </button>
              <div className="h-px bg-white/8 my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors ${
                  confirmDelete ? 'text-red-400 bg-red-500/10' : 'text-white/70 hover:text-red-400 hover:bg-red-500/8'
                }`}
              >
                <Trash2 size={14} />
                {confirmDelete ? 'Confirm delete?' : 'Delete'}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Thumbnail for images */}
      {category === 'image' && (
        <div
          onClick={() => onPreview(file)}
          className="mb-3 h-28 rounded-xl overflow-hidden bg-white/5 border border-white/8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.file_url}
            alt={file.file_name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* File info */}
      <div onClick={() => onPreview(file)}>
        <p className="text-sm font-medium text-white leading-snug mb-1" title={file.file_name}>
          {truncateFileName(file.file_name)}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">{formatFileSize(file.file_size)}</span>
          <span className="text-xs text-white/30">{formatDate(file.uploaded_at)}</span>
        </div>
        {file.folder_name && file.folder_name !== 'root' && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/6 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[10px] text-white/50">{file.folder_name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

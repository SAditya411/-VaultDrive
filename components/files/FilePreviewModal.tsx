'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Music,
  File,
} from 'lucide-react';
import { FileRecord } from '@/types';
import { getFileCategory, isPreviewable } from '@/lib/utils/fileIcons';
import { formatFileSize, formatDate } from '@/lib/utils/formatters';

interface FilePreviewModalProps {
  file: FileRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilePreviewModal({ file, isOpen, onClose }: FilePreviewModalProps) {
  const [zoom, setZoom] = useState(1);

  if (!file) return null;
  const category = getFileCategory(file.file_type);
  const previewable = isPreviewable(file.file_type);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

          {/* Toolbar */}
          <motion.div
            className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
          >
            {/* File info */}
            <div className="min-w-0 flex-1 mr-4">
              <h3 className="text-sm font-semibold text-white truncate">{file.file_name}</h3>
              <p className="text-xs text-white/40 mt-0.5">
                {formatFileSize(file.file_size)} · {formatDate(file.uploaded_at)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {category === 'image' && (
                <>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-xs text-white/40 w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <div className="w-px h-5 bg-white/15 mx-1" />
                </>
              )}
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={16} />
              </a>
              <a
                href={file.file_url}
                download={file.file_name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white text-sm transition-colors"
              >
                <Download size={14} />
                Download
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>

          {/* Preview area */}
          <motion.div
            className="relative flex-1 flex items-center justify-center overflow-auto p-6"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.25 }}
          >
            {/* ── Image ── */}
            {category === 'image' && (
              <motion.img
                src={file.file_url}
                alt={file.file_name}
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            )}

            {/* ── PDF ── */}
            {category === 'pdf' && (
              <iframe
                src={`${file.file_url}#toolbar=1`}
                className="w-full max-w-4xl h-[75vh] rounded-xl border border-white/10 shadow-2xl bg-white"
                title={file.file_name}
              />
            )}

            {/* ── Video ── */}
            {category === 'video' && (
              <video
                src={file.file_url}
                controls
                className="max-w-full max-h-[75vh] rounded-xl shadow-2xl border border-white/10"
              />
            )}

            {/* ── Audio ── */}
            {category === 'audio' && (
              <div className="flex flex-col items-center gap-6 p-10">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 flex items-center justify-center">
                  <Music size={48} className="text-green-400" />
                </div>
                <p className="text-white/60 text-sm font-medium">{file.file_name}</p>
                <audio src={file.file_url} controls className="w-80" />
              </div>
            )}

            {/* ── Text ── */}
            {category === 'text' && (
              <div className="w-full max-w-3xl h-[70vh] overflow-auto">
                <iframe
                  src={file.file_url}
                  className="w-full h-full rounded-xl border border-white/10 bg-[#1a1a2e] text-white"
                  title={file.file_name}
                />
              </div>
            )}

            {/* ── Unsupported ── */}
            {!previewable && (
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <File size={40} className="text-white/30" />
                </div>
                <div>
                  <p className="text-white/60 font-medium mb-1">Preview not available</p>
                  <p className="text-white/30 text-sm">This file type cannot be previewed in the browser.</p>
                </div>
                <a
                  href={file.file_url}
                  download={file.file_name}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium"
                >
                  <Download size={16} />
                  Download File
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

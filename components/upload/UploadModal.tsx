'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FolderOpen,
  ChevronDown,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DropZone from './DropZone';
import ProgressBar from '@/components/ui/ProgressBar';
import { useUpload } from '@/lib/hooks/useUpload';
import { FolderRecord } from '@/types';
import { formatFileSize } from '@/lib/utils/formatters';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderRecord[];
  onComplete?: () => void;
}

export default function UploadModal({ isOpen, onClose, folders, onComplete }: UploadModalProps) {
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [folderDropdown, setFolderDropdown] = useState(false);
  const { uploads, isUploading, uploadFiles, resetUploads } = useUpload(onComplete);

  const handleFiles = (files: File[]) => {
    uploadFiles(files, selectedFolder);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetUploads();
      onClose();
    }
  };

  const allDone = uploads.length > 0 && uploads.every((u) => u.status === 'success' || u.status === 'error');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Files" size="md">
      <div className="p-6 space-y-5">
        {/* Folder Picker */}
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-widest mb-2 block">
            Destination Folder
          </label>
          <div className="relative">
            <button
              onClick={() => setFolderDropdown(!folderDropdown)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/8 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FolderOpen size={15} className="text-violet-400" />
                {selectedFolder === 'root' ? 'Root (no folder)' : selectedFolder}
              </span>
              <ChevronDown size={15} className={`text-white/40 transition-transform ${folderDropdown ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {folderDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 right-0 top-full mt-2 glass-card rounded-xl py-1 border border-white/10 shadow-xl z-10 max-h-44 overflow-y-auto"
                >
                  {[{ id: 'root', name: 'root' }, ...folders].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setSelectedFolder(f.name); setFolderDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedFolder === f.name
                          ? 'text-violet-300 bg-violet-500/10'
                          : 'text-white/70 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      {f.name === 'root' ? 'Root (no folder)' : f.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Drop Zone (only shown before uploads start) */}
        {uploads.length === 0 && (
          <DropZone onFiles={handleFiles} disabled={isUploading} />
        )}

        {/* Upload Progress List */}
        {uploads.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {uploads.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8"
              >
                {/* Status Icon */}
                <div className="shrink-0">
                  {u.status === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
                  {u.status === 'error' && <XCircle size={18} className="text-red-400" />}
                  {(u.status === 'uploading' || u.status === 'pending') && (
                    <Loader2 size={18} className="text-violet-400 animate-spin" />
                  )}
                </div>

                {/* File info + progress */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">{u.file.name}</p>
                  <p className="text-[11px] text-white/40 mb-1.5">{formatFileSize(u.file.size)}</p>
                  <ProgressBar progress={u.progress} status={u.status} size="sm" showLabel />
                  {u.error && <p className="text-[11px] text-red-400 mt-1">{u.error}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-white/30">
            {uploads.length > 0
              ? `${uploads.filter((u) => u.status === 'success').length} / ${uploads.length} complete`
              : 'Select files to begin'}
          </p>
          <div className="flex gap-3">
            {allDone && (
              <button
                onClick={() => { resetUploads(); }}
                className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white border border-white/10 hover:bg-white/8 transition-colors"
              >
                Upload More
              </button>
            )}
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white/8 border border-white/10 text-white hover:bg-white/12 transition-colors disabled:opacity-50"
            >
              {allDone ? 'Done' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

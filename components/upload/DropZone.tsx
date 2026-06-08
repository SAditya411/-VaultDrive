'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { CloudUpload, Plus } from 'lucide-react';
import { ACCEPTED_MIME_TYPES } from '@/lib/utils/fileIcons';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export default function DropZone({ onFiles, disabled }: DropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    disabled,
    multiple: true,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <motion.div
        animate={{
          borderColor: isDragActive ? 'rgba(139,92,246,0.8)' : 'rgba(255,255,255,0.12)',
          backgroundColor: isDragActive ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
          scale: isDragActive ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex flex-col items-center justify-center gap-4 h-52 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-violet-500/50 hover:bg-violet-500/5'
        }`}
      >
        {/* Animated icon */}
        <motion.div
          animate={{ y: isDragActive ? -6 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center"
        >
          <CloudUpload size={26} className={isDragActive ? 'text-violet-400' : 'text-white/40'} />
        </motion.div>

        <div className="text-center px-6">
          {isDragActive ? (
            <p className="text-violet-300 font-medium text-sm">Drop files here</p>
          ) : (
            <>
              <p className="text-white/70 text-sm font-medium mb-1">
                Drag & drop files here
              </p>
              <p className="text-white/30 text-xs">or click to browse</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-white/30">
          <span>Images, Videos, PDFs, Docs, ZIP, Audio</span>
        </div>

        {/* Click hint */}
        {!isDragActive && (
          <div className="absolute bottom-4 right-4 w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Plus size={14} className="text-violet-400" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

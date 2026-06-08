'use client';

import { AnimatePresence } from 'framer-motion';
import FileCard from './FileCard';
import { FileRecord } from '@/types';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from './EmptyState';

interface FileGridProps {
  files: FileRecord[];
  loading: boolean;
  search: string;
  onPreview: (file: FileRecord) => void;
  onDelete: (id: string, storagePath: string) => void;
  onMove: (id: string) => void;
  onUpload?: () => void;
}

export default function FileGrid({
  files,
  loading,
  search,
  onPreview,
  onDelete,
  onMove,
  onUpload,
}: FileGridProps) {
  if (loading) return <GridSkeleton count={8} />;

  if (files.length === 0) {
    return <EmptyState type={search ? 'search' : 'files'} onUpload={onUpload} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={onPreview}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

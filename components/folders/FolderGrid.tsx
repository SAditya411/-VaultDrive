'use client';

import { AnimatePresence } from 'framer-motion';
import FolderCard from './FolderCard';
import { FolderRecord } from '@/types';
import { FolderSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/files/EmptyState';

interface FolderGridProps {
  folders: FolderRecord[];
  loading: boolean;
  onRename: (id: string, oldName: string) => void;
  onDelete: (id: string, name: string) => void;
  onClick: (name: string) => void;
}

export default function FolderGrid({ folders, loading, onRename, onDelete, onClick }: FolderGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <FolderSkeleton key={i} />)}
      </div>
    );
  }

  if (folders.length === 0) {
    return <EmptyState type="folders" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onRename={onRename}
            onDelete={onDelete}
            onClick={onClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

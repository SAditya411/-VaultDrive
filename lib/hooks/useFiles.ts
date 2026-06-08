// ============================================================
// VaultDrive – useFiles hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileRecord, SortOption } from '@/types';
import { getFiles, deleteFile, moveFile } from '@/lib/supabase/actions';

export function useFiles(initialFolder?: string | null) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('date_desc');
  const [folder, setFolder] = useState<string | null>(initialFolder ?? null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFiles(folder, search, sort);
      setFiles(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, [folder, search, sort]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async (id: string, storagePath: string) => {
    try {
      await deleteFile(id, storagePath);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handleMove = async (id: string, folderName: string) => {
    try {
      await moveFile(id, folderName);
      await fetchFiles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to move file');
    }
  };

  return {
    files,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    folder,
    setFolder,
    refresh: fetchFiles,
    handleDelete,
    handleMove,
  };
}

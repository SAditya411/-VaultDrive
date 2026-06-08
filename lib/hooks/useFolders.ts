// ============================================================
// VaultDrive – useFolders hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { FolderRecord } from '@/types';
import { getFolders, createFolder, renameFolder, deleteFolder } from '@/lib/supabase/actions';

export function useFolders() {
  const [folders, setFolders] = useState<FolderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreate = async (name: string) => {
    try {
      const folder = await createFolder(name);
      setFolders((prev) => [{ ...folder, file_count: 0 }, ...prev]);
      return folder;
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleRename = async (id: string, oldName: string, newName: string) => {
    try {
      await renameFolder(id, oldName, newName);
      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)));
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteFolder(id, name);
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } catch (err: unknown) {
      throw err;
    }
  };

  return {
    folders,
    loading,
    error,
    refresh: fetchFolders,
    handleCreate,
    handleRename,
    handleDelete,
  };
}

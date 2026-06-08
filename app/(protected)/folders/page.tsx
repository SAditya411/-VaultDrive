'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import FolderGrid from '@/components/folders/FolderGrid';
import { useFolders } from '@/lib/hooks/useFolders';
import { Check, Loader2 } from 'lucide-react';

export default function FoldersPage() {
  const router = useRouter();
  const { folders, loading, handleCreate, handleRename, handleDelete } = useFolders();

  // Create folder modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Rename modal state
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameId, setRenameId] = useState('');
  const [renameOld, setRenameOld] = useState('');
  const [renameName, setRenameName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState('');

  // ── Create ─────────────────────────────────────────────
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCreating(true);
    setCreateError('');
    try {
      await handleCreate(trimmed);
      setCreateOpen(false);
      setNewName('');
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create folder');
    } finally {
      setCreating(false);
    }
  };

  // ── Rename ─────────────────────────────────────────────
  const openRename = (id: string, oldName: string) => {
    setRenameId(id);
    setRenameOld(oldName);
    setRenameName(oldName);
    setRenameError('');
    setRenameOpen(true);
  };

  const submitRename = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = renameName.trim();
    if (!trimmed || trimmed === renameOld) { setRenameOpen(false); return; }
    setRenaming(true);
    setRenameError('');
    try {
      await handleRename(renameId, renameOld, trimmed);
      setRenameOpen(false);
    } catch (err: unknown) {
      setRenameError(err instanceof Error ? err.message : 'Failed to rename folder');
    } finally {
      setRenaming(false);
    }
  };

  // ── Navigate to files filtered by folder ──────────────
  const handleFolderClick = (name: string) => {
    router.push(`/files?folder=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <TopNav
        title="Folders"
        subtitle={`${folders.length} folder${folders.length !== 1 ? 's' : ''}`}
      />

      <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            {loading ? 'Loading…' : `${folders.length} folder${folders.length !== 1 ? 's' : ''} · click a folder to browse its files`}
          </p>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} />
            New Folder
          </button>
        </div>

        {/* Folder Grid */}
        <FolderGrid
          folders={folders}
          loading={loading}
          onRename={openRename}
          onDelete={handleDelete}
          onClick={handleFolderClick}
        />
      </div>

      {/* ── Create Folder Modal ──────────────────────────── */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
            <motion.div
              className="relative glass-card rounded-2xl p-7 w-full max-w-sm border border-white/10 shadow-2xl"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/25 flex items-center justify-center">
                  <FolderPlus size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">New Folder</h3>
                  <p className="text-xs text-white/40">Give your folder a name</p>
                </div>
              </div>

              <form onSubmit={submitCreate} className="space-y-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setCreateError(''); }}
                  placeholder="Folder name"
                  autoFocus
                  maxLength={64}
                  className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/70 transition-all"
                />
                {createError && (
                  <p className="text-xs text-red-400">{createError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm text-white/50 border border-white/10 hover:bg-white/8 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim() || creating}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:from-violet-500 hover:to-indigo-500 transition-all"
                  >
                    {creating ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rename Folder Modal ──────────────────────────── */}
      <AnimatePresence>
        {renameOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRenameOpen(false)} />
            <motion.div
              className="relative glass-card rounded-2xl p-7 w-full max-w-sm border border-white/10 shadow-2xl"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
            >
              <h3 className="text-base font-semibold text-white mb-1">Rename Folder</h3>
              <p className="text-xs text-white/40 mb-5">Renaming &quot;{renameOld}&quot;</p>
              <form onSubmit={submitRename} className="space-y-4">
                <input
                  type="text"
                  value={renameName}
                  onChange={(e) => { setRenameName(e.target.value); setRenameError(''); }}
                  placeholder="New name"
                  autoFocus
                  maxLength={64}
                  className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/70 transition-all"
                />
                {renameError && <p className="text-xs text-red-400">{renameError}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setRenameOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm text-white/50 border border-white/10 hover:bg-white/8 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={!renameName.trim() || renaming}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-50 flex items-center justify-center gap-2">
                    {renaming ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    Rename
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

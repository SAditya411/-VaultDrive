'use client';

import { useState, useEffect } from 'react';
import TopNav from '@/components/layout/TopNav';
import FileGrid from '@/components/files/FileGrid';
import FilePreviewModal from '@/components/files/FilePreviewModal';
import UploadModal from '@/components/upload/UploadModal';
import SortMenu from '@/components/ui/SortMenu';
import SearchBar from '@/components/ui/SearchBar';
import { useFiles } from '@/lib/hooks/useFiles';
import { getFolders } from '@/lib/supabase/actions';
import { FileRecord, FolderRecord, SortOption } from '@/types';
import { ChevronDown, FolderOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilesPage() {
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folders, setFolders] = useState<FolderRecord[]>([]);
  const [folderDropOpen, setFolderDropOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<string | null>(null);
  const [moveDropOpen, setMoveDropOpen] = useState(false);

  const { files, loading, search, setSearch, sort, setSort, folder, setFolder, refresh, handleDelete, handleMove } = useFiles();

  useEffect(() => {
    getFolders().then(setFolders).catch(console.error);
  }, []);

  const openPreview = (file: FileRecord) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const openMove = (id: string) => {
    setMoveTarget(id);
    setMoveDropOpen(true);
  };

  const confirmMove = async (folderName: string) => {
    if (moveTarget) {
      await handleMove(moveTarget, folderName);
      setMoveTarget(null);
      setMoveDropOpen(false);
    }
  };

  const handleUploadComplete = () => {
    setUploadOpen(false);
    refresh();
  };

  return (
    <>
      <TopNav
        title="Files"
        subtitle={`${files.length} file${files.length !== 1 ? 's' : ''}`}
        onUpload={() => setUploadOpen(true)}
      />

      <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Folder filter */}
          <div className="relative">
            <button
              onClick={() => setFolderDropOpen(!folderDropOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <FolderOpen size={14} />
              <span>{folder ?? 'All folders'}</span>
              <ChevronDown size={14} className={`transition-transform ${folderDropOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {folderDropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-0 top-full mt-2 w-48 glass-card rounded-xl py-1 border border-white/10 shadow-xl z-30"
                >
                  <button
                    onClick={() => { setFolder(null); setFolderDropOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${!folder ? 'text-violet-300' : 'text-white/60 hover:text-white hover:bg-white/8'} transition-colors`}
                  >
                    All folders
                  </button>
                  {folders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setFolder(f.name); setFolderDropOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm ${folder === f.name ? 'text-violet-300' : 'text-white/60 hover:text-white hover:bg-white/8'} transition-colors`}
                    >
                      {f.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort */}
          <SortMenu value={sort} onChange={(v: SortOption) => setSort(v)} />

          {/* Active filter tag */}
          {folder && (
            <button
              onClick={() => setFolder(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 hover:bg-violet-500/25 transition-colors"
            >
              <span>{folder}</span>
              <X size={12} />
            </button>
          )}
        </div>

        {/* File Grid */}
        <FileGrid
          files={files}
          loading={loading}
          search={search}
          onPreview={openPreview}
          onDelete={handleDelete}
          onMove={openMove}
          onUpload={() => setUploadOpen(true)}
        />
      </div>

      {/* Move file modal */}
      <AnimatePresence>
        {moveDropOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMoveDropOpen(false)} />
            <motion.div
              className="relative glass-card rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
            >
              <h3 className="text-base font-semibold text-white mb-1">Move file to…</h3>
              <p className="text-sm text-white/40 mb-5">Select a destination folder</p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                <button
                  onClick={() => confirmMove('root')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors text-left"
                >
                  <FolderOpen size={15} className="text-amber-400" />
                  Root (no folder)
                </button>
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => confirmMove(f.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors text-left"
                  >
                    <FolderOpen size={15} className="text-amber-400" />
                    {f.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setMoveDropOpen(false)}
                className="w-full mt-4 py-2.5 rounded-xl text-sm text-white/50 border border-white/10 hover:bg-white/8 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <FilePreviewModal file={previewFile} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        folders={folders}
        onComplete={handleUploadComplete}
      />
    </>
  );
}

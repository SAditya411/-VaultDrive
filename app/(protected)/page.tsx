'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Files, HardDrive, Image, FolderOpen, Upload, Zap } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentUploads from '@/components/dashboard/RecentUploads';
import StorageWidget from '@/components/dashboard/StorageWidget';
import UploadModal from '@/components/upload/UploadModal';
import { StatSkeleton } from '@/components/ui/LoadingSkeleton';
import { getStorageStats, getFiles } from '@/lib/supabase/actions';
import { getFolders } from '@/lib/supabase/actions';
import { formatFileSize } from '@/lib/utils/formatters';
import { StorageStats, FileRecord, FolderRecord } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [folders, setFolders] = useState<FolderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = async () => {
    try {
      const [s, f, fo] = await Promise.all([
        getStorageStats(),
        getFiles(null, '', 'date_desc'),
        getFolders(),
      ]);
      setStats(s);
      setFiles(f);
      setFolders(fo);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUploadComplete = () => {
    setUploadOpen(false);
    load();
  };

  const STAT_CARDS = stats
    ? [
        {
          label: 'Total Files',
          value: stats.totalFiles.toString(),
          icon: Files,
          gradient: 'from-violet-500 to-indigo-600',
        },
        {
          label: 'Storage Used',
          value: formatFileSize(stats.totalSize),
          icon: HardDrive,
          gradient: 'from-blue-500 to-cyan-600',
        },
        {
          label: 'Images',
          value: stats.imageCount.toString(),
          icon: Image,
          gradient: 'from-purple-500 to-pink-600',
        },
        {
          label: 'Folders',
          value: folders.length.toString(),
          icon: FolderOpen,
          gradient: 'from-amber-500 to-orange-600',
        },
      ]
    : [];

  return (
    <>
      <TopNav
        title="Dashboard"
        subtitle="Welcome back to VaultDrive"
        onUpload={() => setUploadOpen(true)}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-purple-600/10 border border-violet-500/25 p-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-violet-400" />
                <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">VaultDrive</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Your personal cloud, secured.</h2>
              <p className="text-sm text-white/50">
                {stats ? `${stats.totalFiles} files · ${formatFileSize(stats.totalSize)} used` : 'Loading your vault…'}
              </p>
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all"
            >
              <Upload size={16} />
              Quick Upload
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : STAT_CARDS.map((card, i) => (
                <StatsCard key={card.label} {...card} delay={i * 0.08} />
              ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent uploads — takes 2/3 */}
          <div className="lg:col-span-2">
            <RecentUploads files={files} />
          </div>

          {/* Storage widget — takes 1/3 */}
          <div>
            <StorageWidget used={stats?.totalSize ?? 0} />
          </div>
        </div>

        {/* File type breakdown */}
        {stats && stats.totalFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card rounded-2xl p-5 border border-white/8"
          >
            <h3 className="text-sm font-semibold text-white mb-4">File Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Images', count: stats.imageCount, color: 'from-violet-500 to-purple-600', w: (stats.imageCount / stats.totalFiles) * 100 },
                { label: 'Videos', count: stats.videoCount, color: 'from-rose-500 to-pink-600', w: (stats.videoCount / stats.totalFiles) * 100 },
                { label: 'Documents', count: stats.docCount, color: 'from-blue-500 to-indigo-600', w: (stats.docCount / stats.totalFiles) * 100 },
                { label: 'Other', count: stats.otherCount, color: 'from-slate-500 to-slate-700', w: (stats.otherCount / stats.totalFiles) * 100 },
              ].map(({ label, count, color, w }) => (
                <div key={label} className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-xs text-white/40 mb-2">{label}</p>
                  <p className="text-lg font-bold text-white mb-2">{count}</p>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${w}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        folders={folders}
        onComplete={handleUploadComplete}
      />
    </>
  );
}

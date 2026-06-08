'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HardDrive,
  Database,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  ExternalLink,
  LogOut,
  Info,
  Zap,
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import { getStorageStats } from '@/lib/supabase/actions';
import { formatFileSize } from '@/lib/utils/formatters';
import { StorageStats } from '@/types';
import { useRouter } from 'next/navigation';

const INFO_ROWS = [
  { label: 'Bucket Name', value: 'vault' },
  { label: 'Storage Provider', value: 'Supabase Storage' },
  { label: 'Database', value: 'PostgreSQL (Supabase)' },
  { label: 'Framework', value: 'Next.js 15 (App Router)' },
  { label: 'Styling', value: 'Tailwind CSS v4' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    getStorageStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vaultdrive_auth');
    router.replace('/lock');
  };

  const STORAGE_TOTAL = 1073741824; // 1 GB
  const usedPercent = stats ? Math.min(100, (stats.totalSize / STORAGE_TOTAL) * 100) : 0;

  return (
    <>
      <TopNav title="Settings" subtitle="Application configuration & storage info" />

      <div className="flex-1 p-6 space-y-6 max-w-3xl mx-auto w-full">

        {/* ── Storage Overview ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/8">
            <HardDrive size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Storage Usage</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Usage bar */}
            <div>
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>{loading ? '…' : formatFileSize(stats?.totalSize ?? 0)} used</span>
                <span>{formatFileSize(STORAGE_TOTAL)} total</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    usedPercent > 85
                      ? 'bg-gradient-to-r from-red-500 to-rose-500'
                      : usedPercent > 60
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${usedPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <p className="text-xs text-white/30 mt-1.5">
                {formatFileSize(STORAGE_TOTAL - (stats?.totalSize ?? 0))} remaining · Supabase free tier (1 GB)
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Files', value: stats?.totalFiles ?? '–' },
                { label: 'Images', value: stats?.imageCount ?? '–' },
                { label: 'Videos', value: stats?.videoCount ?? '–' },
                { label: 'Documents', value: stats?.docCount ?? '–' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-[10px] text-white/40 mb-1 uppercase tracking-widest">{label}</p>
                  <p className="text-lg font-bold text-white">{loading ? '…' : value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Supabase Connection ────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/8">
            <Database size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Supabase Connection</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* URL */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-xs text-white/40 mb-1">Project URL</p>
                <p className="text-sm text-white truncate font-mono">
                  {supabaseUrl ?? <span className="text-red-400">Not configured</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {supabaseUrl ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <a
                      href={supabaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </>
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>
            </div>

            {/* Anon key */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-xs text-white/40 mb-1">Anon Key</p>
                <p className="text-sm text-white/60 font-mono">
                  {supabaseKey
                    ? `${supabaseKey.slice(0, 20)}…`
                    : <span className="text-red-400">Not configured</span>}
                </p>
              </div>
              {supabaseKey ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <XCircle size={16} className="text-red-400 shrink-0" />
              )}
            </div>
          </div>
        </motion.section>

        {/* ── Security ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="glass-card rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/8">
            <Shield size={16} className="text-green-400" />
            <h2 className="text-sm font-semibold text-white">Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8">
              <div className="flex items-center gap-3">
                <Key size={16} className="text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-white">Access Code</p>
                  <p className="text-xs text-white/40">Configured via ACCESS_CODE env var</p>
                </div>
              </div>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <Info size={15} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300/80 leading-relaxed">
                VaultDrive uses a single access code for protection. For production use,
                consider adding Supabase Row Level Security policies and rotating your access code regularly.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/25 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut size={15} />
              Lock VaultDrive (sign out)
            </button>
          </div>
        </motion.section>

        {/* ── App Info ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/8">
            <Zap size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Application Info</h2>
          </div>
          <div className="divide-y divide-white/5">
            {INFO_ROWS.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-white/40">{label}</span>
                <span className="text-sm text-white/80 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </>
  );
}

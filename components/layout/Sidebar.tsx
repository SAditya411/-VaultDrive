'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Files,
  FolderOpen,
  NotebookPen,
  Settings,
  HardDrive,
  Menu,
  X,
  Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/files', label: 'Files', icon: Files },
  { href: '/folders', label: 'Folders', icon: FolderOpen },
  { href: '/notes', label: 'Notes', icon: NotebookPen },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">VaultDrive</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Personal Cloud</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/10 border border-violet-500/30 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 transition-colors ${active ? 'text-violet-400' : 'text-white/40 group-hover:text-white/70'}`}
              />
              <span className="relative z-10">{label}</span>
              {active && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Storage Widget */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive size={14} className="text-violet-400" />
            <span className="text-xs font-medium text-white/70">Supabase Storage</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full w-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
          </div>
          <p className="text-[11px] text-white/40">Connect Supabase to see usage</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 glass-sidebar border-r border-white/8">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-card border border-white/10 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-72 glass-sidebar z-50 lg:hidden border-r border-white/10"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

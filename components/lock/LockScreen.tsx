'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (response.ok && result.ok) {
        localStorage.setItem('vaultdrive_auth', 'true');
        onUnlock();
      } else {
        setError(result.message ?? 'Invalid access code. Please try again.');
        setCode('');
      }
    } catch {
      setError('Something went wrong. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.08),transparent_35%),linear-gradient(225deg,rgba(139,92,246,0.12),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(10,10,15,0.82)_72%)]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="glass-card rounded-3xl p-8 border border-white/12 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/40 mb-4"
            >
              <Shield size={28} className="text-white" />
            </motion.div>
            <h1 className="text-xl font-bold text-white tracking-tight">VaultDrive</h1>
            <p className="text-sm text-white/40 mt-1">Enter your access code to continue</p>
          </div>

          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-white/6 border border-white/12 flex items-center justify-center">
              <Lock size={18} className="text-white/40" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="Access code"
                autoFocus
                className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/70 focus:bg-white/8 transition-all text-center tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={!code || loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                'Unlock VaultDrive'
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-[11px] text-white/20 mt-6">
            Set your code in the ACCESS_CODE environment variable
          </p>
        </div>
      </motion.div>
    </div>
  );
}

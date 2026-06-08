'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Shield } from 'lucide-react';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#d8dce3] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.9),transparent_36%),radial-gradient(circle_at_82%_20%,rgba(184,193,207,0.55),transparent_32%),linear-gradient(135deg,#c7ccd5_0%,#eef1f5_52%,#c6ccd6_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(126,135,150,0.22),transparent)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-[2rem] border border-white/80 bg-white/62 p-8 shadow-[0_30px_100px_rgba(67,75,89,0.28)] backdrop-blur-2xl">
          <div className="mb-8 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-xl shadow-black/15"
            >
              <Shield size={28} className="text-white" />
            </motion.div>
            <h1 className="text-xl font-bold tracking-tight text-black">VaultDrive</h1>
            <p className="mt-1 text-sm text-black/45">Enter your access code to continue</p>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-white/70 shadow-sm">
              <Lock size={18} className="text-black/38" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="Access code"
                autoFocus
                className="w-full rounded-full border border-white/90 bg-white/70 px-4 py-3.5 text-center text-sm tracking-widest text-black shadow-sm outline-none placeholder:text-black/30 transition-all focus:border-black/25 focus:bg-white/90"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/32 transition-colors hover:text-black/65"
              >
                {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-red-700"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={!code || loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/12 transition-all hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Unlock VaultDrive'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-black/32">
            Set your code in the ACCESS_CODE environment variable
          </p>
        </div>
      </motion.div>
    </div>
  );
}

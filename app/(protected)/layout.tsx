'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { Shield } from 'lucide-react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('vaultdrive_auth');
    if (auth !== 'true') {
      router.replace('/lock');
    } else {
      setChecked(true);
    }
  }, [router]);

  // While checking auth, show a minimal spinner
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <Shield size={22} className="text-white" />
          </div>
          <p className="text-sm text-white/30 animate-pulse">Loading VaultDrive…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}

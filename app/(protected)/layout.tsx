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

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d8dce3]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center animate-pulse">
            <Shield size={22} className="text-white" />
          </div>
          <p className="text-sm text-black/40 animate-pulse">Loading VaultDrive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sugar-ui min-h-screen p-3 sm:p-5 lg:p-7">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1520px] overflow-hidden rounded-[2rem] border border-white/70 bg-white/28 shadow-[0_40px_120px_rgba(60,68,82,0.28)] backdrop-blur-2xl">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      </div>
    </div>
  );
}

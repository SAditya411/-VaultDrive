'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LockScreen from '@/components/lock/LockScreen';

export default function LockPage() {
  const router = useRouter();

  // If already authenticated, go to dashboard immediately
  useEffect(() => {
    if (localStorage.getItem('vaultdrive_auth') === 'true') {
      router.replace('/');
    }
  }, [router]);

  const handleUnlock = () => {
    router.replace('/');
  };

  return <LockScreen onUnlock={handleUnlock} />;
}

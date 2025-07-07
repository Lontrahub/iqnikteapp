
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Leaf, LoaderCircle } from 'lucide-react';

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check for language preference first.
    const language = typeof window !== 'undefined' ? localStorage.getItem('app_language') : null;

    if (!language) {
      router.replace('/language-selection');
      return;
    }

    // If language is set, proceed with auth check
    if (loading) {
      return;
    }
    
    if (user) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex items-center gap-4 mb-4">
        <Leaf className="h-16 w-16 text-primary" />
        <span className="font-headline text-5xl font-bold text-primary">
          IQ Nikte'
        </span>
      </div>
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

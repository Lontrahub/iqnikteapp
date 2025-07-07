'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoaderCircle } from 'lucide-react';

export default function AdminRootPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to be determined
    }

    if (!user) {
      router.replace('/admin/login');
    } else if (userProfile?.role !== 'admin') {
      // If user is logged in but not an admin, deny access and send to home
      router.replace('/home'); 
    } else {
      // User is an admin, send to dashboard
      router.replace('/admin/dashboard');
    }
  }, [user, userProfile, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-muted-foreground">Verifying access...</p>
    </div>
  );
}

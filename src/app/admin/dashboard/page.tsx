'use client';
// This is a placeholder for the main admin dashboard.
// For now, it will verify the user is an admin.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'admin')) {
      router.replace('/admin/login');
    }
  }, [user, userProfile, loading, router]);

  if (loading || !userProfile) {
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
          <CardDescription>Welcome, {userProfile.displayName}. Manage your application content here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Content management features will be added here.</p>
            <Button asChild variant="outline">
                <Link href="/home">Go to Home</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

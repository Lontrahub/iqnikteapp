'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">User Profile</CardTitle>
          <CardDescription>View your account information below.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">Display Name:</span>
                    <span className="text-foreground">{userProfile?.displayName || 'Not set'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">Email:</span>
                    <span className="text-foreground">{userProfile?.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">User Role:</span>
                    <span className="text-foreground capitalize">{userProfile?.role}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">Joined:</span>
                    <span className="text-foreground">{userProfile?.createdAt.toDate().toLocaleDateString()}</span>
                </div>
            </div>
            {userProfile?.role === 'admin' && (
              <div className="mt-6">
                <Button asChild>
                  <Link href="/admin">Go to Admin Panel</Link>
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Users, FileText, Settings, Bell } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { getAdminDashboardStats } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  users: number;
  plants: number;
  blogs: number;
}

export default function AdminDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || userProfile?.role !== 'admin')) {
      router.replace('/admin/login');
    }
  }, [user, userProfile, authLoading, router]);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      getAdminDashboardStats()
        .then(setStats)
        .finally(() => setLoadingStats(false));
    }
  }, [userProfile]);

  const loading = authLoading || loadingStats;

  if (loading || !userProfile) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-5 w-5 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-5 w-5 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              </div>
            </section>
             <section>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-10 w-32 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
          <CardDescription>Welcome, {userProfile.displayName}. Manage your application content here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-primary/90">At a Glance</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.users ?? 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
                    <Leaf className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.plants ?? 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.blogs ?? 0}</div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-primary/90">Quick Links</h2>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline">
                  <Link href="/admin/plants">Manage Plants</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/blogs">Manage Articles</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/admin/users">Manage Users</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/admin/notifications"><Bell className="mr-2 h-4 w-4" />Manage Notifications</Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" />Global Settings</Link>
                </Button>
                <Button asChild>
                    <Link href="/home">Go to Home</Link>
                </Button>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

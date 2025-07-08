
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container py-10">
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
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-serif text-3xl tracking-wide">{t('profilePage.title')}</CardTitle>
          <CardDescription>{t('profilePage.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t('profilePage.displayName')}</span>
                    <span className="text-foreground">{userProfile?.displayName || t('profilePage.notSet')}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t('profilePage.email')}</span>
                    <span className="text-foreground">{userProfile?.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t('profilePage.role')}</span>
                    <span className="text-foreground capitalize">{userProfile?.role}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t('profilePage.joined')}</span>
                    <span className="text-foreground">{userProfile?.createdAt.toDate().toLocaleDateString()}</span>
                </div>
            </div>

            {userProfile?.role === 'admin' && (
              <div className="mt-6 border-t pt-6">
                <Button asChild>
                  <Link href="/admin">{t('profilePage.adminButton')}</Link>
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

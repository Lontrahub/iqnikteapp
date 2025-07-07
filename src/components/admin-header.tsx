'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { ThemeToggle } from './theme-toggle';

export default function AdminHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 mr-6">
          <Image src="/logo.png" alt="IQ Nikte' Logo" width={32} height={32} />
          <span className="font-headline text-xl font-bold text-primary">
            IQ Nikte' Admin
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <>
              <Button asChild variant="outline">
                <Link href="/home">Go to App</Link>
              </Button>
              <ThemeToggle />
              <UserNav />
            </>
          ) : (
             <ThemeToggle />
          )}
        </div>
      </div>
    </header>
  );
}

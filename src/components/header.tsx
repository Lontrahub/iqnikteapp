'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/home" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
            IQ Nikte'
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

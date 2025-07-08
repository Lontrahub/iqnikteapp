'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const ThemeToggle = dynamic(
  () => import('@/components/theme-toggle').then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-10" />,
  }
);

const LanguageSwitcher = dynamic(
  () => import('@/components/language-switcher').then((mod) => mod.LanguageSwitcher),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-10" />,
  }
);

const NotificationBell = dynamic(
  () => import('@/components/notification-bell').then((mod) => mod.NotificationBell),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-10" />,
  }
);

const UserNav = dynamic(
  () => import('@/components/user-nav').then((mod) => mod.UserNav),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-10 rounded-full" />,
  }
);

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/home" className="flex items-center gap-2 mr-6">
          <Image src="/logo.png" alt="IQ Nikte' Logo" width={32} height={32} className="rounded-lg" />
          <span className="font-serif text-2xl font-bold text-primary">
            IQ Nikte'
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
            <Link href="/plants" className="text-muted-foreground transition-colors hover:text-foreground dark:text-foreground/90 dark:hover:text-foreground">
                Plants
            </Link>
            <Link href="/blogs" className="text-muted-foreground transition-colors hover:text-foreground dark:text-foreground/90 dark:hover:text-foreground">
                Articles
            </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <>
              <NotificationBell />
              <LanguageSwitcher />
              <ThemeToggle />
              <UserNav />
            </>
          ) : (
            <>
              <LanguageSwitcher />
              <ThemeToggle />
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

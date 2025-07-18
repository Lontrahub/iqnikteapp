'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

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
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hiddenPaths = [
    '/admin',
    '/',
    '/language-selection',
    '/forgot-password',
  ];

  const isHidden = hiddenPaths.some(path => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  });

  if (isHidden) {
    return null;
  }

  return (
    <header className="bg-background border-b z-10">
      <div className="container flex h-16 items-center">
        <Link href="/home" className="flex items-center gap-2 mr-6">
          <Image src="/logo.png" alt="IQ Nikte' Logo" width={32} height={32} className="rounded-lg" />
          <span className={cn(
            "font-serif text-2xl font-bold text-primary",
            isMounted && !user ? "hidden md:inline" : ""
          )}>
            IQ Nikte'
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {!isMounted ? (
            <Skeleton className="h-10 w-44" />
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
                <Link href="/login">{t('header.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t('header.register')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

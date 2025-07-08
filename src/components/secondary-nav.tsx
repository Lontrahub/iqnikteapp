'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Leaf, BookOpen } from 'phosphor-react';

export default function SecondaryNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const hiddenPaths = [
    '/admin',
    '/',
    '/language-selection',
    '/login',
    '/register',
    '/forgot-password'
  ];

  const isHidden = hiddenPaths.some(path => pathname.startsWith(path) || pathname === path.replace(/\/$/, ''));

  if (isHidden) {
    return null;
  }

  const navLinks = [
    { href: '/plants', label: t('header.plants'), icon: <Leaf weight="bold" /> },
    { href: '/blogs', label: t('header.articles'), icon: <BookOpen weight="bold" /> }
  ];

  return (
    <nav className="sticky top-16 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-12 items-center justify-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
              pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <span className="md:hidden">{link.icon}</span>
            <span className="hidden md:block">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

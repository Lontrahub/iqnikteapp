'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Leaf, BookOpen, Briefcase } from 'phosphor-react';
import { useState, useEffect } from 'react';

export default function SecondaryNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after initial render
    setIsMounted(true);

    const handleScroll = () => {
      // A small offset of 1px to ensure it triggers after header
      setIsSticky(window.scrollY > 1);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const hiddenPaths = [
    '/admin',
    '/',
    '/language-selection',
    '/login',
    '/register',
    '/forgot-password'
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

  const navLinks = [
    { href: '/plants', labelKey: 'header.plants', icon: <Leaf weight="bold" />, defaultLabel: 'Plants' },
    { href: '/blogs', labelKey: 'header.articles', icon: <BookOpen weight="bold" />, defaultLabel: 'Articles' },
    { href: '/projects', labelKey: 'header.projects', icon: <Briefcase weight="bold" />, defaultLabel: 'Projects' }
  ];

  return (
    <nav className={cn(
      "sticky top-16 z-40 w-full bg-background/80 backdrop-blur-sm transition-shadow duration-200",
      isMounted && isSticky ? 'shadow-md' : 'border-b border-transparent'
    )}>
      <div className="container flex h-12 items-center justify-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 text-lg font-bold transition-colors hover:text-primary',
              pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <span className="md:hidden">{link.icon}</span>
            <span className="hidden md:block">{isMounted ? t(link.labelKey) : link.defaultLabel}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

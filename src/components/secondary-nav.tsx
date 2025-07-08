'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Leaf, BookOpen } from 'phosphor-react';
import { useState, useEffect } from 'react';

export default function SecondaryNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after initial render
    setIsClient(true);

    const handleScroll = () => {
      // Header height is h-16 which is 4rem or 64px
      setIsSticky(window.scrollY > 64);
    };
    
    // Set initial state
    handleScroll();
    
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
    { href: '/blogs', labelKey: 'header.articles', icon: <BookOpen weight="bold" />, defaultLabel: 'Articles' }
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm transition-shadow duration-200",
      // On server & initial client render, isClient is false, so this is 'border-b border-transparent'
      // After hydration, this class will be applied dynamically on the client.
      isClient && isSticky ? 'shadow-md' : 'border-b border-transparent'
    )}>
      <div className="container flex h-12 items-center justify-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 text-base font-bold transition-colors hover:text-primary',
              pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <span className="md:hidden">{link.icon}</span>
            {/* On server & initial client render, use defaultLabel. After hydration, use translated text. */}
            <span className="hidden md:block">{isClient ? t(link.labelKey) : link.defaultLabel}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

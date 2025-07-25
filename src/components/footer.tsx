'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { InstagramLogo, YoutubeLogo, LinkedinLogo } from 'phosphor-react';
import { Separator } from './ui/separator';
import { useTranslation } from '@/hooks/use-translation';

export default function Footer() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.png" alt="IQ Nikte' Logo" width={40} height={40} className="rounded-lg" />
              <span className="font-serif text-2xl font-bold text-primary">
                IQ Nikte'
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.slogan')}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <h3 className="font-semibold text-foreground mb-3">{t('footer.followUs')}</h3>
            <div className="flex items-center gap-4">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramLogo className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <YoutubeLogo className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinLogo className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            {t('footer.developedBy')}{' '}
            <a
              href="https://digital-alignment.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              digital-alignment.com
            </a>
          </p>
          {isClient && (
            <p className="mt-1">&copy; {new Date().getFullYear()} Mayan Medicine Guide. {t('footer.allRightsReserved')}</p>
          )}
        </div>
      </div>
    </footer>
  );
}

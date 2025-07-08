'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InstagramLogo, YoutubeLogo, LinkedinLogo } from 'phosphor-react';
import { Separator } from './ui/separator';

export default function AdminFooter() {
  return (
    <footer className="bg-background mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.png" alt="IQ Nikte' Logo" width={40} height={40} className="rounded-lg" />
              <span className="font-serif text-2xl font-bold text-primary">
                IQ Nikte'
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A tribute to the preservation of traditional knowledge.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <h3 className="font-semibold text-foreground mb-3">Follow Us</h3>
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
            Developed by{' '}
            <a
              href="https://digital-alignment.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              digital-alignment.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

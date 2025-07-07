import Link from 'next/link';
import Image from 'next/image';
import { InstagramLogo, YoutubeLogo, LinkedinLogo } from 'phosphor-react';

export default function AdminFooter() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="IQ Nikte' Logo" width={24} height={24} />
            <span className="font-headline text-lg font-bold text-primary">
              IQ Nikte'
            </span>
          </div>
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
          <div className="text-sm text-muted-foreground">
            Developed by{' '}
            <a
              href="https://digital-alignment.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              digital-alignment.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function LanguageSelectionPage() {
  const router = useRouter();

  const handleLanguageSelect = (lang: 'en' | 'es') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', lang);
    }
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
            <Image src="/logo.png" alt="IQ Nikte' Logo" width={64} height={64} className="mb-2 rounded-lg" />
            <CardTitle className="text-2xl font-headline">Welcome to IQ Nikte'</CardTitle>
            <CardDescription>Please select your language.</CardDescription>
            <CardDescription className="text-xs">Por favor, seleccione su idioma.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button size="lg" onClick={() => handleLanguageSelect('en')}>
            English
          </Button>
          <Button size="lg" onClick={() => handleLanguageSelect('es')}>
            Español
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

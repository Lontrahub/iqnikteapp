'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { LanguageContext } from '@/contexts/language-context';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Language } from '@/hooks/use-language';

export function LanguageSwitcher() {
  const { language, setLanguage } = React.useContext(LanguageContext);

  const handleLanguageChange = (lang: string) => {
    if (lang && (lang === 'en' || lang === 'es')) {
      setLanguage(lang as Language);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
          <DropdownMenuRadioItem value="en">
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="es">
            Español
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/contexts/language-context';

export type Language = 'en' | 'es';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context.language;
}

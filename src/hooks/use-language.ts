'use client';

import { useState, useEffect } from 'react';

export type Language = 'en' | 'es';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_language');
    if (storedLang === 'en' || storedLang === 'es') {
      setLanguage(storedLang);
    }
  }, []);

  return language;
}

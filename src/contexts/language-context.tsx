'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Language } from '@/hooks/use-language';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';

type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: string) => string;
}

const translationsMap = {
  en: enTranslations,
  es: esTranslations,
};

// Helper function to get nested value from a string key
const getNestedValue = (obj: any, key: string) => {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: enTranslations,
  t: () => '',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(enTranslations);

  useEffect(() => {
    const storedLang = localStorage.getItem('app_language');
    const initialLang = (storedLang === 'en' || storedLang === 'es') ? storedLang : 'en';
    setLanguageState(initialLang);
    setTranslations(translationsMap[initialLang]);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    if (newLanguage === 'en' || newLanguage === 'es') {
      localStorage.setItem('app_language', newLanguage);
      setLanguageState(newLanguage);
      setTranslations(translationsMap[newLanguage]);
    }
  };

  const t = useCallback((key: string): string => {
    const value = getNestedValue(translations, key);
    return value || key;
  }, [translations]);

  const value = { language, setLanguage, translations, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

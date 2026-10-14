import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationKey, t as translateFn } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: TranslationKey) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bistro_language');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch {
      // ignore localStorage errors
    }
    return 'vi';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('bistro_language', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const t = (key: TranslationKey): string => {
    return translateFn(key, lang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}

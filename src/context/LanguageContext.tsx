import React, { useEffect, useState, createContext, useContext } from 'react';
import { translations, TranslationKey, Translations } from '../utils/translations';
type Language = 'en' | 'ar';
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  translations: Translations;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  // Initialize from localStorage if available, otherwise default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'ar' ? 'ar' : 'en') as Language;
  });
  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };
  const toggleLanguage = () => {
    setLanguageState(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };
  // Translation helper function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
  return <LanguageContext.Provider value={{
    language,
    setLanguage,
    toggleLanguage,
    t,
    translations: translations[language]
  }}>
      {children}
    </LanguageContext.Provider>;
};
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
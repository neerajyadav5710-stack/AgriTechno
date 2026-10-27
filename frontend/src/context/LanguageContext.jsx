import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('agritechno_lang') || 'en');

  const switchLanguage = (code) => {
    setLang(code);
    localStorage.setItem('agritechno_lang', code);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

import { createContext, useContext, useState } from 'react';

import en from './locales/en.js';
import hi from './locales/hi.js';
import gu from './locales/gu.js';
import ml from './locales/ml.js';
import te from './locales/te.js';
import ta from './locales/ta.js';
import mr from './locales/mr.js';
import bn from './locales/bn.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import es from './locales/es.js';
import pt from './locales/pt.js';
import ar from './locales/ar.js';
import ja from './locales/ja.js';
import ko from './locales/ko.js';
import zh from './locales/zh.js';
import ru from './locales/ru.js';
import tr from './locales/tr.js';

const translations = { en, hi, gu, ml, te, ta, mr, bn, fr, de, es, pt, ar, ja, ko, zh, ru, tr };

// Fill missing keys with English fallback
Object.keys(translations).forEach(lang => {
  if (lang !== 'en') {
    Object.keys(translations.en).forEach(key => {
      if (!translations[lang][key]) {
        translations[lang][key] = translations.en[key];
      }
    });
  }
});

const defaultI18n = {
  lang: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key] || key,
};

const I18nContext = createContext(defaultI18n);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('clipvora-lang') || 'en'; }
    catch { return 'en'; }
  });

  const setLanguage = (code) => {
    setLang(code);
    localStorage.setItem('clipvora-lang', code);
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

export default translations;

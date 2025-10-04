import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from '~/constants';

import enJSON from '~/locales/en.json';
import viJSON from '~/locales/vi.json';

const LANGUAGE_STORAGE_KEY = 'preferred-language';

const getInitialLanguage = (): string => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && LANGUAGES.some((lang) => lang.i18n === savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Failed to get language from localStorage:', error);
  }

  return LANGUAGES.find((item) => item.isDefault)?.i18n || 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJSON },
    vi: { translation: viJSON }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

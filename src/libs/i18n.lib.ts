import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from '~/constants';

import enJSON from '~/locales/en.json';
import viJSON from '~/locales/vi.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJSON },
    vi: { translation: viJSON }
  },
  lng: LANGUAGES.find((item) => item.isDefault)?.i18n,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

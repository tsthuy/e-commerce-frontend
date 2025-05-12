import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from '~/constants';

import enAUJSON from '~/locales/en-au.json';
import idJSON from '~/locales/id.json';

i18n.use(initReactI18next).init({
  resources: {
    enAU: { translation: { ...enAUJSON } },
    id: { translation: { ...idJSON } }
  },
  lng: LANGUAGES.find((item) => item.isDefault)?.i18n
});

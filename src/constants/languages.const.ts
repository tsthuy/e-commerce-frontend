import type { Locale } from 'date-fns/locale';
import { enUS, vi } from 'date-fns/locale';
import type { Country } from 'react-phone-number-input';

export const LANGUAGES: Array<{
  country: Country;
  locale: Locale;
  currency: {
    locale: string;
    unit: string;
  };
  i18n: string;
  isDefault: boolean;
  logo: string;
  label: string;
}> = [
  {
    country: 'US',
    locale: enUS,
    currency: {
      locale: 'en-US',
      unit: 'USD'
    },
    i18n: 'en',
    isDefault: true,
    logo: '/images/common/languages/au.svg',
    label: 'English'
  },
  {
    country: 'VN',
    locale: vi,
    currency: {
      locale: 'vi-VN',
      unit: 'VND'
    },
    i18n: 'vi',
    isDefault: false,
    logo: '/images/common/languages/vn.svg',
    label: 'Tiếng Việt'
  }
];

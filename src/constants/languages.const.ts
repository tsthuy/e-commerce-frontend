import type { Locale } from 'date-fns/locale';
import { enAU, id } from 'date-fns/locale';
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
    country: 'AU',
    locale: enAU,
    currency: {
      locale: 'en-AU',
      unit: 'AUD'
    },
    i18n: 'enAU',
    isDefault: true,
    logo: '/images/common/languages/au.svg',
    label: 'Australia'
  },
  {
    country: 'ID',
    locale: id,
    currency: {
      locale: 'id-ID',
      unit: 'IDR'
    },
    i18n: 'id',
    isDefault: false,
    logo: '/images/common/languages/id.svg',
    label: 'Indonesia'
  }
];

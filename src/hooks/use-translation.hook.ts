import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (): {
  t: (key: string, options?: Record<string, unknown>) => string;
  i18n: {
    language: string;
    changeLanguage: (lng: string) => void;
    dir: () => string;
    isInitialized: boolean;
  };
  changeLanguage: (lng: string) => void;
  getCurrentLanguage: () => string;
  getLanguageDirection: () => string;
  isLoading: boolean;
} => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = (): string => {
    return i18n.language;
  };

  const getLanguageDirection = (): string => {
    return i18n.dir();
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    getLanguageDirection,
    isLoading: !i18n.isInitialized
  };
};

export default useTranslation;

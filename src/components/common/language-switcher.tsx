import { memo } from 'react';

import { Globe } from 'lucide-react';

import { LANGUAGES } from '~/constants';

import { useTranslation } from '~/hooks';

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showText?: boolean;
}

export const LanguageSwitcher = memo<LanguageSwitcherProps>(({ variant = 'outline', size = 'sm', showIcon = true, showText = true }) => {
  const { t, changeLanguage, getCurrentLanguage } = useTranslation();

  const currentLanguage = getCurrentLanguage();
  const selectedLanguage = LANGUAGES.find((lang) => lang.i18n === currentLanguage);

  const handleLanguageChange = (languageCode: string): void => {
    changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2" size={size} variant={variant}>
          {showIcon &&
            (selectedLanguage?.logo ? (
              <img
                alt={selectedLanguage.label}
                className="h-4 w-4 rounded-sm"
                src={selectedLanguage.logo}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Globe className="h-4 w-4" />
            ))}
          {showText && <span className="hidden sm:inline-block">{selectedLanguage?.label || t('Common.language')}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem key={language.i18n} className="flex items-center gap-2" onClick={() => handleLanguageChange(language.i18n)}>
            <img
              alt={language.label}
              className="h-4 w-4 rounded-sm"
              src={language.logo}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>{language.label}</span>
            {currentLanguage === language.i18n && <span className="ml-auto text-xs text-muted-foreground">{t('Common.active')}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;

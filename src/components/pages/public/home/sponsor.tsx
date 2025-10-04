import { memo } from 'react';

import { SPONSORS } from '~/constants';

import { useTranslation } from '~/hooks';

import { Container } from '~/components/common';
import { Card, CardContent } from '~/components/ui/card';

export const Sponsor = memo(() => {
  const { t } = useTranslation();

  return (
    <Container isFullWidth className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-8 text-center">
        <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-[40px] w-[20px] rounded bg-primary"></div>
              <p className="text-2xl font-bold uppercase text-primary">{t('Sponsor.title')}</p>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">{t('Sponsor.subtitle')}</p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 py-8 md:grid-cols-4 lg:grid-cols-4">
        {SPONSORS.map((sponsor) => (
          <Card key={sponsor.id} className="group border-gray-200 bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="flex min-h-[120px] flex-col items-center justify-center p-6">
              <div className="mb-3 flex h-16 w-full items-center justify-center">
                <img
                  alt={t(`Sponsor.${sponsor.translationKey}`)}
                  className="max-h-full max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  loading="lazy"
                  src={sponsor.logoUrl}
                />
              </div>
              <span className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">{t(`Sponsor.${sponsor.translationKey}`)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
});

Sponsor.displayName = 'Sponsor';

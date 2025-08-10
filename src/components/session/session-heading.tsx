import { memo } from 'react';

import { useTranslation } from '~/hooks';

interface SectionHeadingProps {
  section: 'BEST_DEALS' | 'POPULAR_EVENTS' | 'FEATURED_PRODUCTS' | 'SPONSOR';
}

export const SectionHeading = memo(({ section }: SectionHeadingProps) => {
  const { t } = useTranslation();

  const getSectionTitle = (sectionKey: string): string => {
    switch (sectionKey) {
      case 'BEST_DEALS':
        return t('Home.sectionProductForYou');
      case 'POPULAR_EVENTS':
        return t('SEO_SECTION_HEADINGS.POPULAR_EVENTS', { defaultValue: 'Popular Events' });
      case 'FEATURED_PRODUCTS':
        return t('SEO_SECTION_HEADINGS.FEATURED_PRODUCTS', { defaultValue: 'Featured Products' });
      case 'SPONSOR':
        return t('SEO_SECTION_HEADINGS.SPONSOR', { defaultValue: 'Our Trusted Partners' });
      default:
        return sectionKey;
    }
  };

  return (
    <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-[40px] w-[20px] rounded bg-primary"></div>
          <p className="text-2xl font-bold uppercase text-primary">{getSectionTitle(section)}</p>
        </div>
      </div>
    </div>
  );
});

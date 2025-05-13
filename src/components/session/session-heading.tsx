import { memo } from 'react';

import { SEO_SECTION_HEADINGS } from '~/constants';

interface SectionHeadingProps {
  section: keyof typeof SEO_SECTION_HEADINGS;
}

export const SectionHeading = memo(({ section }: SectionHeadingProps) => {
  return (
    <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-[40px] w-[20px] rounded bg-primary"></div>

          <p className="text-2xl font-bold uppercase text-primary">{SEO_SECTION_HEADINGS[section]}</p>
        </div>
      </div>
    </div>
  );
});

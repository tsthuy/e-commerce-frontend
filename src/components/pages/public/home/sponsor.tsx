import { memo } from 'react';

import { SPONSORS } from '~/constants';

import { Container } from '~/components/common';
import { SectionHeading } from '~/components/session';

export const Sponsor = memo(() => {
  return (
    <Container isFullWidth className="py-12">
      <SectionHeading section="SPONSOR" />

      <div className="flex flex-col flex-wrap items-center justify-center gap-16 py-16 sm:flex-row sm:gap-36">
        {SPONSORS.map((sponsor) => (
          <div key={sponsor.id} className="flex flex-shrink-0 items-center justify-center">
            <img alt={sponsor.name} className="h-auto max-h-28 w-full object-contain grayscale transition-all hover:grayscale-0" loading="lazy" src={sponsor.logoUrl} />
          </div>
        ))}
      </div>
    </Container>
  );
});

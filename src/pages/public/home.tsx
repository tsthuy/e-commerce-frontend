import { memo } from 'react';

import { Container } from '~/components/common';
import { Categories, Hero } from '~/components/pages/public/home';
import { Guarantee } from '~/components/pages/public/home/guarantee';
import { SectionHeading } from '~/components/session';

export const HomePage = memo(() => {
  return (
    <Container isFullWidth className="border bg-white shadow-md">
      <Hero />
      <Guarantee />
      <Categories />
      <SectionHeading section={'BEST_DEALS'} />
    </Container>
  );
});

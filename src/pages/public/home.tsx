import { memo } from 'react';

import { Container } from '~/components/common';
import { Categories, Hero } from '~/components/pages/public/home';
import { Guarantee } from '~/components/pages/public/home/guarantee';

export const HomePage = memo(() => {
  return (
    <Container isFitScreen isFullWidth className="border bg-white shadow-md">
      <Hero />
      <Guarantee />
      <Categories />
    </Container>
  );
});

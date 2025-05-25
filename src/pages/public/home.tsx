import { memo } from 'react';

import { Container, Helmet } from '~/components/common';
import { Categories, Contact, Hero, Sponsor } from '~/components/pages/public/home';
import { Guarantee } from '~/components/pages/public/home/guarantee';
import { ProductCard } from '~/components/product';
import { SectionHeading } from '~/components/session';

export const HomePage = memo(() => {
  return (
    <Helmet titleEntire="ShopO">
      <Container isFullWidth className="border bg-white shadow-md">
        <Hero />
        <Guarantee />
        <Categories />
        <SectionHeading section={'BEST_DEALS'} />
        <ProductCard />
        <Sponsor />
        <Contact />
      </Container>
    </Helmet>
  );
});

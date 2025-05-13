import { memo } from 'react';

import { Link } from 'react-router-dom';

import { BG, SEO_QUOTE } from '~/constants';

import { Button } from '~/components/common';

export const Hero = memo(() => {
  return (
    <div
      className={'relative flex min-h-[70svh] w-full items-center bg-no-repeat lg:min-h-[80svh]'}
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] flex-col items-center justify-center gap-x-10 px-4">
        <h1 className="text-center text-[35px] font-bold capitalize leading-[1.2] text-primary lg:text-[60px]">
          {SEO_QUOTE}
          <br />
        </h1>

        <Link className="inline-block pt-4" to="/products">
          <Button size={'lg'}>Shop Now</Button>
        </Link>
      </div>
    </div>
  );
});

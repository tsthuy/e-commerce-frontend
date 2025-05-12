import { memo } from 'react';

import { LOGO, SEO_AUTHOR } from '~/constants';

import { Helmet } from '../helmet';

export const LoadingScreen = memo(() => {
  return (
    <Helmet title="Loading...">
      <div className="fixed inset-0 z-[999999] flex h-screen w-screen flex-col items-center justify-center bg-background">
        <img alt={SEO_AUTHOR} className="h-auto w-20 rounded-sm" src={LOGO} />
        <figure className="-mt-12 aspect-square w-[150px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url(/gifs/loading.gif)' }} />
      </div>
    </Helmet>
  );
});

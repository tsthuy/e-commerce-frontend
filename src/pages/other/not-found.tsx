import { memo } from 'react';

import { Helmet, NotFound } from '~/components/common';

export const NotFoundPage = memo(() => {
  return (
    <Helmet title="404">
      <div className="flex min-h-screen w-screen flex-col items-center justify-center">
        <NotFound isHiddenButton noWrapper description="The page you are looking for is not here." img="/gifs/not-found.gif" title="404 Page" />
      </div>
    </Helmet>
  );
});

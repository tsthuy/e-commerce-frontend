import { memo } from 'react';

import { SEO_AUTHOR } from '~/constants';

export const FooterPublicLayout = memo(() => {
  return (
    <footer className="px-5 py-2">
      <p className="text-center text-xs leading-none text-muted-foreground md:text-sm">
        © {new Date().getFullYear()} <span className="font-medium text-foreground">{SEO_AUTHOR}</span>. All rights reserved.
      </p>
    </footer>
  );
});

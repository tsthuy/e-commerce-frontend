import type { ReactNode } from 'react';
import { memo, useEffect, useMemo } from 'react';

import { SEO_TITLE } from '~/constants';

type HelmetProps = {
  title?: string;
  titleEntire?: string;
  children: ReactNode;
};

export const Helmet = memo(({ title, titleEntire, children }: HelmetProps) => {
  const documentTitle = useMemo(() => titleEntire ?? (title ? `${title} | ${SEO_TITLE}` : SEO_TITLE), [title, titleEntire]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return children;
});

import { memo, useMemo } from 'react';

import DOMPurify from 'dompurify';

import { cn } from '~/libs';

type HtmlRenderProps = {
  className?: HTMLDivElement['className'];
  htmlString?: string;
};

export const HtmlRender = memo(({ className, htmlString }: HtmlRenderProps) => {
  const cleanHtmlString = useMemo(() => DOMPurify.sanitize(htmlString ?? ''), [htmlString]);

  return <div className={cn('html-render', className)} dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />;
});

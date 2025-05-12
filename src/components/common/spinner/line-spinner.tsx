import { memo } from 'react';

import { cn } from '~/libs';

export const SpinnerLineSpinner = memo(({ className }: { className?: HTMLDivElement['className'] }) => (
  <div className={cn('spinner--line-spinner__container', className)}>
    {[...new Array(12)].map((_, index) => (
      <div key={index} className="line" />
    ))}
  </div>
));

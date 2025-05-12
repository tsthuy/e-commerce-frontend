import { memo } from 'react';

import { cn } from '~/libs';

export const SpinnerRing = memo(({ className }: { className?: HTMLDivElement['className'] }) => (
  <svg className={cn('spinner--ring__container', className)} height="40" viewBox="0 0 40 40" width="40">
    {['track', 'car'].map((item, index) => (
      <circle key={index} className={item} cx="20" cy="20" fill="none" pathLength="100" r="17.5" strokeWidth="5px" />
    ))}
  </svg>
));

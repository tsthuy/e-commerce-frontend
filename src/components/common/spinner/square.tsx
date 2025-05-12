import { memo } from 'react';

import { cn } from '~/libs';

export const SpinnerSquare = memo(({ className }: { className?: HTMLDivElement['className'] }) => (
  <svg className={cn('spinner--square__container', className)} height="35" viewBox="0 0 35 35" width="35">
    <rect className="track" fill="none" height="32.5" strokeWidth="5px" width="32.5" x="2.5" y="2.5" />
    <rect className="car" fill="none" height="32.5" pathLength="100" strokeWidth="5px" width="32.5" x="2.5" y="2.5" />
  </svg>
));

import { memo } from 'react';

import { cn } from '~/libs';

export const SpinnerLineWobble = memo(({ className }: { className?: HTMLDivElement['className'] }) => <div className={cn('spinner--line-wobble__container', className)} />);

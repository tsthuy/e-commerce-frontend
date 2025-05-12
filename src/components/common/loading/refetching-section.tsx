import { memo } from 'react';

import { cn } from '~/libs';

import { SpinnerLineSpinner } from '../spinner';

type RefetchingSectionProps = {
  className?: HTMLDivElement['className'];
};

export const RefetchingSection = memo(({ className }: RefetchingSectionProps) => {
  return (
    <div className={cn('absolute inset-0 z-20 mx-auto flex size-full flex-grow flex-col items-center justify-center overflow-hidden rounded-xl backdrop-blur-sm', className)}>
      <SpinnerLineSpinner />
    </div>
  );
});

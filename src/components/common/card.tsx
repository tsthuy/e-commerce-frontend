import { forwardRef, memo } from 'react';

import { cn } from '~/libs';

import { Card } from '../ui';

export const CardCustom = memo(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { colorStyle?: 'pink' | 'white' }>(({ colorStyle = 'white', className, ...props }, ref) => (
    <Card
      ref={ref}
      style={{ backgroundSize: '100% 100%' }}
      className={cn(
        'rounded-none border-none bg-transparent bg-no-repeat p-4 shadow-none',
        {
          'bg-[url(/images/common/card-bg-white.png)]': colorStyle === 'white',
          'bg-[url(/images/common/card-bg-color.png)]': colorStyle === 'pink'
        },
        className
      )}
      {...props}
    />
  ))
);

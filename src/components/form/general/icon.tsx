import { memo } from 'react';

import type { LucideIcon } from 'lucide-react';

import { cn } from '~/libs';

import { Tooltip } from '~/components/common';

export type CustomFormInputIconProps = {
  icon?: LucideIcon;
  align: 'left' | 'right';
  className?: string;
  tooltip?: string;
  handleOnClick?: () => void;
};
export const CustomFormInputIcon = memo(({ icon: Icon, align, className, tooltip, handleOnClick }: CustomFormInputIconProps) => {
  return (
    !!Icon &&
    (!!tooltip ? (
      <Tooltip content={tooltip}>
        <span
          className={cn(
            'absolute top-1/2 flex -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground',
            {
              'left-3': align === 'left',
              'right-3': align === 'right'
            },
            className
          )}
          onClick={handleOnClick}
        >
          <Icon className="size-4" />
        </span>
      </Tooltip>
    ) : (
      <span
        className={cn(
          'absolute top-1/2 flex -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground',
          {
            'left-3': align === 'left',
            'right-3': align === 'right'
          },
          className
        )}
        onClick={handleOnClick}
      >
        <Icon className="size-4" />
      </span>
    ))
  );
});

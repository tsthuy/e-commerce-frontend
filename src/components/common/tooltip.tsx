import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as TooltipUI } from '~/components/ui';

type TooltipProps = {
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactNode;
  content: ReactNode;
  size?: 'normal' | 'tiny';
  showArrow?: boolean;
  className?: HTMLDivElement['className'];
};

export const Tooltip = memo(({ delayDuration = 0, side, children, content, size, showArrow, className }: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipUI>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            'max-w-[280px] text-left',
            {
              'px-2 py-1 text-xs': size === 'tiny'
            },
            className
          )}
        >
          {content}
          {showArrow && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <svg className="-my-px block fill-popover drop-shadow-[0_1px_0_hsl(var(--border))]" height="5" preserveAspectRatio="none" viewBox="0 0 30 10" width="10">
                <polygon points="0,0 30,0 15,10" />
              </svg>
            </span>
          )}
        </TooltipContent>
      </TooltipUI>
    </TooltipProvider>
  );
});

import { memo } from 'react';

import { cn } from '~/libs';

type DividerProps = {
  className?: HTMLHRElement['className'];
};

export const Divider = memo(({ className = '' }: DividerProps) => <hr className={cn('my-4 w-full border-t', className)} />);

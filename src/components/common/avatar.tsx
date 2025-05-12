import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, memo } from 'react';

import { DEFAULT_IMG_AVATAR } from '~/constants';

import { cn } from '~/libs';

import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from '~/components/ui';

type AvatarProps = {
  src?: string;
  alt?: string;
  content?: ReactNode;
  className?: HTMLDivElement['className'];
  square?: boolean;
  showStatus?:
    | {
        status: 'on';
        classNameOn?: HTMLSpanElement['className'];
      }
    | {
        status: 'off';
        classNameOff?: HTMLSpanElement['className'];
      };
  showVerify?:
    | {
        className?: HTMLSpanElement['className'];
      }
    | true;
};

export const Avatar = memo(
  forwardRef<HTMLDivElement, AvatarProps>((props: AvatarProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { src, alt, content, className, square, showStatus, showVerify } = props;

    return (
      <div ref={ref} className="relative flex">
        <AvatarUI
          className={cn(
            'relative',
            {
              'rounded-lg': square
            },
            className
          )}
        >
          <AvatarImage alt={alt ?? 'Avatar'} src={src ?? DEFAULT_IMG_AVATAR} />
          {content && <AvatarFallback>{content}</AvatarFallback>}
        </AvatarUI>
        {!!showStatus && (
          <span
            className={cn(
              'absolute bottom-0 end-0 size-3 rounded-full border-2 border-background',
              {
                'bg-custom-green': showStatus.status === 'on',
                'bg-muted-foreground': showStatus.status === 'off'
              },
              showStatus.status === 'on' ? showStatus.classNameOn : showStatus.classNameOff
            )}
          />
        )}
        {!!showVerify && (
          <span className={cn('absolute -end-1 -top-1 text-primary', showVerify !== true && showVerify.className)}>
            <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path
                className="fill-background"
                d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
              />
              <path
                className="fill-current"
                d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
              />
              <path className="fill-background" d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z" />
            </svg>
          </span>
        )}
      </div>
    );
  })
);

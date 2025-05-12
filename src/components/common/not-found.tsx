import type { ReactNode } from 'react';
import { memo } from 'react';

import { RotateCwIcon } from 'lucide-react';

import { DEFAULT_IMG_EMPTY } from '~/constants';

import { Card, CardContent } from '../ui';

import { Button } from './button';

type NotFoundProps = {
  title?: ReactNode;
  description?: ReactNode;
  isHiddenTitle?: boolean;
  isHiddenButton?: boolean;
  noWrapper?: boolean;
  img?: string;
};

export const NotFound = memo(({ title, description, isHiddenTitle = false, isHiddenButton = false, noWrapper = false, img }: NotFoundProps) => {
  return noWrapper ? (
    <NotFoundContent description={description} img={img} isHiddenButton={isHiddenButton} isHiddenTitle={isHiddenTitle} title={title} />
  ) : (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col items-center justify-center p-6">
        <NotFoundContent description={description} img={img} isHiddenButton={isHiddenButton} isHiddenTitle={isHiddenTitle} title={title} />
      </CardContent>
    </Card>
  );
});

const NotFoundContent = memo(({ title, description, isHiddenTitle = false, isHiddenButton = false, img }: Omit<NotFoundProps, 'noWrapper'>) => (
  <>
    <figure className="relative aspect-square w-[200px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${img ?? DEFAULT_IMG_EMPTY})` }} />
    {!isHiddenTitle && <p className="my-4 text-lg font-medium md:text-xl">{title || 'Not found! Please try again.'}</p>}
    {!!description && <p className="-mt-3 mb-4 text-base">{description}</p>}
    {!isHiddenButton && (
      <Button animation={{ type: 'expandIcon', icon: RotateCwIcon, placement: 'left' }} onClick={() => window.location.reload()}>
        Reload
      </Button>
    )}
  </>
));

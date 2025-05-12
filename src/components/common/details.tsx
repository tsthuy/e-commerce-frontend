import type { ReactNode } from 'react';
import { memo } from 'react';

import { DEFAULT_IMG_SEARCHING } from '~/constants';

import { Card, CardContent } from '../ui';

import { RefetchingSection } from './loading';
import { NotFound } from './not-found';

type DetailsSectionProps = {
  isLoading?: boolean;
  isRefetching?: boolean;
  isHaveData?: boolean;
  classNameLoading?: string;
  classNameRefetching?: string;
  classNameNotFound?: string;
  titleNotFound?: ReactNode;
  isHiddenTitleNotFound?: boolean;
  isHiddenButtonNotFound?: boolean;
  children: ReactNode;
};

export const DetailsSection = memo(
  ({ isLoading = false, isRefetching = false, isHaveData = false, classNameRefetching = '', titleNotFound, isHiddenTitleNotFound, isHiddenButtonNotFound, children }: DetailsSectionProps) => {
    return (
      <Card className="h-full">
        <CardContent className="relative flex h-full flex-col items-center justify-center p-6">
          {isLoading ? (
            <>
              <figure className="relative aspect-square w-48 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${DEFAULT_IMG_SEARCHING})` }} />
            </>
          ) : isHaveData ? (
            <div className="size-full">
              {children}
              {isRefetching && <RefetchingSection className={classNameRefetching} />}
            </div>
          ) : (
            <NotFound noWrapper isHiddenButton={isHiddenButtonNotFound} isHiddenTitle={isHiddenTitleNotFound} title={titleNotFound} />
          )}
        </CardContent>
      </Card>
    );
  }
);

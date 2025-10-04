import { useState } from 'react';

import { AvatarFallback } from '@radix-ui/react-avatar';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';

import type { ProductReviewListParams } from '~/types';

import { useProductReviews, useTranslation } from '~/hooks';

import { StarRating } from '~/components/common';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

interface ReviewListProps {
  productId: string;
  className?: string;
}

export const ReviewList = ({ productId, className }: ReviewListProps): JSX.Element => {
  const { t } = useTranslation();

  const [params, setParams] = useState<ProductReviewListParams>({
    productId,
    page: 0,
    size: 5
  });

  const { data, isLoading, error } = useProductReviews(params);

  const handlePageChange = (newPage: number): void => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">{t('Reviews.failedToLoadReviews')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.result?.content?.length) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Star className="h-8 w-8 text-gray-300" />
              <p className="text-gray-500">{t('Reviews.noReviewsYet')}</p>
              <p className="text-sm text-gray-400">{t('Reviews.beFirstToReview')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {data.result.content.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback />
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium">{review.userName}</span>
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {data.result.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button disabled={params.page === 0} size="sm" variant="outline" onClick={() => handlePageChange((params.page || 0) - 1)}>
              {t('Reviews.previous')}
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.result.totalPages) }, (_, index) => {
                const currentPage = params.page || 0;
                const pageNumber = currentPage < 3 ? index : currentPage > data.result.totalPages - 3 ? data.result.totalPages - 5 + index : currentPage - 2 + index;

                if (pageNumber < 0 || pageNumber >= data.result.totalPages) return null;

                return (
                  <Button key={pageNumber} size="sm" variant={pageNumber === currentPage ? 'default' : 'outline'} onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber + 1}
                  </Button>
                );
              })}
            </div>
            <Button disabled={(params.page || 0) >= data.result.totalPages - 1} size="sm" variant="outline" onClick={() => handlePageChange((params.page || 0) + 1)}>
              {t('Reviews.next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

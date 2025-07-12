import { useState } from 'react';

import { useCheckReviewExists } from '~/hooks';

import { ReviewForm } from '~/components/common';
import { Button } from '~/components/ui';

interface ProductReviewSectionProps {
  productId: string;
  orderId: string;
  productName: string;
  onReviewSuccess: () => void;
}

export const ProductReviewSection = ({ productId, orderId, onReviewSuccess }: ProductReviewSectionProps): JSX.Element => {
  const [isReviewing, setIsReviewing] = useState(false);

  const { data: reviewExists, isLoading } = useCheckReviewExists(productId, orderId);
  const hasReviewed = reviewExists?.result === true;

  const handleToggleReview = (): void => {
    setIsReviewing(!isReviewing);
  };

  const handleReviewSuccess = (): void => {
    setIsReviewing(false);
    onReviewSuccess();
  };

  if (isLoading) {
    return (
      <div className="mt-4 border-t pt-4">
        <p className="text-sm text-gray-500">Loading review status...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-2 flex items-center justify-between">
        <h5 className="font-medium">Review this product</h5>
        {hasReviewed ? (
          <p className="text-sm text-gray-600">✓ Already reviewed</p>
        ) : (
          <Button size="sm" variant="outline" onClick={handleToggleReview}>
            {isReviewing ? 'Cancel Review' : 'Write Review'}
          </Button>
        )}
      </div>

      {isReviewing && !hasReviewed && <ReviewForm orderId={orderId} productId={productId} onCancel={handleToggleReview} onSuccess={handleReviewSuccess} />}
    </div>
  );
};

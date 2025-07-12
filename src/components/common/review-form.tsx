/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreateReviewRequest } from '~/types';

import { useCreateReview } from '~/hooks';

import { StarRating } from '~/components/common';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  content: z.string().min(1, 'Please write a review comment')
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm = ({ productId, orderId, onSuccess, onCancel }: ReviewFormProps): JSX.Element => {
  const [rating, setRating] = useState(0);
  const createReviewMutation = useCreateReview();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: ''
    }
  });

  const handleRatingChange = (newRating: number): void => {
    setRating(newRating);
    setValue('rating', newRating);
  };

  const onSubmit = async (data: ReviewFormData): Promise<void> => {
    const reviewData: CreateReviewRequest = {
      productId,
      orderId,
      rating: data.rating,
      content: data.content
    };

    createReviewMutation.mutate(reviewData, {
      onSuccess: () => {
        reset();
        setRating(0);
        onSuccess?.();
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Rating *</label>
        <StarRating interactive className="mb-1" rating={rating} size="lg" onRatingChange={handleRatingChange} />
        {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="review-content">
          Review Comment *
        </label>
        <Controller control={control} name="content" render={({ field }) => <Textarea {...field} className="w-full" id="review-content" placeholder="Write your review here..." rows={4} />} />
        {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
        {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button disabled={createReviewMutation.isPending} type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button className="min-w-[100px]" disabled={createReviewMutation.isPending} type="submit">
          {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

import { Star } from 'lucide-react';

import { cn } from '~/libs';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating = ({ rating, maxRating = 5, size = 'md', interactive = false, onRatingChange, className }: StarRatingProps): JSX.Element => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleStarClick = (index: number): void => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            className={cn('relative', interactive && 'cursor-pointer transition-transform hover:scale-110', !interactive && 'cursor-default')}
            disabled={!interactive}
            type="button"
            onClick={() => handleStarClick(index)}
          >
            <Star className={cn(sizeClasses[size], 'transition-colors', isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200')} />
            {isHalfFilled && (
              <Star
                className={cn(sizeClasses[size], 'absolute inset-0 fill-yellow-400 text-yellow-400', 'clip-path-half')}
                style={{
                  clipPath: `inset(0 ${100 - (rating - index) * 100}% 0 0)`
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

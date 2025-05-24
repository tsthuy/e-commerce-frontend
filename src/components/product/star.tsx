import { Star } from 'lucide-react';

export const renderStars = (rating: number): JSX.Element[] => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="size-4 fill-yellow-400 stroke-none" strokeWidth={1.5} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative size-4">
          <Star className="absolute left-0 top-0 size-4 fill-gray-400 stroke-none" strokeWidth={1.5} />

          <div className="absolute left-0 top-0 h-4 w-2 overflow-hidden">
            <Star className="size-4 fill-yellow-400 stroke-none" strokeWidth={1.5} />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className="size-4 fill-gray-400 stroke-none" strokeWidth={1.5} />);
    }
  }
  return stars;
};

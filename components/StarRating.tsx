
import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${rating >= starValue ? 'text-yellow-400' : 'text-gray-300'}`}
            filled={rating >= starValue}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

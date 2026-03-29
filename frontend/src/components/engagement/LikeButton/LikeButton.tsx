// frontend/src/components/engagement/LikeButton/LikeButton.tsx
import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useLike } from '../../../hooks/engagement/useLike';
import { cn } from '../../../utils/cn';
import { showToast } from '../../ui/Toast/Toast';

export interface LikeButtonProps {
  contentId: string;
  initialLiked: boolean;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const buttonSizeClasses = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-2.5',
};

export const LikeButton = ({
  contentId,
  initialLiked,
  initialCount = 0,
  size = 'md',
  showCount = true,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const { mutate: like, isPending } = useLike();

  const handleLike = async () => {
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
    
    like(
      { contentId, action: !previousLiked ? 'like' : 'unlike' },
      {
        onError: () => {
          setIsLiked(previousLiked);
          setLikeCount(previousCount);
          showToast.error(`Failed to ${previousLiked ? 'unlike' : 'like'} content`);
        },
      }
    );
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'flex items-center gap-2 rounded-lg transition-all duration-200',
        'hover:scale-105 active:scale-95',
        buttonSizeClasses[size],
        isLiked
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-500 hover:text-red-500 dark:text-gray-400'
      )}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? (
        <HeartSolidIcon className={cn(sizeClasses[size], 'fill-current')} />
      ) : (
        <HeartIcon className={sizeClasses[size]} />
      )}
      {showCount && likeCount > 0 && (
        <span className="text-sm font-medium">{likeCount}</span>
      )}
    </button>
  );
};

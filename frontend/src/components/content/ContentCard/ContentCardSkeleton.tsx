// frontend/src/components/content/ContentCard/ContentCardSkeleton.tsx
import { cn } from '../../../utils/cn';

export interface ContentCardSkeletonProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: {
    container: 'w-40',
    thumbnail: 'h-40',
    title: 'h-4',
    artist: 'h-3',
  },
  medium: {
    container: 'w-48',
    thumbnail: 'h-48',
    title: 'h-5',
    artist: 'h-4',
  },
  large: {
    container: 'w-64',
    thumbnail: 'h-64',
    title: 'h-6',
    artist: 'h-5',
  },
};

export const ContentCardSkeleton = ({ size = 'medium' }: ContentCardSkeletonProps) => {
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn('animate-pulse', sizeClass.container)}>
      <div className={cn('bg-gray-200 dark:bg-gray-700 rounded-xl', sizeClass.thumbnail)} />
      <div className="mt-3 space-y-2">
        <div className={cn('bg-gray-200 dark:bg-gray-700 rounded', sizeClass.title)} />
        <div className={cn('bg-gray-200 dark:bg-gray-700 rounded w-3/4', sizeClass.artist)} />
        <div className="flex gap-3">
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-8 h-3" />
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-8 h-3" />
        </div>
      </div>
    </div>
  );
};

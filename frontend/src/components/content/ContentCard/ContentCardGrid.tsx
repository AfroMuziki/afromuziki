// frontend/src/components/content/ContentCard/ContentCardGrid.tsx
import { Content } from '../../../types/content.types';
import { ContentCard } from './ContentCard';
import { ContentCardSkeleton } from './ContentCardSkeleton';

export interface ContentCardGridProps {
  items: Content[];
  isLoading?: boolean;
  skeletonCount?: number;
  size?: 'small' | 'medium' | 'large';
  showArtist?: boolean;
  showStats?: boolean;
}

export const ContentCardGrid = ({
  items,
  isLoading = false,
  skeletonCount = 8,
  size = 'medium',
  showArtist = true,
  showStats = true,
}: ContentCardGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ContentCardSkeleton key={index} size={size} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No content available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          content={item}
          size={size}
          showArtist={showArtist}
          showStats={showStats}
        />
      ))}
    </div>
  );
};

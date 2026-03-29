// frontend/src/components/content/ContentCard/ContentCard.tsx
import { Link } from 'react-router-dom';
import { PlayIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Content } from '../../../types/content.types';
import { formatNumber, formatDuration } from '../../../utils/formatters/number';
import { paths } from '../../../router/paths';
import { cn } from '../../../utils/cn';

export interface ContentCardProps {
  content: Content;
  size?: 'small' | 'medium' | 'large';
  showArtist?: boolean;
  showStats?: boolean;
  className?: string;
}

const sizeClasses = {
  small: {
    container: 'w-40',
    thumbnail: 'h-40',
    title: 'text-sm',
    artist: 'text-xs',
  },
  medium: {
    container: 'w-48',
    thumbnail: 'h-48',
    title: 'text-base',
    artist: 'text-sm',
  },
  large: {
    container: 'w-64',
    thumbnail: 'h-64',
    title: 'text-lg',
    artist: 'text-base',
  },
};

export const ContentCard = ({
  content,
  size = 'medium',
  showArtist = true,
  showStats = true,
  className,
}: ContentCardProps) => {
  const sizeClass = sizeClasses[size];

  return (
    <Link
      to={paths.contentDetail(content.id)}
      className={cn('group cursor-pointer', sizeClass.container, className)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {/* Thumbnail */}
        <div className={cn('relative overflow-hidden', sizeClass.thumbnail)}>
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-gold-500 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Duration Badge */}
          {content.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {formatDuration(content.duration)}
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md capitalize">
            {content.type}
          </div>
        </div>
        
        {/* Content Info */}
        <div className="mt-3 space-y-1">
          <h3 className={cn('font-semibold text-gray-900 dark:text-white line-clamp-1', sizeClass.title)}>
            {content.title}
          </h3>
          
          {showArtist && content.artist && (
            <p className={cn('text-gray-500 dark:text-gray-400 line-clamp-1', sizeClass.artist)}>
              {content.artist.username}
            </p>
          )}
          
          {showStats && (
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <HeartIcon className="w-3 h-3" />
                <span>{formatNumber(content.likes_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="w-3 h-3" />
                <span>{formatNumber(content.comments_count)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// frontend/src/components/artist/ArtistCard/ArtistCard.tsx
import { Link } from 'react-router-dom';
import { UserIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Artist } from '../../../types/artist.types';
import { paths } from '../../../router/paths';
import { formatNumber } from '../../../utils/formatters/number';
import { cn } from '../../../utils/cn';

export interface ArtistCardProps {
  artist: Artist;
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
  className?: string;
}

const sizeClasses = {
  small: {
    container: 'w-32',
    avatar: 'w-20 h-20',
    name: 'text-sm',
    followers: 'text-xs',
  },
  medium: {
    container: 'w-40',
    avatar: 'w-28 h-28',
    name: 'text-base',
    followers: 'text-sm',
  },
  large: {
    container: 'w-48',
    avatar: 'w-36 h-36',
    name: 'text-lg',
    followers: 'text-base',
  },
};

export const ArtistCard = ({ artist, size = 'medium', showStats = true, className }: ArtistCardProps) => {
  const sizeClass = sizeClasses[size];

  return (
    <Link
      to={paths.artistProfile(artist.username)}
      className={cn('group text-center', sizeClass.container, className)}
    >
      <div className="relative mx-auto">
        <div className={cn('mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gold-400 to-gold-600', sizeClass.avatar)}>
          {artist.avatar_url ? (
            <img
              src={artist.avatar_url}
              alt={artist.username}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy-600">
              <UserIcon className="w-1/2 h-1/2 text-white/50" />
            </div>
          )}
        </div>
        
        {artist.is_verified && (
          <div className="absolute -bottom-1 -right-1 bg-gold-500 rounded-full p-0.5">
            <CheckBadgeIcon className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className={cn('font-semibold text-gray-900 dark:text-white line-clamp-1', sizeClass.name)}>
          {artist.username}
        </h3>
        
        {showStats && (
          <p className={cn('text-gray-500 dark:text-gray-400', sizeClass.followers)}>
            {formatNumber(artist.followers_count)} followers
          </p>
        )}
      </div>
    </Link>
  );
};

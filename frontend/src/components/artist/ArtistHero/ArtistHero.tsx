// frontend/src/components/artist/ArtistHero/ArtistHero.tsx
import { Artist } from '../../../types/artist.types';
import { FollowButton } from '../FollowButton/FollowButton';
import { VerifiedBadge } from '../VerifiedBadge/VerifiedBadge';
import { formatNumber } from '../../../utils/formatters/number';
import { UserIcon } from '@heroicons/react/24/solid';

export interface ArtistHeroProps {
  artist: Artist;
}

export const ArtistHero = ({ artist }: ArtistHeroProps) => {
  return (
    <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 text-white">
      {/* Cover Image */}
      {artist.cover_url && (
        <div className="absolute inset-0">
          <img
            src={artist.cover_url}
            alt={artist.username}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
            {artist.avatar_url ? (
              <img
                src={artist.avatar_url}
                alt={artist.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-navy-700">
                <UserIcon className="w-16 h-16 text-white/50" />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{artist.username}</h1>
              {artist.is_verified && <VerifiedBadge size="lg" />}
            </div>
            
            {artist.full_name && (
              <p className="text-gray-300 mb-2">{artist.full_name}</p>
            )}
            
            {artist.country && (
              <p className="text-gray-300 text-sm mb-4">
                From {artist.country}
              </p>
            )}
            
            <div className="flex items-center gap-6 justify-center md:justify-start mb-6">
              <div>
                <div className="text-2xl font-bold">{formatNumber(artist.followers_count)}</div>
                <div className="text-sm text-gray-300">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatNumber(artist.total_plays)}</div>
                <div className="text-sm text-gray-300">Total Plays</div>
              </div>
            </div>
            
            <FollowButton artistId={artist.id} initialFollowing={artist.is_following || false} />
          </div>
        </div>
      </div>
    </div>
  );
};

// frontend/src/pages/public/ArtistProfilePage/ArtistProfilePage.tsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useArtistProfile } from '../../../hooks/artist/useArtistProfile';
import { useArtistContent } from '../../../hooks/artist/useArtistContent';
import { ArtistHero } from '../../../components/artist/ArtistHero/ArtistHero';
import { ArtistStats } from '../../../components/artist/ArtistStats/ArtistStats';
import { ContentCardGrid } from '../../../components/content/ContentCardGrid/ContentCardGrid';
import { Tabs, Tab } from '../../../components/ui/Tabs/Tabs';
import { LoadingSpinner } from '../../../components/ui/Spinner/Spinner';
import { NotFoundPage } from '../NotFoundPage';

export const ArtistProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState('tracks');

  const { data: artist, isLoading: artistLoading } = useArtistProfile(username!);
  const { data: content, isLoading: contentLoading } = useArtistContent(artist?.id);

  if (artistLoading) {
    return <LoadingSpinner />;
  }

  if (!artist) {
    return <NotFoundPage />;
  }

  const tracks = content?.filter((c) => c.type === 'audio') || [];
  const videos = content?.filter((c) => c.type === 'video') || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ArtistHero artist={artist} />

      <div className="container mx-auto px-4 py-8">
        <ArtistStats
          followers={artist.followers_count}
          totalPlays={artist.total_plays}
          totalTracks={tracks.length}
          totalVideos={videos.length}
        />

        <div className="mt-12">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab value="tracks" label={`Tracks (${tracks.length})`} />
            <Tab value="videos" label={`Videos (${videos.length})`} />
            <Tab value="about" label="About" />
          </Tabs>

          <div className="mt-6">
            {activeTab === 'tracks' && (
              <ContentCardGrid items={tracks} />
            )}
            {activeTab === 'videos' && (
              <ContentCardGrid items={videos} />
            )}
            {activeTab === 'about' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {artist.bio || 'No bio provided yet.'}
                </p>
                {artist.website && (
                  <p>
                    <strong>Website:</strong>{' '}
                    <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-gold-600">
                      {artist.website}
                    </a>
                  </p>
                )}
                {artist.social_links && (
                  <div>
                    <strong>Social Links:</strong>
                    <ul className="mt-2">
                      {artist.social_links.instagram && (
                        <li>
                          <a href={artist.social_links.instagram} target="_blank" rel="noopener noreferrer">
                            Instagram
                          </a>
                        </li>
                      )}
                      {artist.social_links.twitter && (
                        <li>
                          <a href={artist.social_links.twitter} target="_blank" rel="noopener noreferrer">
                            Twitter
                          </a>
                        </li>
                      )}
                      {artist.social_links.facebook && (
                        <li>
                          <a href={artist.social_links.facebook} target="_blank" rel="noopener noreferrer">
                            Facebook
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

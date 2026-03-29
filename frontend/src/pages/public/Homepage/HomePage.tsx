// frontend/src/pages/public/HomePage/HomePage.tsx
import { useEffect } from 'react';
import { HeroSection } from './sections/HeroSection';
import { TrendingSection } from './sections/TrendingSection';
import { NewReleasesSection } from './sections/NewReleasesSection';
import { FeaturedArtistsSection } from './sections/FeaturedArtistsSection';
import { GenreGridSection } from './sections/GenreGridSection';
import { useContentStore } from '../../../store/contentStore';
import { useArtistStore } from '../../../store/artistStore';
import { LoadingSpinner } from '../../../components/ui/Spinner/Spinner';

export const HomePage = () => {
  const { trending, newReleases, isLoading: contentLoading } = useContentStore();
  const { featuredArtists, isLoading: artistsLoading } = useArtistStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (contentLoading || artistsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <TrendingSection tracks={trending} />
        <NewReleasesSection releases={newReleases} />
        <FeaturedArtistsSection artists={featuredArtists} />
        <GenreGridSection />
      </main>
    </div>
  );
};

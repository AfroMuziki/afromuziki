// frontend/src/pages/public/BrowsePage/BrowsePage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContentCardGrid } from '../../../components/content/ContentCardGrid/ContentCardGrid';
import { FilterPanel } from '../../../components/search/FilterPanel/FilterPanel';
import { SearchBar } from '../../../components/search/SearchBar/SearchBar';
import { Pagination } from '../../../components/ui/Pagination/Pagination';
import { useBrowseContent } from '../../../hooks/content/useBrowseContent';
import { LoadingSpinner } from '../../../components/ui/Spinner/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState';

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || '',
    type: searchParams.get('type') || 'all',
    sort: searchParams.get('sort') || 'trending',
  });

  const { data, isLoading, error } = useBrowseContent({
    page,
    limit: 20,
    ...filters,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
    setSearchParams({ ...newFilters, page: '1' });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load content"
        description="Please try again later"
        actionText="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Music & Videos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing African content from talented artists
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Filters and Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {data?.items.length || 0} of {data?.total || 0} results
              </p>
            </div>

            {data?.items.length === 0 ? (
              <EmptyState
                title="No content found"
                description="Try adjusting your filters or search query"
              />
            ) : (
              <>
                <ContentCardGrid items={data?.items || []} />
                {data && data.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={data.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

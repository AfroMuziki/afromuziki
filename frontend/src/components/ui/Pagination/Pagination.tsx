// frontend/src/components/ui/Pagination/Pagination.tsx
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3;
    
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, totalPageNumbers - 2);
      return [...leftRange, '...', totalPages];
    }
    
    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (totalPageNumbers - 2) + 1, totalPages);
      return [1, '...', ...rightRange];
    }
    
    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }
    
    return range(1, totalPages);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-lg transition-colors',
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed dark:text-gray-700'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        )}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }
        
        const pageNumber = page as number;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              'min-w-[36px] h-9 px-3 rounded-lg font-medium transition-colors',
              currentPage === pageNumber
                ? 'bg-gold-500 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
          >
            {pageNumber}
          </button>
        );
      })}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed dark:text-gray-700'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        )}
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </nav>
  );
};

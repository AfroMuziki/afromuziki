// frontend/src/components/artist/VerifiedBadge/VerifiedBadge.tsx
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';

export interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const VerifiedBadge = ({ size = 'md', className, showTooltip = true }: VerifiedBadgeProps) => {
  return (
    <div className="relative inline-flex group">
      <CheckBadgeIcon
        className={cn('text-gold-500', sizeClasses[size], className)}
        aria-label="Verified Artist"
      />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
          Verified Artist
        </div>
      )}
    </div>
  );
};

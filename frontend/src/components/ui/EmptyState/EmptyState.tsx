// frontend/src/components/ui/EmptyState/EmptyState.tsx
import { Button } from '../Button/Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, icon, actionText, onAction }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 px-4">
      {icon && <div className="text-gray-400 dark:text-gray-600 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>}
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};

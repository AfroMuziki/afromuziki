// frontend/src/utils/formatters/date.ts
import { formatDistanceToNow, format } from 'date-fns';

export const formatRelativeDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'MMM dd, yyyy h:mm a');
};

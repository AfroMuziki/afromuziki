// frontend/src/components/ui/Toast/ToastProvider.tsx
import { Toaster as SonnerToaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-text)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
        },
        className: 'font-sans',
        duration: 4000,
      }}
      closeButton
      richColors
    />
  );
};

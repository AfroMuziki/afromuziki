// frontend/src/App.tsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { router } from './router';
import { queryClient } from './config/queryClient';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { AuthProvider } from './components/providers/AuthProvider';
import { PlayerProvider } from './components/providers/PlayerProvider';
import { ErrorBoundary } from './components/ui/ErrorBoundary/ErrorBoundary';
import { initializeAnalytics } from './services/analytics/ga4';
import { initializeSentry } from './services/sentry/sentry';

function App() {
  useEffect(() => {
    initializeAnalytics();
    initializeSentry();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              <RouterProvider router={router} />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-text)',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

// frontend/src/services/sentry/sentry.ts
import * as Sentry from '@sentry/react';
import { env } from '../../config/env';

export const initializeSentry = () => {
  if (!env.sentryDsn) return;
  
  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.isProduction ? 'production' : 'development',
    tracesSampleRate: env.isProduction ? 0.2 : 1.0,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
  });
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (env.sentryDsn) {
    Sentry.captureException(error, { extra: context });
  }
  console.error(error);
};

export const captureMessage = (message: string, level?: Sentry.SeverityLevel) => {
  if (env.sentryDsn) {
    Sentry.captureMessage(message, level);
  }
  console.log(message);
};

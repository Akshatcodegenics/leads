'use client';

import { SessionProvider } from 'next-auth/react';
import { Navigation } from '@/components/navigation';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ErrorBoundary>
        <Navigation />
        <main className="container mx-auto px-4 py-8 animate-fadeIn">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </ErrorBoundary>
    </SessionProvider>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buyer Lead Intake',
  description: 'Manage and track buyer leads efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
        <ErrorBoundary>
          <Navigation />
          <main className="container mx-auto px-4 py-8 animate-fadeIn">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}

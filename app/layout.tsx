import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/navigation';
import { ToastProvider } from '@/components/ui/toast';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buyer Lead Intake',
  description: 'Manage buyer leads and property inquiries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <Navigation />
                <main className="container mx-auto px-4 py-8 page-transition">
                  <div className="animate-fadeIn">
                    {children}
                  </div>
                </main>
              </div>
            </ErrorBoundary>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

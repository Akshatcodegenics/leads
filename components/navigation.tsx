'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Users, Plus, Upload, Download } from 'lucide-react';

export function Navigation() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <nav className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">🏠 Buyer Lead Intake</h1>
            </div>
            <div className="shimmer h-8 w-20 rounded-xl"></div>
          </div>
        </div>
      </nav>
    );
  }

  if (!session) {
    return (
      <nav className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">🏠 Buyer Lead Intake</h1>
            <button
              onClick={() => signIn()}
              className="btn btn-primary"
            >
              ✨ Sign In
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🏠 Buyer Lead Intake
            </h1>
            {session && (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/buyers" className="nav-link">
                  📋 Leads
                </Link>
                <Link href="/buyers/new" className="nav-link">
                  ➕ New Lead
                </Link>
                <Link href="/buyers/import" className="nav-link">
                  📥 Import
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent font-medium">
              👤 {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="btn btn-secondary text-sm"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

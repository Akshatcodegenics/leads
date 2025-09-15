'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">🏠 Buyer Lead Intake</h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your real estate business with our powerful lead management platform
        </p>
        <Link href="/auth/signin" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🏠 Welcome to Buyer Lead Intake
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your real estate business with our powerful lead management platform
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card">
            <div className="text-3xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Active Leads</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Converted</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card group">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                📋
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">View Leads</h2>
            <p className="text-gray-600 mb-6">
              Browse, filter, and manage all your buyer leads with advanced search capabilities
            </p>
            <Link href="/buyers" className="btn btn-primary w-full">
              📊 View All Leads
            </Link>
          </div>
        </div>

        <div className="card group">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                ➕
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Add New Lead</h2>
            <p className="text-gray-600 mb-6">
              Create detailed buyer profiles with property preferences and contact information
            </p>
            <Link href="/buyers/new" className="btn btn-success w-full">
              ✨ Create New Lead
            </Link>
          </div>
        </div>

        <div className="card group">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                📥
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Import Leads</h2>
            <p className="text-gray-600 mb-6">
              Bulk import leads from CSV files with validation and error reporting
            </p>
            <Link href="/buyers/import" className="btn btn-secondary w-full">
              📁 Import CSV
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 animate-slideIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            ✨ Powerful Features
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="font-semibold mb-2">Smart Search</h3>
            <p className="text-sm text-gray-600">Advanced filtering and full-text search</p>
          </div>
          
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Status Tracking</h3>
            <p className="text-sm text-gray-600">Track lead progress through sales funnel</p>
          </div>
          
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-2xl mb-3">📈</div>
            <h3 className="font-semibold mb-2">History & Analytics</h3>
            <p className="text-sm text-gray-600">Complete audit trail and insights</p>
          </div>
          
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Secure & Fast</h3>
            <p className="text-sm text-gray-600">Enterprise-grade security and performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

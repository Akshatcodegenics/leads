'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { BuyerFilters } from '@/lib/validations/buyer';

interface BuyersFiltersProps {
  initialFilters: BuyerFilters;
}

export function BuyersFilters({ initialFilters }: BuyersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: initialFilters.city || '',
    propertyType: initialFilters.propertyType || '',
    status: initialFilters.status || '',
    timeline: initialFilters.timeline || '',
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search: search || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const updateURL = (newParams: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Object.keys(newParams).some(key => key !== 'page')) {
      current.set('page', '1');
    }

    router.push(`/buyers?${current.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL({ [key]: value || undefined });
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({
      city: '',
      propertyType: '',
      status: '',
      timeline: '',
    });
    router.push('/buyers');
  };

  const hasActiveFilters = search || Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by name, phone, email, or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🔍 Filter & Search
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏙️ City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="form-select w-full"
                >
                  <option value="">All cities</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Zirakpur">Zirakpur</option>
                  <option value="Panchkula">Panchkula</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏠 Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="form-select w-full"
                >
                  <option value="">All types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="form-select w-full"
                >
                  <option value="">All statuses</option>
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Visited">Visited</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Converted">Converted</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏰ Timeline
                </label>
                <select
                  value={filters.timeline}
                  onChange={(e) => handleFilterChange('timeline', e.target.value)}
                  className="form-select w-full"
                >
                  <option value="">All timelines</option>
                  <option value="0-3m">0-3 months</option>
                  <option value="3-6m">3-6 months</option>
                  <option value=">6m">More than 6 months</option>
                  <option value="Exploring">Just exploring</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

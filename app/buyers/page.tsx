'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BuyersList } from '@/components/buyers/buyers-list';
import { BuyersFilters } from '@/components/buyers/buyers-filters';
import { BuyersPagination } from '@/components/buyers/buyers-pagination';
import { ExportBuyersButton } from '@/components/buyers/export-buyers-button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function BuyersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buyers, setBuyers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchBuyers();
    }
  }, [status, session, searchParams]);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/buyers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBuyers(data.buyers);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const currentFilters = {
    search: searchParams.get('search') || undefined,
    city: searchParams.get('city') as any || undefined,
    propertyType: searchParams.get('propertyType') as any || undefined,
    status: searchParams.get('status') as any || undefined,
    timeline: searchParams.get('timeline') as any || undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    sortBy: (searchParams.get('sortBy') as 'updatedAt' | 'createdAt' | 'fullName') || 'updatedAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Leads</h1>
          <p className="text-gray-600">
            Manage and track your buyer leads ({pagination.total} total)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportBuyersButton />
          <Link href="/buyers/new" className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Link>
        </div>
      </div>

      {/* Filters */}
      <BuyersFilters initialFilters={currentFilters} />

      {/* Results */}
      <div className="card">
        <BuyersList buyers={buyers} />
        <BuyersPagination pagination={pagination} />
      </div>
    </div>
  );
}

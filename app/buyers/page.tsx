import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { buyerFiltersSchema } from '@/lib/validations/buyer';
import { BuyersList } from '@/components/buyers/buyers-list';
import { BuyersFilters } from '@/components/buyers/buyers-filters';
import { BuyersPagination } from '@/components/buyers/buyers-pagination';
import { ExportBuyersButton } from '@/components/buyers/export-buyers-button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface BuyersPageProps {
  searchParams: {
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function BuyersPage({
  searchParams,
}: BuyersPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Parse and validate filters
  const filters = buyerFiltersSchema.parse({
    search: searchParams.search || undefined,
    city: searchParams.city || undefined,
    propertyType: searchParams.propertyType || undefined,
    status: searchParams.status || undefined,
    timeline: searchParams.timeline || undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
    sortBy: searchParams.sortBy || 'updatedAt',
    sortOrder: searchParams.sortOrder || 'desc',
  });

  // Fetch buyers data
  const userId = session.user.email!;
  const { buyers, pagination } = await BuyerService.getBuyers(filters, userId);

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
      <BuyersFilters initialFilters={filters} />

      {/* Results */}
      <div className="card">
        <BuyersList buyers={buyers} />
        <BuyersPagination pagination={pagination} />
      </div>
    </div>
  );
}

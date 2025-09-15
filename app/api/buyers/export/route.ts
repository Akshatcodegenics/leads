import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { buyerFiltersSchema } from '@/lib/validations/buyer';
import { stringify } from 'csv-stringify/sync';

// GET /api/buyers/export - Export buyers to CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse filters (same as list endpoint but with high limit)
    const filters = buyerFiltersSchema.parse({
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      timeline: searchParams.get('timeline') || undefined,
      page: 1,
      limit: 10000, // Export all matching records
      sortBy: searchParams.get('sortBy') || 'updatedAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    });

    const { buyers } = await BuyerService.getBuyers(filters, session.user.id);

    // Transform buyers data for CSV export
    const csvData = buyers.map(buyer => ({
      'Full Name': buyer.fullName,
      'Email': buyer.email || '',
      'Phone': buyer.phone,
      'City': buyer.city,
      'Property Type': buyer.propertyType,
      'BHK': buyer.bhk || '',
      'Purpose': buyer.purpose,
      'Budget Min': buyer.budgetMin || '',
      'Budget Max': buyer.budgetMax || '',
      'Timeline': buyer.timeline,
      'Source': buyer.source,
      'Status': buyer.status,
      'Notes': buyer.notes || '',
      'Tags': buyer.tags ? buyer.tags.join(', ') : '',
      'Owner': buyer.owner.name || buyer.owner.email,
      'Created At': buyer.createdAt.toISOString(),
      'Updated At': buyer.updatedAt.toISOString(),
    }));

    // Generate CSV
    const csv = stringify(csvData, {
      header: true,
      columns: [
        'Full Name', 'Email', 'Phone', 'City', 'Property Type', 'BHK',
        'Purpose', 'Budget Min', 'Budget Max', 'Timeline', 'Source', 'Status',
        'Notes', 'Tags', 'Owner', 'Created At', 'Updated At'
      ]
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `buyers-export-${timestamp}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('GET /api/buyers/export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

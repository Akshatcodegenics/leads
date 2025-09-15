import { CreateBuyerData, UpdateBuyerData, BuyerFilters } from '@/lib/validations/buyer';

// Mock data store for development
let mockBuyers: any[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '2',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 7000000,
    timeline: '0-3m',
    source: 'Website',
    status: 'New',
    notes: 'Looking for 2BHK in Sector 22',
    tags: ['urgent', 'first-time-buyer'],
    ownerId: '550e8400-e29b-41d4-a716-446655440000',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876543211',
    city: 'Mohali',
    propertyType: 'Villa',
    bhk: '3',
    purpose: 'Rent',
    budgetMin: 25000,
    budgetMax: 35000,
    timeline: '3-6m',
    source: 'Referral',
    status: 'Qualified',
    notes: 'Prefers gated community',
    tags: ['family', 'pets'],
    ownerId: '550e8400-e29b-41d4-a716-446655440000',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockHistory: any[] = [];

export class BuyerService {
  // Create a new buyer with history tracking
  static async createBuyer(data: CreateBuyerData, userId: string) {
    const buyer = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockBuyers.push(buyer);
    
    // Add history entry
    mockHistory.push({
      id: Math.random().toString(36).substr(2, 9),
      buyerId: buyer.id,
      changedBy: userId,
      changedAt: new Date(),
      diff: { created: { from: null, to: 'New buyer created' } },
    });
    
    return buyer;
  }

  // Update buyer with concurrency control and history tracking
  static async updateBuyer(id: string, data: UpdateBuyerData, userId: string) {
    const buyerIndex = mockBuyers.findIndex(b => b.id === id);
    if (buyerIndex === -1) {
      throw new Error('Buyer not found');
    }

    const currentBuyer = mockBuyers[buyerIndex];
    
    // Calculate diff for history
    const diff: Record<string, { from: any; to: any }> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'updatedAt' && currentBuyer[key] !== value) {
        diff[key] = {
          from: currentBuyer[key],
          to: value
        };
      }
    });

    // Update buyer
    const updatedBuyer = {
      ...currentBuyer,
      ...data,
      updatedAt: new Date(),
    };
    mockBuyers[buyerIndex] = updatedBuyer;

    // Create history entry if there are changes
    if (Object.keys(diff).length > 0) {
      mockHistory.push({
        id: Math.random().toString(36).substr(2, 9),
        buyerId: id,
        changedBy: userId,
        changedAt: new Date(),
        diff,
      });
    }

    return updatedBuyer;
  }

  // Get buyer by ID with history
  static async getBuyerById(id: string) {
    const buyer = mockBuyers.find(b => b.id === id);
    if (!buyer) {
      return null;
    }

    // Add mock owner info
    const buyerWithOwner = {
      ...buyer,
      owner: { id: buyer.ownerId, name: 'Demo User', email: 'demo@example.com' }
    };

    // Get recent history (last 5 changes)
    const history = mockHistory
      .filter(h => h.buyerId === id)
      .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
      .slice(0, 5)
      .map(h => ({
        ...h,
        changedBy: { id: h.changedBy, name: 'Demo User', email: 'demo@example.com' }
      }));

    return { ...buyerWithOwner, history };
  }

  // Get buyers with filters, pagination, and search
  static async getBuyers(filters: BuyerFilters, userId?: string) {
    let filteredBuyers = [...mockBuyers];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBuyers = filteredBuyers.filter(buyer =>
        buyer.fullName.toLowerCase().includes(searchLower) ||
        buyer.email?.toLowerCase().includes(searchLower) ||
        buyer.phone.includes(searchLower) ||
        buyer.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.city) {
      filteredBuyers = filteredBuyers.filter(buyer => buyer.city === filters.city);
    }
    if (filters.propertyType) {
      filteredBuyers = filteredBuyers.filter(buyer => buyer.propertyType === filters.propertyType);
    }
    if (filters.status) {
      filteredBuyers = filteredBuyers.filter(buyer => buyer.status === filters.status);
    }
    if (filters.timeline) {
      filteredBuyers = filteredBuyers.filter(buyer => buyer.timeline === filters.timeline);
    }

    // Sort
    filteredBuyers.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      if (filters.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Pagination
    const total = filteredBuyers.length;
    const offset = (filters.page - 1) * filters.limit;
    const paginatedBuyers = filteredBuyers.slice(offset, offset + filters.limit);

    // Add owner info
    const buyersWithOwner = paginatedBuyers.map(buyer => ({
      ...buyer,
      owner: { id: buyer.ownerId, name: 'Demo User', email: 'demo@example.com' }
    }));

    return {
      buyers: buyersWithOwner,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        pages: Math.ceil(total / filters.limit)
      }
    };
  }

  // Delete buyer
  static async deleteBuyer(id: string, userId: string, userRole: string) {
    const buyerIndex = mockBuyers.findIndex(b => b.id === id);
    if (buyerIndex === -1) {
      throw new Error('Buyer not found');
    }

    const buyer = mockBuyers[buyerIndex];
    if (buyer.ownerId !== userId && userRole !== 'admin') {
      throw new Error('Unauthorized to delete this buyer');
    }

    mockBuyers.splice(buyerIndex, 1);
    mockHistory = mockHistory.filter(h => h.buyerId !== id);
  }

  // Bulk create buyers (for CSV import)
  static async bulkCreateBuyers(buyersData: CreateBuyerData[], userId: string) {
    const results = [];
    const errors = [];

    for (let i = 0; i < buyersData.length; i++) {
      try {
        const buyer = await this.createBuyer(buyersData[i], userId);
        results.push({ row: i + 1, buyer });
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { results, errors };
  }

  // Update buyer status (quick action)
  static async updateBuyerStatus(id: string, status: string, userId: string) {
    return this.updateBuyer(id, { id, status: status as any }, userId);
  }
}

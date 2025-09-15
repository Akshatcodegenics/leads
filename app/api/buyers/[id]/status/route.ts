import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { statusSchema } from '@/lib/validations/buyer';
import { z } from 'zod';

// PATCH /api/buyers/[id]/status - Quick status update
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = z.object({ status: statusSchema }).parse(body);

    // Check if user owns the buyer or is admin
    const existingBuyer = await BuyerService.getBuyerById(params.id);
    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (existingBuyer.ownerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to edit this buyer' }, { status: 403 });
    }

    const buyer = await BuyerService.updateBuyerStatus(params.id, status, session.user.id);
    return NextResponse.json(buyer);
  } catch (error) {
    console.error('PATCH /api/buyers/[id]/status error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid status', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

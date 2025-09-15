import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { updateBuyerSchema } from '@/lib/validations/buyer';
import { z } from 'zod';

// GET /api/buyers/[id] - Get buyer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buyer = await BuyerService.getBuyerById(params.id);
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    console.error('GET /api/buyers/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/buyers/[id] - Update buyer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateBuyerSchema.parse({ ...body, id: params.id });

    // Check if user owns the buyer or is admin
    const existingBuyer = await BuyerService.getBuyerById(params.id);
    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (existingBuyer.ownerId !== session.user.email && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to edit this buyer' }, { status: 403 });
    }

    const buyer = await BuyerService.updateBuyer(params.id, data, session.user.email);
    return NextResponse.json(buyer);
  } catch (error) {
    console.error('PUT /api/buyers/[id] error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('modified by another user')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/buyers/[id] - Delete buyer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await BuyerService.deleteBuyer(params.id, session.user.email, session.user.role || 'user');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/buyers/[id] error:', error);
    if (error instanceof Error && error.message === 'Buyer not found') {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'Unauthorized to delete this buyer') {
      return NextResponse.json({ error: 'Unauthorized to delete this buyer' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

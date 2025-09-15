import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { csvBuyerSchema } from '@/lib/validations/buyer';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';

// POST /api/buyers/import - Import buyers from CSV
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    const csvText = await file.text();
    
    // Parse CSV
    let records;
    try {
      records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
    }

    if (records.length > 200) {
      return NextResponse.json({ error: 'CSV file cannot contain more than 200 rows' }, { status: 400 });
    }

    // Validate and transform each record
    const validatedRecords = [];
    const validationErrors = [];

    for (let i = 0; i < records.length; i++) {
      try {
        const validated = csvBuyerSchema.parse(records[i]);
        validatedRecords.push(validated);
      } catch (error) {
        if (error instanceof z.ZodError) {
          validationErrors.push({
            row: i + 2, // +2 because CSV has header row and we're 0-indexed
            errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
          });
        }
      }
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: 'Validation failed',
        validationErrors,
        totalRows: records.length,
        validRows: validatedRecords.length
      }, { status: 400 });
    }

    // Import valid records
    const validatedData = validatedRecords[0];
    const buyer = await BuyerService.createBuyer(validatedData, session.user.email);

    return NextResponse.json({
      success: true,
      imported: 1,
      details: { buyer }
      details: { results, errors }
    });

  } catch (error) {
    console.error('POST /api/buyers/import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getPriceCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = decodeURIComponent(resolvedParams.id);
    const body = await request.json();
    const { price, name, originalPrice } = body;

    if (price === undefined || isNaN(Number(price))) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    const numericPrice = Number(price);
    const collection = await getPriceCollection();

    await collection.updateOne(
      { id },
      {
        $set: {
          id,
          name: name || '',
          price: numericPrice,
          originalPrice: originalPrice !== undefined ? Number(originalPrice) : null,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      item: { id, name, price: numericPrice, originalPrice },
    });
  } catch (err) {
    console.error('MongoDB PUT /api/prices/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = decodeURIComponent(resolvedParams.id);
    const collection = await getPriceCollection();

    await collection.deleteOne({ id });

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('MongoDB DELETE /api/prices/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

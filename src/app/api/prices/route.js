import { NextResponse } from 'next/server';
import { getPriceCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collection = await getPriceCollection();
    const docs = await collection.find({}).toArray();
    const priceMap = {};
    docs.forEach((doc) => {
      priceMap[doc.id] = doc.price;
    });
    return NextResponse.json({ success: true, prices: priceMap, items: docs });
  } catch (err) {
    console.error('MongoDB GET /api/prices error:', err);
    return NextResponse.json({ success: false, error: err.message, prices: {} }, { status: 500 });
  }
}

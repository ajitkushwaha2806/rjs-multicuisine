import { NextResponse } from 'next/server';
import { getSettingsCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  discountPercent: 0,
  cgstPercent: 2.5,
  gstPercent: 2.5,
  upiId: '8490065500@upi',
  upiName: "RJ's Multicuisine",
};

export async function GET() {
  try {
    const collection = await getSettingsCollection();
    const doc = await collection.findOne({ _id: 'billing_settings' });
    if (doc) {
      return NextResponse.json({
        success: true,
        settings: {
          discountPercent: Number(doc.discountPercent ?? DEFAULT_SETTINGS.discountPercent),
          cgstPercent: Number(doc.cgstPercent ?? DEFAULT_SETTINGS.cgstPercent),
          gstPercent: Number(doc.gstPercent ?? DEFAULT_SETTINGS.gstPercent),
          upiId: doc.upiId || DEFAULT_SETTINGS.upiId,
          upiName: doc.upiName || DEFAULT_SETTINGS.upiName,
        },
      });
    }

    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (err) {
    console.warn('MongoDB GET /api/settings/billing notice:', err.message);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { discountPercent, cgstPercent, gstPercent, upiId, upiName } = body;

    const updated = {
      _id: 'billing_settings',
      discountPercent: Math.max(0, Math.min(100, Number(discountPercent || 0))),
      cgstPercent: Math.max(0, Number(cgstPercent ?? 2.5)),
      gstPercent: Math.max(0, Number(gstPercent ?? 2.5)),
      upiId: (upiId || DEFAULT_SETTINGS.upiId).trim(),
      upiName: (upiName || DEFAULT_SETTINGS.upiName).trim(),
      updatedAt: new Date().toISOString(),
    };

    const collection = await getSettingsCollection();
    await collection.updateOne(
      { _id: 'billing_settings' },
      { $set: updated },
      { upsert: true }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error('MongoDB PUT /api/settings/billing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


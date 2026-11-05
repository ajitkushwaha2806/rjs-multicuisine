import { NextResponse } from 'next/server';
import { getMenuCollection, getPriceCollection } from '@/lib/mongodb';
import { SAMPLE_MENU_ITEMS, MENU_CATEGORIES } from '@/data/menuData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const menuCollection = await getMenuCollection();
    const priceCollection = await getPriceCollection();

    // Check count in MongoDB
    const count = await menuCollection.countDocuments();

    // Auto-seed if database collection is empty
    if (count === 0) {
      console.log(`[MongoDB] Initializing & seeding ${SAMPLE_MENU_ITEMS.length} dishes to MongoDB...`);
      const seedData = SAMPLE_MENU_ITEMS.map((item) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      try {
        await menuCollection.createIndex({ id: 1 }, { unique: true });
        await menuCollection.insertMany(seedData, { ordered: false });
      } catch (insertErr) {
        console.warn('Seed insert note:', insertErr.message);
      }
    }

    // Fetch all items from MongoDB
    const dbItems = await menuCollection.find({}, { projection: { _id: 0 } }).toArray();

    // Fetch price overrides if any to ensure prices are up to the second
    let priceMap = {};
    try {
      const priceDocs = await priceCollection.find({}).toArray();
      priceDocs.forEach((doc) => {
        if (doc.id && doc.price !== undefined) {
          priceMap[doc.id] = doc.price;
        }
      });
    } catch (e) {
      console.warn('Could not fetch price overrides for menu:', e);
    }

    // Merge latest price overrides from DB
    const finalItems = (dbItems.length > 0 ? dbItems : SAMPLE_MENU_ITEMS).map((item) => {
      const customPrice = priceMap[item.id];
      return {
        ...item,
        price: customPrice !== undefined ? Number(customPrice) : Number(item.price),
        hasCustomPrice: customPrice !== undefined && Number(customPrice) !== Number(item.price),
      };
    });

    return NextResponse.json({
      success: true,
      source: dbItems.length > 0 ? 'mongodb' : 'default_fallback',
      count: finalItems.length,
      items: finalItems,
      categories: MENU_CATEGORIES,
    });
  } catch (err) {
    console.error('MongoDB GET /api/menu error:', err);
    // Graceful fallback to static data if MongoDB is unreachable
    return NextResponse.json({
      success: true,
      source: 'local_fallback',
      count: SAMPLE_MENU_ITEMS.length,
      items: SAMPLE_MENU_ITEMS,
      categories: MENU_CATEGORIES,
    });
  }
}

// Optional manual seed / sync endpoint
export async function POST() {
  try {
    const menuCollection = await getMenuCollection();
    await menuCollection.createIndex({ id: 1 }, { unique: true });

    let upsertedCount = 0;
    for (const item of SAMPLE_MENU_ITEMS) {
      await menuCollection.updateOne(
        { id: item.id },
        { $set: { ...item, updatedAt: new Date() } },
        { upsert: true }
      );
      upsertedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${upsertedCount} menu items to MongoDB.`,
      count: upsertedCount,
    });
  } catch (err) {
    console.error('MongoDB POST /api/menu error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


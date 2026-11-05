import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { username, phone, email, password } = await request.json();
    const adminUser = (process.env.ADMIN_USER || '').trim().toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || '';

    const userIdentifier = (email || username || phone || '').trim().toLowerCase();

    if (!adminUser || !adminPass) {
      return NextResponse.json(
        { error: 'Admin credentials are not configured in environment variables.' },
        { status: 500 }
      );
    }

    if (userIdentifier === adminUser && password === adminPass) {
      return NextResponse.json({
        success: true,
        token: 'admin-jwt-session-' + Date.now(),
        user: {
          username: adminUser,
          role: 'admin',
          restaurant: "RJ's Multicuisine",
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password. Please try again.' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

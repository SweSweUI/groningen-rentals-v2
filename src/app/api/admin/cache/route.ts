import { NextResponse } from 'next/server';

// Force Node.js runtime for cache operations
export const runtime = 'nodejs';

// Simple in-memory cache for demo (in production, use Redis or database)
interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  agency: string;
  url: string;
  image?: string;
  rooms?: number;
  type?: string;
}

let propertyCache = {
  properties: [] as Property[],
  lastUpdated: ''
};

export async function GET() {
  try {
    return NextResponse.json(propertyCache);
  } catch (error) {
    console.error('❌ Cache GET error:', error);
    return NextResponse.json({ error: 'Failed to get cache' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { properties } = await request.json();

    propertyCache = {
      properties: properties || [],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Cache POST error:', error);
    return NextResponse.json({ error: 'Failed to update cache' }, { status: 500 });
  }
}

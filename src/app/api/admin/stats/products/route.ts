import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/connectDB';
import { getSession } from 'next-auth/react';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const total = await Product.countDocuments();
    const featured = await Product.countDocuments({ isFeatured: true });
    const sugarFree = await Product.countDocuments({ isSugarFree: true });

    return NextResponse.json({
      total,
      featured,
      sugarFree
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
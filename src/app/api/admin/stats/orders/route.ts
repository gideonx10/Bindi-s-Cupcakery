import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import connectDB from '@/lib/connectDB';
import { getSession } from 'next-auth/react';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'pending' });
    const shipped = await Order.countDocuments({ status: 'shipped' });
    const delivered = await Order.countDocuments({ status: 'delivered' });
    const cancelled = await Order.countDocuments({ status: 'cancelled' });

    return NextResponse.json({
      total,
      pending,
      shipped,
      delivered,
      cancelled
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
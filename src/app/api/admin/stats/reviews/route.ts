import { NextResponse } from 'next/server';
import Review from '@/models/Review';
import connectDB from '@/lib/connectDB';
import { getSession } from 'next-auth/react';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const total = await Review.countDocuments();
    const pending = await Review.countDocuments({ isApproved: false });
    const approved = await Review.countDocuments({ isApproved: true });

    return NextResponse.json({
      total,
      pending,
      approved
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
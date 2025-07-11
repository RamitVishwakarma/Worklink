import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase, checkDatabaseStatus } from '@/lib/db/seed';

export async function GET(request: NextRequest) {
  try {
    // Check current database status
    const status = await checkDatabaseStatus();

    if (!status) {
      return NextResponse.json(
        { error: 'Failed to check database status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Database status retrieved successfully',
      data: status,
    });
  } catch (error) {
    console.error('Error in GET /api/seed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if this is a development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database seeding is not allowed in production' },
        { status: 403 }
      );
    }

    console.log('🌱 API: Starting database seeding process...');

    // Run the seeding function
    const result = await seedDatabase();

    if (result.success) {
      return NextResponse.json({
        message: 'Database seeded successfully',
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to seed database',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/seed:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if this is a development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database clearing is not allowed in production' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');

    if (confirm !== 'true') {
      return NextResponse.json(
        { error: 'Must include ?confirm=true to clear database' },
        { status: 400 }
      );
    }

    console.log('🧹 API: Clearing database...');

    // Import models and clear data
    const dbConnect = (await import('@/lib/db/mongodb')).default;
    const Manufacturer = (await import('@/models/Manufacturer')).default;
    const Machine = (await import('@/models/Machine')).default;
    const Startup = (await import('@/models/Startup')).default;
    const Gig = (await import('@/models/Gig')).default;

    await dbConnect();

    const deleteResults = await Promise.all([
      Manufacturer.deleteMany({}),
      Machine.deleteMany({}),
      Startup.deleteMany({}),
      Gig.deleteMany({}),
    ]);

    const totalDeleted = deleteResults.reduce(
      (sum, result) => sum + result.deletedCount,
      0
    );

    return NextResponse.json({
      message: 'Database cleared successfully',
      deletedCount: totalDeleted,
      breakdown: {
        manufacturers: deleteResults[0].deletedCount,
        machines: deleteResults[1].deletedCount,
        startups: deleteResults[2].deletedCount,
        gigs: deleteResults[3].deletedCount,
      },
    });
  } catch (error) {
    console.error('Error in DELETE /api/seed:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

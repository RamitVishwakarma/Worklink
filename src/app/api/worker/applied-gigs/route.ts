import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongodb';
import { GigApplication } from '@/models/Application';
import Gig from '@/models/Gig'; // Import Gig model for population
import Startup from '@/models/Startup'; // Import Startup model for nested population
import {
  handleApiError,
  createSuccessResponse,
  AuthenticationError,
} from '@/middleware/errorHandler';
import { authenticateToken, extractTokenFromRequest } from '@/middleware/auth';
import {
  parseQueryParams,
  createPaginationInfo,
  buildSortQuery,
} from '@/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Ensure models are registered for population
    if (!mongoose.models.Gig) {
      require('@/models/Gig');
    }
    if (!mongoose.models.Startup) {
      require('@/models/Startup');
    }

    // Authenticate user
    const token = extractTokenFromRequest(request);
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const authResult = authenticateToken(token);
    if (!authResult.success) {
      throw new AuthenticationError(authResult.error);
    }

    if (authResult.user?.type !== 'worker') {
      throw new AuthenticationError('Invalid user type');
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, sort } = parseQueryParams(searchParams);
    const status = searchParams.get('status');

    // Build query
    const query: any = { workerId: authResult.user.id };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const sortQuery = buildSortQuery(sort);

    // Get total count
    const total = await GigApplication.countDocuments(query);

    // Get applications with pagination
    const applications = await GigApplication.find(query)
      .populate({
        path: 'gigId',
        select: 'title description salary location duration skillsRequired',
        populate: {
          path: 'startupId',
          select: 'companyName',
        },
      })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const pagination = createPaginationInfo(page, limit, total);

    return createSuccessResponse({
      Applications: applications,
      pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

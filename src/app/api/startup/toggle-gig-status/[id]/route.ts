import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Gig from '@/models/Gig';
import {
  handleApiError,
  createSuccessResponse,
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from '@/middleware/errorHandler';
import { authenticateToken, extractTokenFromRequest } from '@/middleware/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Resolve params
    const { id: gigId } = await params;

    // Authenticate user
    const token = extractTokenFromRequest(request);
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const authResult = authenticateToken(token);
    if (!authResult.success) {
      throw new AuthenticationError(authResult.error);
    }

    if (authResult.user?.type !== 'startup') {
      throw new AuthenticationError('Invalid user type');
    }

    if (!gigId) {
      throw new ValidationError('Gig ID is required');
    }

    // Find the gig by ID and owned by the startup
    const gig = await Gig.findOne({
      _id: gigId,
      startupId: authResult.user.id,
    });

    if (!gig) {
      throw new NotFoundError('Gig not found or you do not have access');
    }

    // Toggle the isActive status and update status accordingly
    gig.isActive = !gig.isActive;
    gig.status = gig.isActive ? 'active' : 'inactive';
    await gig.save();

    return createSuccessResponse(
      {
        gig,
      },
      `Gig ${gig.isActive ? 'activated' : 'deactivated'} successfully`,
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}

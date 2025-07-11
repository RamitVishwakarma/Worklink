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
import { validateSchema, gigUpdateSchema } from '@/middleware/validation';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
) {
  try {
    await dbConnect();

    // Resolve params
    const { gigId } = await params;

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

    // Get request body
    const body = await request.json();

    // Validate request body
    const validation = validateSchema(gigUpdateSchema, body);
    if (!validation.success) {
      throw new ValidationError(
        `Validation failed: ${validation.errors?.join(', ') || 'Invalid data'}`
      );
    }

    // Destructure validated data
    const {
      title,
      description,
      skillsRequired,
      location,
      jobType,
      duration,
      salary,
    } = validation.data;

    // Basic validation for required fields
    if (title !== undefined && !title.trim()) {
      throw new ValidationError('Title cannot be empty');
    }
    if (description !== undefined && !description.trim()) {
      throw new ValidationError('Description cannot be empty');
    }

    // Find the gig by ID and owned by the startup
    const existingGig = await Gig.findOne({
      _id: gigId,
      startupId: authResult.user.id,
    });

    if (!existingGig) {
      throw new NotFoundError('Gig not found or you do not have access');
    }

    // Update the gig
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      {
        title,
        description,
        skillsRequired: Array.isArray(skillsRequired)
          ? skillsRequired
          : skillsRequired?.split(',').map((skill: string) => skill.trim()) ||
            [],
        location,
        duration: duration || jobType, // Use duration if provided, fallback to jobType for backward compatibility
        salary: salary ? Number(salary) : undefined,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedGig) {
      throw new NotFoundError('Failed to update gig');
    }

    return createSuccessResponse(
      {
        Gig: updatedGig,
      },
      'Gig updated successfully',
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}

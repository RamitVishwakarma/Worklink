import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Startup from '@/models/Startup';
import {
  handleApiError,
  createSuccessResponse,
  AuthenticationError,
  NotFoundError,
} from '@/middleware/errorHandler';
import { validateSchema, startupUpdateSchema } from '@/middleware/validation';
import { authenticateToken, extractTokenFromRequest } from '@/middleware/auth';
import { sanitizeUser } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

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

    // Find startup
    const startup = await Startup.findById(authResult.user.id);
    if (!startup) {
      throw new NotFoundError('Startup not found');
    }

    const sanitizedStartup = sanitizeUser(startup, 'startup');

    return createSuccessResponse({
      StartUp: sanitizedStartup,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

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

    const body = await request.json();

    // Process incoming request body

    // Validate request body
    const validation = validateSchema(startupUpdateSchema, body);
    if (!validation.success) {
      return createSuccessResponse(
        { error: 'Validation failed', details: validation.errors },
        undefined,
        400
      );
    }

    // Update startup
    const startup = await Startup.findByIdAndUpdate(
      authResult.user.id,
      validation.data,
      { new: true, runValidators: true }
    );

    if (!startup) {
      throw new NotFoundError('Startup not found');
    }

    const sanitizedStartup = sanitizeUser(startup, 'startup');

    return createSuccessResponse({
      message: 'Profile updated successfully',
      StartUp: sanitizedStartup,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

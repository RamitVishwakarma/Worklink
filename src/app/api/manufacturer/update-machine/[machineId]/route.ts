import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Machine from '@/models/Machine';
import {
  handleApiError,
  createSuccessResponse,
  AuthenticationError,
  ValidationError,
} from '@/middleware/errorHandler';
import { authenticateToken, extractTokenFromRequest } from '@/middleware/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ machineId: string }> }
) {
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

    if (authResult.user?.type !== 'manufacturer') {
      throw new AuthenticationError('Invalid user type');
    }

    const { machineId } = await context.params;
    const body = await request.json();

    // Validate required fields
    const { name, type, description, location } = body;
    if (!name || !type || !description || !location) {
      throw new ValidationError('Missing required fields');
    }

    // Check if machine exists and belongs to the manufacturer
    const existingMachine = await Machine.findOne({
      _id: machineId,
      manufacturerId: authResult.user.id,
    });

    if (!existingMachine) {
      throw new ValidationError('Machine not found or unauthorized');
    }

    // Update machine
    const updatedMachine = await Machine.findByIdAndUpdate(
      machineId,
      {
        name,
        type,
        description,
        location,
        pricePerHour: body.pricePerHour || 0,
        specifications: body.specifications || '',
        available: body.available !== undefined ? body.available : true,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return createSuccessResponse({
      machine: updatedMachine,
      message: 'Machine updated successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

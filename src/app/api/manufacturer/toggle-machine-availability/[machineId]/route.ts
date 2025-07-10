import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Machine from '@/models/Machine';
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
  { params }: { params: Promise<{ machineId: string }> }
) {
  try {
    await dbConnect();

    // Resolve params
    const { machineId } = await params;

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

    if (!machineId) {
      throw new ValidationError('Machine ID is required');
    }

    // Find the machine by ID and owned by the manufacturer
    const machine = await Machine.findOne({
      _id: machineId,
      manufacturerId: authResult.user.id,
    });

    if (!machine) {
      throw new NotFoundError('Machine not found or you do not have access');
    }

    // Toggle the available status and update status accordingly
    machine.available = !machine.available;
    machine.status = machine.available ? 'active' : 'inactive';
    await machine.save();

    // Add some debug logging
    console.log(
      `Toggle machine availability success - machine: ${machineId}, available: ${machine.available}, status: ${machine.status}`
    );

    return createSuccessResponse(
      {
        machine,
      },
      `Machine ${machine.available ? 'activated' : 'deactivated'} successfully`,
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}

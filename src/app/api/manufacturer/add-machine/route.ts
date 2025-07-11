import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Machine from '@/models/Machine';
import {
  handleApiError,
  createSuccessResponse,
  AuthenticationError,
} from '@/middleware/errorHandler';
import { validateSchema, machineCreateSchema } from '@/middleware/validation';
import { authenticateToken, extractTokenFromRequest } from '@/middleware/auth';

export async function POST(request: NextRequest) {
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
      throw new AuthenticationError('Only manufacturers can add machines');
    }

    const body = await request.json();

    // Validate request body
    const validation = validateSchema(machineCreateSchema, body);
    if (!validation.success) {
      return createSuccessResponse(
        { error: 'Validation failed', details: validation.errors },
        undefined,
        400
      );
    }

    // Create new machine
    const machineData = {
      ...validation.data,
      manufacturerId: authResult.user.id,
    };

    // Parse specifications from string to object if provided
    if (
      machineData.specifications &&
      typeof machineData.specifications === 'string'
    ) {
      try {
        // If it's a JSON string, parse it
        machineData.specifications = JSON.parse(machineData.specifications);
      } catch {
        // If it's not JSON, store as plain text in an object
        machineData.specifications = {
          description: machineData.specifications,
        };
      }
    }

    const machine = new Machine(machineData);

    await machine.save();

    return createSuccessResponse(
      {
        message: 'Machine added successfully',
        Machine: machine,
      },
      undefined,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

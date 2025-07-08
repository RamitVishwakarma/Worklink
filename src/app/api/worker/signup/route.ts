import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Worker from '@/models/Worker';
import {
  handleApiError,
  createSuccessResponse,
  ConflictError,
} from '@/middleware/errorHandler';
import { validateSchema, workerSignupSchema } from '@/middleware/validation';
import { hashPassword, sanitizeUser } from '@/utils/helpers';
import { generateToken } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate request body
    const validation = validateSchema(workerSignupSchema, body);
    if (!validation.success) {
      return createSuccessResponse(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        },
        undefined,
        400
      );
    }

    const { name, email, password, skills, location } = validation.data;

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      throw new ConflictError('Worker already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new worker
    const worker = new Worker({
      name,
      email,
      password: hashedPassword,
      skills,
      ...(location && { location }), // Only include location if provided
    });

    await worker.save();

    // Generate JWT token
    const token = generateToken({
      id: worker._id.toString(),
      type: 'worker',
      email: worker.email,
    });

    // Return success response
    const sanitizedWorker = sanitizeUser(worker, 'worker');

    return createSuccessResponse(
      {
        token: `Bearer ${token}`,
        message: 'Worker SignUp successful',
        user: { ...sanitizedWorker, userType: 'worker' }, // Add userType field
      },
      undefined,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

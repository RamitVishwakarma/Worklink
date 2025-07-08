import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Startup from '@/models/Startup';
import {
  handleApiError,
  createSuccessResponse,
  ConflictError,
} from '@/middleware/errorHandler';
import { validateSchema, startupSignupSchema } from '@/middleware/validation';
import { hashPassword, sanitizeUser } from '@/utils/helpers';
import { generateToken } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate request body
    const validation = validateSchema(startupSignupSchema, body);
    if (!validation.success) {
      return createSuccessResponse(
        { error: 'Validation failed', details: validation.errors },
        undefined,
        400
      );
    }

    const { companyName, companyEmail, password, workSector, location } =
      validation.data;

    // Check if startup already exists
    const existingStartup = await Startup.findOne({ companyEmail });
    if (existingStartup) {
      throw new ConflictError('Startup already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new startup
    const startup = new Startup({
      companyName,
      companyEmail,
      password: hashedPassword,
      workSector,
      location,
    });

    await startup.save();

    // Generate JWT token
    const token = generateToken({
      id: startup._id.toString(),
      type: 'startup',
      email: startup.companyEmail,
    });

    // Return success response
    const sanitizedStartup = sanitizeUser(startup, 'startup');

    return createSuccessResponse(
      {
        token: `Bearer ${token}`,
        message: 'Startup SignUp successful',
        user: { ...sanitizedStartup, userType: 'startup' }, // Add userType field
      },
      undefined,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

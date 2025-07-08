import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Manufacturer from '@/models/Manufacturer';
import {
  handleApiError,
  createSuccessResponse,
  ConflictError,
} from '@/middleware/errorHandler';
import {
  validateSchema,
  manufacturerSignupSchema,
} from '@/middleware/validation';
import { hashPassword, sanitizeUser } from '@/utils/helpers';
import { generateToken } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate request body
    const validation = validateSchema(manufacturerSignupSchema, body);
    if (!validation.success) {
      return createSuccessResponse(
        { error: 'Validation failed', details: validation.errors },
        undefined,
        400
      );
    }

    const { companyName, companyEmail, password, workSector, location } =
      validation.data;

    // Check if manufacturer already exists
    const existingManufacturer = await Manufacturer.findOne({ companyEmail });
    if (existingManufacturer) {
      throw new ConflictError('Manufacturer already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new manufacturer
    const manufacturer = new Manufacturer({
      companyName,
      companyEmail,
      password: hashedPassword,
      workSector,
      location,
    });

    await manufacturer.save();

    // Generate JWT token
    const token = generateToken({
      id: manufacturer._id.toString(),
      type: 'manufacturer',
      email: manufacturer.companyEmail,
    });

    // Return success response
    const sanitizedManufacturer = sanitizeUser(manufacturer, 'manufacturer');

    return createSuccessResponse(
      {
        token: `Bearer ${token}`,
        message: 'Manufacturer SignUp successful',
        user: { ...sanitizedManufacturer, userType: 'manufacturer' }, // Add userType field
      },
      undefined,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

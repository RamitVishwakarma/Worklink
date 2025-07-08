import Joi from 'joi';

// Worker validation schemas
export const workerSignupSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  skills: Joi.array().items(Joi.string().trim()).min(1).required(),
  location: Joi.string().trim().optional().allow(null, ''),
  profilePicture: Joi.string().uri().optional().allow(null, ''),
});

export const workerSigninSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

export const workerUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),
  skills: Joi.array().items(Joi.string().trim()).min(1).optional(),
  location: Joi.string().trim().optional().allow(null, ''),
  profilePicture: Joi.string().uri().optional().allow(null, ''),
});

// Startup validation schemas
export const startupSignupSchema = Joi.object({
  companyName: Joi.string().required().trim(),
  companyEmail: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  workSector: Joi.string().required().trim(),
  location: Joi.string().required().trim(),
  profilePicture: Joi.string().uri().optional().allow(null, ''),
});

export const startupSigninSchema = Joi.object({
  companyEmail: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

export const startupUpdateSchema = Joi.object({
  companyName: Joi.string().trim().optional(),
  workSector: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  profilePicture: Joi.string().uri().optional().allow(null, ''),
});

// Manufacturer validation schemas
export const manufacturerSignupSchema = Joi.object({
  companyName: Joi.string().required().trim(),
  companyEmail: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  workSector: Joi.string().required().trim(),
  location: Joi.string().required().trim(),
  profilePicture: Joi.string().uri().optional().allow(null, ''),
});

export const manufacturerSigninSchema = Joi.object({
  companyEmail: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

export const manufacturerUpdateSchema = Joi.object({
  companyName: Joi.string().trim().optional(),
  workSector: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  profilePicture: Joi.string().uri().optional().allow(null, ''),
});

// Gig validation schemas
export const gigCreateSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  skillsRequired: Joi.array().items(Joi.string().trim()).min(1).required(),
  location: Joi.string().required().trim(),
  salary: Joi.number().positive().required(),
  duration: Joi.string().required().trim(),
});

export const gigUpdateSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  skillsRequired: Joi.array().items(Joi.string().trim()).min(1).optional(),
  location: Joi.string().trim().optional(),
  salary: Joi.number().positive().optional(),
  duration: Joi.string().trim().optional(),
});

// Machine validation schemas
export const machineCreateSchema = Joi.object({
  name: Joi.string().required().trim(),
  type: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  location: Joi.string().required().trim(),
  available: Joi.boolean().optional(),
});

export const machineUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),
  type: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  available: Joi.boolean().optional(),
});

// Application validation schemas
export const applicationCreateSchema = Joi.object({
  message: Joi.string().trim().optional().allow(''),
});

export const applicationUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required(),
});

// Validation helper function
export function validateSchema(schema: Joi.ObjectSchema, data: any) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorDetails = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return {
      success: false,
      errors: errorDetails,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: value,
  };
}

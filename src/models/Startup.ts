import mongoose, { Document, Schema } from 'mongoose';

// Startup interface
export interface IStartup extends Document {
  companyName: string;
  companyEmail: string;
  password: string;
  workSector: string;
  location: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Startup schema
const StartupSchema = new Schema<IStartup>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyEmail: {
      type: String,
      required: [true, 'Company email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    workSector: {
      type: String,
      required: [true, 'Work sector is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

StartupSchema.index({ location: 1 });
StartupSchema.index({ workSector: 1 });

export default mongoose.models.Startup ||
  mongoose.model<IStartup>('Startup', StartupSchema);

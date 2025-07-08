import mongoose, { Document, Schema } from 'mongoose';

// Manufacturer interface
export interface IManufacturer extends Document {
  companyName: string;
  companyEmail: string;
  password: string;
  workSector: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

// Manufacturer schema
const ManufacturerSchema = new Schema<IManufacturer>(
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
  },
  {
    timestamps: true,
  }
);

ManufacturerSchema.index({ location: 1 });
ManufacturerSchema.index({ workSector: 1 });

export default mongoose.models.Manufacturer ||
  mongoose.model<IManufacturer>('Manufacturer', ManufacturerSchema);

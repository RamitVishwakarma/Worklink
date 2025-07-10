import mongoose, { Document, Schema } from 'mongoose';

// Machine interface
export interface IMachine extends Document {
  name: string;
  type: string;
  description: string;
  location: string;
  available: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  manufacturerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Machine schema
const MachineSchema = new Schema<IMachine>(
  {
    name: {
      type: String,
      required: [true, 'Machine name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Machine type is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
    manufacturerId: {
      type: Schema.Types.ObjectId,
      ref: 'Manufacturer',
      required: [true, 'Manufacturer ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
MachineSchema.index({ manufacturerId: 1 });
MachineSchema.index({ type: 1 });
MachineSchema.index({ available: 1 });
MachineSchema.index({ status: 1 });
MachineSchema.index({ location: 1 });
MachineSchema.index({ createdAt: -1 });

export default mongoose.models.Machine ||
  mongoose.model<IMachine>('Machine', MachineSchema);

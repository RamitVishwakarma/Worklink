import mongoose, { Document, Schema } from 'mongoose';

// Worker interface
export interface IWorker extends Document {
  name: string;
  email: string;
  password: string;
  skills: string[];
  location?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Worker schema
const WorkerSchema = new Schema<IWorker>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    skills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: false,
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

WorkerSchema.index({ location: 1 });
WorkerSchema.index({ skills: 1 });

export default mongoose.models.Worker ||
  mongoose.model<IWorker>('Worker', WorkerSchema);

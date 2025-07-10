export enum UserType {
  WORKER = 'worker',
  STARTUP = 'startup',
  MANUFACTURER = 'manufacturer',
}

export interface User {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  companyName?: string;
  role?: string; // For compatibility
  // Add other common user properties if any
}

// You can also define specific user types if they have different properties
export interface Worker extends User {
  // Worker specific properties
  skills?: string[];
  experience?: number; // years
}

export interface Startup extends User {
  // Startup specific properties
  companyName?: string;
  industry?: string;
}

export interface Manufacturer extends User {
  // Manufacturer specific properties
  factoryName?: string;
  location?: string;
}

// Gig related types
export interface Gig {
  _id: string;
  id: string; // For compatibility
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  jobType: 'full-time' | 'part-time' | 'contract';
  requiredSkills: string[];
  postedBy: string; // startup ID
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'closed';
  isActive: boolean;
  applicationCount?: number; // Count of applications
}

export interface GigsResponse {
  Gigs: Gig[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GigApplication {
  _id: string;
  id: string; // For compatibility
  gigId: string;
  workerId: string;
  workerName?: string; // Worker name for display
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  gig?: Gig; // Populated gig details
}

// Machine related types
export interface Machine {
  _id: string;
  id: string; // For compatibility
  name: string;
  type: string;
  description: string;
  manufacturer: string; // manufacturer ID
  location: string;
  specifications: Record<string, any>;
  pricePerHour?: number;
  available: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  isAvailable?: boolean; // For compatibility (same as available)
  createdAt: string;
  updatedAt: string;
  hasApplied?: boolean; // Whether the current user has applied
}

export interface MachineApplication {
  _id: string;
  id: string; // For compatibility
  machineId: string;
  applicantId: string;
  applicantType: 'worker' | 'startup';
  status: 'pending' | 'approved' | 'rejected';
  requestedStartDate?: string;
  requestedEndDate?: string;
  appliedAt: string;
  machine?: Machine; // Populated machine details
}

// Profile related types
export interface WorkerProfile {
  _id: string;
  email: string;
  name: string;
  skills: string[];
  experience: string;
  location: string;
  phone?: string;
  bio?: string;
  portfolio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartupProfile {
  _id: string;
  email: string;
  companyName: string;
  description: string;
  location: string;
  address?: string;
  industry: string;
  website?: string;
  phone?: string;
  foundedYear?: number;
  createdAt: string;
  updatedAt: string;
  // Statistics
  totalGigsPosted?: number;
  activeGigs?: number;
  totalApplications?: number;
  memberSince?: string;
}

export interface ManufacturerProfile {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  contactEmail: string;
  memberSince: string | number | Date;
  _id: string;
  email: string;
  companyName: string;
  description: string;
  location: string;
  industry: string;
  website?: string;
  phone?: string;
  establishedYear?: number;
  createdAt: string;
  updatedAt: string;
  activeMachines?: number;
  totalMachines?: number;
}

// API Response types
export interface AuthResponse {
  token: string;
  user: User;
}

// You can add more specific response types as needed
// e.g., for fetching gigs, machines, profiles, etc.

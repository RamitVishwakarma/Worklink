'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Create enhanced axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Check if window is defined (client side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log API requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }
    return response;
  },
  (error: AxiosError) => {
    const { response, request, config } = error;

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`,
        error
      );
    }

    // Handle different types of errors
    if (response) {
      // Server responded with error status
      const status = response.status;
      const data = response.data as any;

      switch (status) {
        case 400:
          // Bad Request - show validation errors
          if (data?.message) {
            toast({
              title: 'Validation Error',
              description: data.message,
              variant: 'destructive',
            });
          }
          break;

        case 401:
          // Unauthorized - redirect to login
          toast({
            title: 'Authentication Required',
            description: 'Please log in to continue.',
            variant: 'destructive',
          });

          // Clear auth data and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
          }
          break;

        case 403:
          // Forbidden - insufficient permissions
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to perform this action.',
            variant: 'destructive',
          });
          break;

        case 404:
          // Not Found
          toast({
            title: 'Not Found',
            description:
              data?.message || 'The requested resource was not found.',
            variant: 'destructive',
          });
          break;

        case 409:
          // Conflict (e.g., duplicate email)
          toast({
            title: 'Conflict',
            description: data?.message || 'A conflict occurred.',
            variant: 'destructive',
          });
          break;

        case 429:
          // Too Many Requests
          toast({
            title: 'Rate Limited',
            description: 'Too many requests. Please try again later.',
            variant: 'destructive',
          });
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast({
            title: 'Server Error',
            description:
              'An unexpected error occurred. Please try again later.',
            variant: 'destructive',
          });
          break;

        default:
          // Generic error
          toast({
            title: 'Error',
            description: data?.message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
      }
    } else if (request) {
      // Network error - no response received
      toast({
        title: 'Network Error',
        description:
          'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
      });
    } else {
      // Something else happened
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

// Enhanced API caller functions with success toasts and loading states
interface ApiCallOptions {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  skipGlobalErrorHandling?: boolean;
}

// Generic API callers with automatic error handling
export const apiGet = async <T = any>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response = await api.get<T>(url);

    if (options.showSuccessToast && options.successMessage) {
      toast({
        title: 'Success',
        description: options.successMessage,
      });
    }

    return response.data;
  } catch (error) {
    if (!options.skipGlobalErrorHandling) {
      // Global error handling is already done in the interceptor
    }
    throw error;
  }
};

export const apiPost = async <T = any, D = any>(
  url: string,
  data?: D,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);

    if (options.showSuccessToast && options.successMessage) {
      toast({
        title: 'Success',
        description: options.successMessage,
      });
    }

    return response.data;
  } catch (error) {
    if (!options.skipGlobalErrorHandling) {
      // Global error handling is already done in the interceptor
    }
    throw error;
  }
};

export const apiPut = async <T = any, D = any>(
  url: string,
  data?: D,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response = await api.put<T>(url, data);

    if (options.showSuccessToast && options.successMessage) {
      toast({
        title: 'Success',
        description: options.successMessage,
      });
    }

    return response.data;
  } catch (error) {
    if (!options.skipGlobalErrorHandling) {
      // Global error handling is already done in the interceptor
    }
    throw error;
  }
};

export const apiPatch = async <T = any, D = any>(
  url: string,
  data?: D,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response = await api.patch<T>(url, data);

    if (options.showSuccessToast && options.successMessage) {
      toast({
        title: 'Success',
        description: options.successMessage,
      });
    }

    return response.data;
  } catch (error) {
    if (!options.skipGlobalErrorHandling) {
      // Global error handling is already done in the interceptor
    }
    throw error;
  }
};

export const apiDelete = async <T = any>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response = await api.delete<T>(url);

    if (options.showSuccessToast && options.successMessage) {
      toast({
        title: 'Success',
        description: options.successMessage,
      });
    }

    return response.data;
  } catch (error) {
    if (!options.skipGlobalErrorHandling) {
      // Global error handling is already done in the interceptor
    }
    throw error;
  }
};

export default api;

// ==================================================
// ENHANCED API ENDPOINTS WITH TYPE SAFETY
// ==================================================

import type {
  User,
  AuthResponse,
  Gig,
  GigApplication,
  Machine,
  MachineApplication,
  WorkerProfile,
  StartupProfile,
  ManufacturerProfile,
} from './types';

// Auth endpoints
export const authAPI = {
  // Worker authentication
  workerSignup: (userData: any): Promise<AuthResponse> =>
    apiPost('/worker/signup', userData, {
      showSuccessToast: true,
      successMessage: 'Worker account created successfully!',
    }),

  workerSignin: (credentials: any): Promise<AuthResponse> =>
    apiPost('/worker/signin', credentials, {
      showSuccessToast: true,
      successMessage: 'Welcome back!',
    }),

  // Startup authentication
  startupSignup: (userData: any): Promise<AuthResponse> =>
    apiPost('/startup/signup', userData, {
      showSuccessToast: true,
      successMessage: 'Startup account created successfully!',
    }),

  startupSignin: (credentials: any): Promise<AuthResponse> =>
    apiPost('/startup/signin', credentials, {
      showSuccessToast: true,
      successMessage: 'Welcome back!',
    }),

  // Manufacturer authentication
  manufacturerSignup: (userData: any): Promise<AuthResponse> =>
    apiPost('/manufacturer/signup', userData, {
      showSuccessToast: true,
      successMessage: 'Manufacturer account created successfully!',
    }),

  manufacturerSignin: (credentials: any): Promise<AuthResponse> =>
    apiPost('/manufacturer/signin', credentials, {
      showSuccessToast: true,
      successMessage: 'Welcome back!',
    }),
};

// Worker endpoints
export const workerAPI = {
  getProfile: (): Promise<WorkerProfile> => apiGet('/worker/profile'),

  updateProfile: (
    profileData: Partial<WorkerProfile>
  ): Promise<WorkerProfile> =>
    apiPut('/worker/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
    }),

  getAppliedGigs: (): Promise<GigApplication[]> =>
    apiGet('/worker/applied-gigs'),

  applyToGig: (gigId: string, applicationData: any): Promise<GigApplication> =>
    apiPost(`/worker/apply-gig/${gigId}`, applicationData, {
      showSuccessToast: true,
      successMessage: 'Successfully applied for the gig!',
    }),

  applyToMachine: (
    machineId: string,
    applicationData: any
  ): Promise<MachineApplication> =>
    apiPost(`/worker/apply-machine/${machineId}`, applicationData, {
      showSuccessToast: true,
      successMessage: 'Successfully applied to use the machine!',
    }),
};

// Startup endpoints
export const startupAPI = {
  getProfile: (): Promise<StartupProfile> => apiGet('/startup/profile'),

  updateProfile: (
    profileData: Partial<StartupProfile>
  ): Promise<StartupProfile> =>
    apiPut('/startup/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
    }),

  createGig: (gigData: any): Promise<Gig> =>
    apiPost('/startup/create-gig', gigData, {
      showSuccessToast: true,
      successMessage: 'Gig posted successfully!',
    }),

  getGigs: (): Promise<Gig[]> => apiGet('/startup/your-gigs'),

  deleteGig: (gigId: string): Promise<void> =>
    apiDelete(`/startup/delete-gig/${gigId}`, {
      showSuccessToast: true,
      successMessage: 'Gig deleted successfully',
    }),

  applyToMachine: (
    machineId: string,
    applicationData: any
  ): Promise<MachineApplication> =>
    apiPost(`/startup/apply-machine/${machineId}`, applicationData, {
      showSuccessToast: true,
      successMessage: 'Successfully applied to use the machine!',
    }),
};

// Manufacturer endpoints
export const manufacturerAPI = {
  getProfile: (): Promise<ManufacturerProfile> =>
    apiGet('/manufacturer/profile'),

  updateProfile: (
    profileData: Partial<ManufacturerProfile>
  ): Promise<ManufacturerProfile> =>
    apiPut('/manufacturer/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
    }),

  addMachine: (machineData: any): Promise<Machine> =>
    apiPost('/manufacturer/add-machine', machineData, {
      showSuccessToast: true,
      successMessage: 'Machine added successfully!',
    }),

  getMachines: (): Promise<Machine[]> => apiGet('/manufacturer/your-machines'),

  deleteMachine: (machineId: string): Promise<void> =>
    apiDelete(`/manufacturer/delete-machine/${machineId}`, {
      showSuccessToast: true,
      successMessage: 'Machine deleted successfully',
    }),

  toggleMachineAvailability: (
    machineId: string,
    available: boolean
  ): Promise<Machine> =>
    apiPatch(
      `/manufacturer/delete-machine/${machineId}`,
      { available },
      {
        showSuccessToast: true,
        successMessage: `Machine ${available ? 'enabled' : 'disabled'} successfully`,
      }
    ),

  getMachineApplications: (): Promise<MachineApplication[]> =>
    apiGet('/manufacturer/applications'),

  updateApplicationStatus: (
    applicationId: string,
    status: 'approved' | 'rejected'
  ): Promise<MachineApplication> =>
    apiPatch(
      `/manufacturer/approve-reject-application/${applicationId}`,
      { status },
      {
        showSuccessToast: true,
        successMessage: `Application ${status} successfully`,
      }
    ),
};

// General/Public endpoints
export const publicAPI = {
  getAllGigs: (params?: any): Promise<Gig[]> =>
    apiGet('/public/gigs', { ...params }),

  getAllMachines: (params?: any): Promise<Machine[]> =>
    apiGet('/public/machines', { ...params }),
};

// ==================================================
// LEGACY API FUNCTIONS (for backward compatibility)
// ==================================================

// Worker specific
export const getWorkerProfile = () => workerAPI.getProfile();
export const updateWorkerProfile = (profileData: any) =>
  workerAPI.updateProfile(profileData);
export const applyToGig = (gigId: string, applicationData: any) =>
  workerAPI.applyToGig(gigId, applicationData);
export const getAppliedGigsForWorker = () => workerAPI.getAppliedGigs();
export const applyToMachineByWorker = (
  machineId: string,
  applicationData: any
) => workerAPI.applyToMachine(machineId, applicationData);

// Startup specific
export const getStartupProfile = () => startupAPI.getProfile();
export const updateStartupProfile = (profileData: any) =>
  startupAPI.updateProfile(profileData);
export const createGig = (gigData: any) => startupAPI.createGig(gigData);
export const getGigsByStartup = () => startupAPI.getGigs();
export const deleteGig = (gigId: string) => startupAPI.deleteGig(gigId);
export const applyToMachineByStartup = (
  machineId: string,
  applicationData: any
) => startupAPI.applyToMachine(machineId, applicationData);

// Manufacturer specific
export const getManufacturerProfile = () => manufacturerAPI.getProfile();
export const updateManufacturerProfile = (profileData: any) =>
  manufacturerAPI.updateProfile(profileData);
export const addMachine = (machineData: any) =>
  manufacturerAPI.addMachine(machineData);
export const getMachinesByManufacturer = () => manufacturerAPI.getMachines();
export const deleteMachine = (machineId: string) =>
  manufacturerAPI.deleteMachine(machineId);
export const toggleMachineAvailability = (
  machineId: string,
  available: boolean
) => manufacturerAPI.toggleMachineAvailability(machineId, available);
export const getMachineApplications = () =>
  manufacturerAPI.getMachineApplications();
export const approveOrRejectApplication = (
  applicationId: string,
  status: 'approved' | 'rejected'
) => manufacturerAPI.updateApplicationStatus(applicationId, status);

// General/Public
export const getAllGigs = (params?: any) => publicAPI.getAllGigs(params);
export const getAllMachines = (params?: any) =>
  publicAPI.getAllMachines(params);

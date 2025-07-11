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
      // Get token from auth storage (Zustand persist storage)
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          const token = authData?.state?.token;
          if (token) {
            // Remove 'Bearer ' prefix if it exists to avoid double prefix
            const cleanToken = token.replace('Bearer ', '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
          }
        } catch (error) {
          console.error('Error parsing auth storage:', error);
          // Clear corrupted auth data
          localStorage.removeItem('auth-storage');
        }
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
          // Unauthorized - clear auth and redirect to login
          toast({
            title: 'Session Expired',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });

          // Clear auth data and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            // Force a page reload to clear all state
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
  GigsResponse,
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
  getProfile: async (): Promise<WorkerProfile> => {
    const response = await apiGet('/worker/profile');
    // Extract the worker data from the response
    return response.Worker || response;
  },

  updateProfile: async (
    profileData: Partial<WorkerProfile>
  ): Promise<WorkerProfile> => {
    const response = await apiPut('/worker/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
    });
    // Extract the worker data from the response
    return response.Worker || response;
  },

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
  getProfile: async (): Promise<StartupProfile> => {
    const response = await apiGet('/startup/profile');
    // Extract the startup data from the response, handling various response formats
    const profileData = response.Startup || response.startup || response;

    // Handle potential field name discrepancies
    if ((profileData as any).workSector && !profileData.industry) {
      profileData.industry = (profileData as any).workSector;
    }

    // Handle email field name mapping
    if ((profileData as any).companyEmail && !profileData.email) {
      profileData.email = (profileData as any).companyEmail;
    }

    // Ensure foundedYear is handled properly
    if ((profileData as any).foundedYear !== undefined) {
      profileData.foundedYear = Number((profileData as any).foundedYear);
    }

    return profileData;
  },

  updateProfile: async (
    profileData: Partial<StartupProfile>
  ): Promise<StartupProfile> => {
    // Handle field name mappings if necessary
    const dataToSend = { ...profileData };

    // If the API expects workSector instead of industry, map it
    if (dataToSend.industry) {
      (dataToSend as any).workSector = dataToSend.industry;
    }

    // If the API expects companyEmail instead of email, map it
    if (dataToSend.email) {
      (dataToSend as any).companyEmail = dataToSend.email;
    }

    // Ensure foundedYear is a number if it exists, or remove it if undefined/null
    if (
      dataToSend.foundedYear !== undefined &&
      dataToSend.foundedYear !== null
    ) {
      (dataToSend as any).foundedYear = Number(dataToSend.foundedYear);
    } else if (
      dataToSend.foundedYear === null ||
      dataToSend.foundedYear === ''
    ) {
      // Remove the foundedYear property entirely if it's null or empty string
      delete dataToSend.foundedYear;
    }

    const response = await apiPut('/startup/profile', dataToSend, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
    });

    // Extract the startup data from the response, handling various response formats
    const updatedProfile = response.Startup || response.startup || response;

    // Ensure consistent field names in the response
    if (updatedProfile.workSector && !updatedProfile.industry) {
      updatedProfile.industry = updatedProfile.workSector;
    }

    // Map companyEmail to email if needed
    if ((updatedProfile as any).companyEmail && !updatedProfile.email) {
      updatedProfile.email = (updatedProfile as any).companyEmail;
    }

    // Ensure foundedYear is properly handled in the response
    if ((updatedProfile as any).foundedYear !== undefined) {
      updatedProfile.foundedYear = Number((updatedProfile as any).foundedYear);
    }

    return updatedProfile;
  },

  createGig: (gigData: any): Promise<Gig> =>
    apiPost('/startup/create-gig', gigData, {
      showSuccessToast: true,
      successMessage: 'Gig posted successfully!',
    }),

  getGigs: (): Promise<Gig[]> => apiGet('/startup/your-gigs'),

  updateGig: (gigId: string, gigData: any): Promise<Gig> =>
    apiPut(`/startup/update-gig/${gigId}`, gigData, {
      showSuccessToast: true,
      successMessage: 'Gig updated successfully!',
    }),

  deleteGig: (gigId: string): Promise<void> =>
    apiDelete(`/startup/delete-gig/${gigId}`, {
      showSuccessToast: true,
      successMessage: 'Gig deleted successfully',
    }),

  toggleGigStatus: (gigId: string, currentStatus: boolean): Promise<Gig> =>
    apiPatch(
      `/startup/toggle-gig-status/${gigId}`,
      {},
      {
        showSuccessToast: true,
        successMessage: `Gig ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      }
    ),

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
  getProfile: async (): Promise<ManufacturerProfile> => {
    const response = await apiGet('/manufacturer/profile');
    // Extract the manufacturer data from the response
    return response.Manufacturer || response;
  },

  updateProfile: async (
    profileData: Partial<ManufacturerProfile>
  ): Promise<ManufacturerProfile> => {
    const response = await apiPut('/manufacturer/profile', profileData, {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
    });
    // Extract the manufacturer data from the response
    return response.Manufacturer || response;
  },

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
    apiGet('/manufacturer/applications').then((response: any) =>
      Array.isArray(response) ? response : response.Applications || []
    ),

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
  getAllGigs: (params?: any): Promise<GigsResponse> =>
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

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { publicAPI, manufacturerAPI, workerAPI, startupAPI } from '../api';
import type { Machine, MachineApplication } from '../types';

export interface MachinesState {
  // Data
  machines: Machine[];
  userMachines: Machine[]; // For manufacturers - machines they own
  applications: MachineApplication[]; // Applications for machines
  currentMachine: Machine | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isApplying: boolean;
  isDeleting: boolean;
  isUpdating: boolean;

  // Error states
  error: string | null;
  fetchError: string | null;

  // Filters and search
  searchTerm: string;
  locationFilter: string;
  typeFilter: string;
  availabilityFilter: string;

  // Actions
  fetchMachines: (params?: any) => Promise<void>;
  fetchUserMachines: () => Promise<void>; // No manufacturerId needed - uses JWT
  fetchApplications: () => Promise<void>; // No manufacturerId/machineId needed - uses JWT
  addMachine: (machineData: any) => Promise<void>;
  deleteMachine: (machineId: string) => Promise<void>;
  toggleMachineAvailability: (
    machineId: string,
    availability: boolean
  ) => Promise<void>;
  applyToMachine: (machineId: string, applicationData?: any) => Promise<void>; // No applicantId/type needed - uses JWT
  updateApplicationStatus: (
    applicationId: string,
    status: 'approved' | 'rejected'
  ) => Promise<void>;

  // Utility actions
  setSearchTerm: (term: string) => void;
  setLocationFilter: (location: string) => void;
  setTypeFilter: (type: string) => void;
  setAvailabilityFilter: (availability: string) => void;
  clearFilters: () => void;
  clearError: () => void;
  clearFetchError: () => void;
  reset: () => void;
}

const initialState = {
  machines: [],
  userMachines: [],
  applications: [],
  currentMachine: null,
  isLoading: false,
  isCreating: false,
  isApplying: false,
  isDeleting: false,
  isUpdating: false,
  error: null,
  fetchError: null,
  searchTerm: '',
  locationFilter: '',
  typeFilter: '',
  availabilityFilter: '',
};

export const useMachinesStore = create<MachinesState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchMachines: async (params) => {
        set({ isLoading: true, fetchError: null });
        try {
          const response = await publicAPI.getAllMachines(params);
          // Ensure machines is always an array, even if API returns null/undefined
          const machines = Array.isArray(response) ? response : [];
          set({ machines, isLoading: false, fetchError: null });
        } catch (error: any) {
          console.error('Failed to fetch machines:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch machines';
          set({
            isLoading: false,
            machines: [], // Reset to empty array on error
            fetchError: errorMessage,
            error: errorMessage,
          });
        }
      },

      fetchUserMachines: async () => {
        set({ isLoading: true, fetchError: null });
        try {
          const userMachines = await manufacturerAPI.getMachines();
          set({ userMachines, isLoading: false, fetchError: null });
        } catch (error: any) {
          console.error('Failed to fetch user machines:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch user machines';
          set({
            isLoading: false,
            fetchError: errorMessage,
            error: errorMessage,
          });
        }
      },

      fetchApplications: async () => {
        set({ isLoading: true, fetchError: null });
        try {
          const applications = await manufacturerAPI.getMachineApplications();
          set({ applications, isLoading: false, fetchError: null });
        } catch (error: any) {
          console.error('Failed to fetch applications:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch applications';
          set({
            isLoading: false,
            fetchError: errorMessage,
            error: errorMessage,
          });
        }
      },

      addMachine: async (machineData: any) => {
        set({ isCreating: true, error: null });
        try {
          const newMachine = await manufacturerAPI.addMachine(machineData);
          const { userMachines } = get();
          set({
            userMachines: [newMachine, ...userMachines],
            isCreating: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Failed to add machine:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to add machine';
          set({
            isCreating: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      deleteMachine: async (machineId: string) => {
        set({ isDeleting: true, error: null });
        try {
          await manufacturerAPI.deleteMachine(machineId);
          const { userMachines, machines } = get();
          set({
            userMachines: userMachines.filter(
              (machine) => machine._id !== machineId
            ),
            machines: machines.filter((machine) => machine._id !== machineId),
            isDeleting: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Failed to delete machine:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to delete machine';
          set({
            isDeleting: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      toggleMachineAvailability: async (
        machineId: string,
        availability: boolean
      ) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedMachine =
            await manufacturerAPI.toggleMachineAvailability(
              machineId,
              availability
            );
          const { userMachines, machines } = get();

          const updateMachine = (machine: Machine): Machine =>
            machine._id === machineId
              ? {
                  ...machine,
                  available: availability,
                  isAvailable: availability,
                  status: (availability ? 'active' : 'inactive') as
                    | 'active'
                    | 'inactive'
                    | 'maintenance',
                }
              : machine;

          set({
            userMachines: userMachines.map(updateMachine),
            machines: machines.map(updateMachine),
            isUpdating: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Failed to toggle machine availability:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to toggle machine availability';
          set({
            isUpdating: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      applyToMachine: async (machineId: string, applicationData = {}) => {
        set({ isApplying: true, error: null });
        try {
          // Get user type from localStorage or pass as parameter
          const userDataStr = localStorage.getItem('auth-storage');
          let userType = 'worker'; // default fallback

          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              userType = userData?.state?.user?.userType || 'worker';
            } catch (e) {
              console.warn('Failed to parse user data from localStorage');
            }
          }

          // The API will determine if this is a worker or startup based on JWT
          let application: MachineApplication;

          if (userType === 'worker') {
            application = await workerAPI.applyToMachine(
              machineId,
              applicationData
            );
          } else if (userType === 'startup') {
            application = await startupAPI.applyToMachine(
              machineId,
              applicationData
            );
          } else {
            throw new Error('Invalid user type for machine application');
          }

          // Update local state to show machine as applied
          const { machines } = get();
          const updatedMachines = machines.map((machine) =>
            machine._id === machineId
              ? { ...machine, hasApplied: true }
              : machine
          );

          set({
            machines: updatedMachines,
            isApplying: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Failed to apply to machine:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to apply to machine';
          set({
            isApplying: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateApplicationStatus: async (
        applicationId: string,
        status: 'approved' | 'rejected'
      ) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedApplication =
            await manufacturerAPI.updateApplicationStatus(
              applicationId,
              status
            );
          const { applications } = get();
          set({
            applications: applications.map((app) =>
              app._id === applicationId ? { ...app, status } : app
            ),
            isUpdating: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Failed to update application status:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to update application status';
          set({
            isUpdating: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setLocationFilter: (location: string) =>
        set({ locationFilter: location }),
      setTypeFilter: (type: string) => set({ typeFilter: type }),
      setAvailabilityFilter: (availability: string) =>
        set({ availabilityFilter: availability }),

      clearFilters: () =>
        set({
          searchTerm: '',
          locationFilter: '',
          typeFilter: '',
          availabilityFilter: '',
        }),

      clearError: () => set({ error: null }),
      clearFetchError: () => set({ fetchError: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'machines-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist filters and search term, not the actual data
        searchTerm: state.searchTerm,
        locationFilter: state.locationFilter,
        typeFilter: state.typeFilter,
        availabilityFilter: state.availabilityFilter,
      }),
    }
  )
);

// Stats selector - defined outside of hook to prevent recreation
const machineStatsSelector = (state: MachinesState) => {
  const { userMachines = [], applications = [] } = state;

  // Ensure we have arrays to work with
  const safeMachines = Array.isArray(userMachines) ? userMachines : [];
  const safeApplications = Array.isArray(applications) ? applications : [];

  return {
    total: safeMachines.length,
    active: safeMachines.filter(
      (machine) => machine.available || machine.isAvailable
    ).length,
    inactive: safeMachines.filter(
      (machine) => !(machine.available || machine.isAvailable)
    ).length,
    totalApplications: safeApplications.length,
    pendingApplications: safeApplications.filter(
      (app) => app.status === 'pending'
    ).length,
    approvedApplications: safeApplications.filter(
      (app) => app.status === 'approved'
    ).length,
    rejectedApplications: safeApplications.filter(
      (app) => app.status === 'rejected'
    ).length,
  };
};

// Stats hook for machines with shallow comparison
export const useMachineStats = () => {
  return useMachinesStore(useShallow(machineStatsSelector));
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { workerAPI, startupAPI, manufacturerAPI } from '../api';
import type { MachineApplication, GigApplication } from '../types';
import { useAuthStore } from './authStore';

export interface ApplicationsState {
  // Machine Applications
  machineApplications: MachineApplication[];
  machineApplicationsLoading: boolean;
  machineApplicationsError: string | null;

  // Gig Applications
  gigApplications: GigApplication[];
  gigApplicationsLoading: boolean;
  gigApplicationsError: string | null;

  // Filters (persisted)
  filters: {
    status: string;
    type: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };

  // Actions
  applyToMachine: (machineId: string, message?: string) => Promise<boolean>;
  applyToGig: (gigId: string, message?: string) => Promise<boolean>;
  updateApplicationStatus: (
    applicationId: string,
    status: 'approved' | 'rejected',
    type: 'machine' | 'gig'
  ) => Promise<boolean>;
  fetchApplications: () => Promise<void>; // New method to fetch all applications for current user
  clearError: () => void;
  setFilters: (filters: Partial<ApplicationsState['filters']>) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  status: 'all',
  type: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
};

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      // Initial state
      machineApplications: [],
      machineApplicationsLoading: false,
      machineApplicationsError: null,

      gigApplications: [],
      gigApplicationsLoading: false,
      gigApplicationsError: null,

      filters: defaultFilters,

      // Actions
      applyToMachine: async (machineId: string, message?: string) => {
        try {
          const { user } = useAuthStore.getState();
          const userType = user?.userType;

          if (!user || !userType) {
            throw new Error('User not authenticated');
          }

          if (userType === 'worker') {
            await workerAPI.applyToMachine(machineId, { message });
          } else if (userType === 'startup') {
            await startupAPI.applyToMachine(machineId, { message });
          } else {
            throw new Error('Invalid user type for machine application');
          }
          return true;
        } catch (error) {
          console.error('Failed to apply to machine:', error);
          return false;
        }
      },

      applyToGig: async (gigId: string, message?: string) => {
        try {
          await workerAPI.applyToGig(gigId, { message });
          return true;
        } catch (error) {
          console.error('Failed to apply to gig:', error);
          return false;
        }
      },

      fetchApplications: async () => {
        const { user } = useAuthStore.getState();
        const userType = user?.userType;

        if (!user || !userType) {
          console.error('User not authenticated');
          return;
        }

        try {
          if (userType === 'worker') {
            // For workers, fetch their applied gigs - no separate machine applications endpoint
            set({ gigApplicationsLoading: true });
            const appliedGigs = await workerAPI.getAppliedGigs();
            set({
              gigApplications: appliedGigs,
              gigApplicationsLoading: false,
            });
          } else if (userType === 'manufacturer') {
            // For manufacturers, fetch applications to their machines
            set({ machineApplicationsLoading: true });
            const applications = await manufacturerAPI.getMachineApplications();
            // Ensure we always get an array
            const applicationsArray = Array.isArray(applications)
              ? applications
              : [];
            set({
              machineApplications: applicationsArray,
              machineApplicationsLoading: false,
            });
          }
          // Startups don't have a specific applications endpoint in current API
        } catch (error) {
          console.error('Failed to fetch applications:', error);
          set({
            machineApplicationsLoading: false,
            gigApplicationsLoading: false,
            machineApplicationsError: 'Failed to fetch applications',
            gigApplicationsError: 'Failed to fetch applications',
          });
        }
      },

      updateApplicationStatus: async (
        applicationId: string,
        status: 'approved' | 'rejected',
        type: 'machine' | 'gig'
      ) => {
        try {
          if (type === 'machine') {
            await manufacturerAPI.updateApplicationStatus(
              applicationId,
              status
            );

            // Update local state optimistically
            set((state) => ({
              machineApplications: state.machineApplications.map((app) =>
                app.id === applicationId ? { ...app, status } : app
              ),
            }));
          } else {
            // Note: Gig application status updates not implemented in current API
            throw new Error('Gig application status updates not implemented');
          }

          return true;
        } catch (error) {
          console.error('Failed to update application status:', error);
          return false;
        }
      },

      clearError: () => {
        set({
          machineApplicationsError: null,
          gigApplicationsError: null,
        });
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },
    }),
    {
      name: 'applications-store',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// Stable selectors - defined outside of hooks to prevent recreation
const filteredMachineApplicationsSelector = (state: ApplicationsState) => {
  const { machineApplications = [], filters } = state;

  // Ensure we have an array to work with
  const safeApplications = Array.isArray(machineApplications)
    ? machineApplications
    : [];
  let filtered = [...safeApplications];

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter((app) => app.status === filters.status);
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[filters.sortBy as keyof MachineApplication];
    const bValue = b[filters.sortBy as keyof MachineApplication];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return filters.sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return filters.sortOrder === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  return filtered;
};

// Selectors for computed values
export const useFilteredMachineApplications = () => {
  return useApplicationsStore(useShallow(filteredMachineApplicationsSelector));
};

const filteredGigApplicationsSelector = (state: ApplicationsState) => {
  const { gigApplications = [], filters } = state;

  // Ensure we have an array to work with
  const safeApplications = Array.isArray(gigApplications)
    ? gigApplications
    : [];
  let filtered = [...safeApplications];

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter((app) => app.status === filters.status);
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[filters.sortBy as keyof GigApplication];
    const bValue = b[filters.sortBy as keyof GigApplication];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return filters.sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return filters.sortOrder === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  return filtered;
};

export const useFilteredGigApplications = () => {
  return useApplicationsStore(useShallow(filteredGigApplicationsSelector));
};

// Application statistics selectors
const machineApplicationStatsSelector = (state: ApplicationsState) => {
  const { machineApplications = [] } = state;

  // Ensure we have an array to work with
  const safeApplications = Array.isArray(machineApplications)
    ? machineApplications
    : [];

  const total = safeApplications.length;
  const pending = safeApplications.filter(
    (app) => app.status === 'pending'
  ).length;
  const approved = safeApplications.filter(
    (app) => app.status === 'approved'
  ).length;
  const rejected = safeApplications.filter(
    (app) => app.status === 'rejected'
  ).length;

  return { total, pending, approved, rejected };
};

export const useMachineApplicationStats = () => {
  return useApplicationsStore(useShallow(machineApplicationStatsSelector));
};

// Stable selectors - defined outside of hooks to prevent recreation
const gigApplicationStatsSelector = (state: ApplicationsState) => {
  const { gigApplications = [] } = state;

  // Ensure we have an array to work with
  const safeApplications = Array.isArray(gigApplications)
    ? gigApplications
    : [];

  const total = safeApplications.length;
  const pending = safeApplications.filter(
    (app) => app.status === 'pending'
  ).length;
  const approved = safeApplications.filter(
    (app) => app.status === 'approved'
  ).length;
  const rejected = safeApplications.filter(
    (app) => app.status === 'rejected'
  ).length;

  return { total, pending, approved, rejected };
};

export const useGigApplicationStats = () => {
  return useApplicationsStore(useShallow(gigApplicationStatsSelector));
};

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { useMemo } from 'react';
import { publicAPI, startupAPI, workerAPI } from '../api';
import type { Gig, GigApplication, GigsResponse } from '../types';

export interface GigsState {
  // Data
  gigs: Gig[];
  userGigs: Gig[]; // For startups - gigs they created
  appliedGigs: GigApplication[]; // For workers - gigs they applied to
  currentGig: Gig | null;
  pagination: GigsResponse['pagination'] | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isApplying: boolean;
  isDeleting: boolean;

  // Filters and search
  searchTerm: string;
  locationFilter: string;
  jobTypeFilter: string;

  // Actions
  fetchGigs: (params?: any) => Promise<void>;
  fetchUserGigs: () => Promise<void>; // No userId needed - uses JWT
  fetchAppliedGigs: () => Promise<void>; // No userId needed - uses JWT
  createGig: (gigData: any) => Promise<any>;
  deleteGig: (gigId: string) => Promise<void>;
  toggleGigStatus: (gigId: string, currentStatus: boolean) => Promise<void>;
  applyToGig: (gigId: string, applicationData?: any) => Promise<void>; // No workerId needed

  // Utility actions
  setSearchTerm: (term: string) => void;
  setLocationFilter: (location: string) => void;
  setJobTypeFilter: (jobType: string) => void;
  clearFilters: () => void;
  reset: () => void;
}

const initialState = {
  gigs: [],
  userGigs: [],
  appliedGigs: [],
  currentGig: null,
  isLoading: false,
  isCreating: false,
  isApplying: false,
  isDeleting: false,
  searchTerm: '',
  locationFilter: '',
  jobTypeFilter: '',
  pagination: null,
};

export const useGigsStore = create<GigsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchGigs: async (params) => {
        set({ isLoading: true });
        try {
          const response = await publicAPI.getAllGigs(params);
          set({
            gigs: response.Gigs || [],
            pagination: response.pagination || null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to fetch gigs:', error);
          set({ isLoading: false, gigs: [], pagination: null });
        }
      },

      fetchUserGigs: async () => {
        set({ isLoading: true });
        try {
          const response = await startupAPI.getGigs();

          // Handle different response formats - the API might return { Gigs: [...] } or just [...]
          let userGigs: Gig[] = [];
          if (Array.isArray(response)) {
            userGigs = response;
          } else if (
            response &&
            typeof response === 'object' &&
            'Gigs' in response
          ) {
            userGigs = (response as any).Gigs || [];
          } else {
            userGigs = [];
          }

          set({ userGigs, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch user gigs:', error);
          set({ isLoading: false });
        }
      },

      fetchAppliedGigs: async () => {
        set({ isLoading: true });
        try {
          const appliedGigs = await workerAPI.getAppliedGigs();
          set({ appliedGigs, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch applied gigs:', error);
          set({ isLoading: false });
        }
      },

      createGig: async (gigData: any) => {
        set({ isCreating: true });
        try {
          const response = await startupAPI.createGig(gigData);
          const newGig = (response as any).Gig;
          if (!newGig) {
            throw new Error('API did not return the new gig object.');
          }
          set((state) => ({
            userGigs: [newGig, ...state.userGigs],
            isCreating: false,
          }));
          return response;
        } catch (error) {
          console.error('Failed to create gig:', error);
          set({ isCreating: false });
          throw error; // Re-throw to be caught by the component
        }
      },

      deleteGig: async (gigId: string) => {
        set({ isDeleting: true });
        try {
          await startupAPI.deleteGig(gigId);
          const { userGigs, gigs } = get();
          set({
            userGigs: userGigs.filter((gig) => gig._id !== gigId),
            gigs: gigs.filter((gig) => gig._id !== gigId),
            isDeleting: false,
          });
        } catch (error) {
          console.error('Failed to delete gig:', error);
          set({ isDeleting: false });
          throw error;
        }
      },

      toggleGigStatus: async (gigId: string, currentStatus: boolean) => {
        set({ isLoading: true });
        try {
          const updatedGig = await startupAPI.toggleGigStatus(
            gigId,
            currentStatus
          );
          const { userGigs, gigs } = get();

          // Update userGigs
          const updatedUserGigs = userGigs.map((gig) =>
            gig._id === gigId ? { ...gig, status: updatedGig.status } : gig
          );

          // Update gigs
          const updatedGigs = gigs.map((gig) =>
            gig._id === gigId ? { ...gig, status: updatedGig.status } : gig
          );

          set({
            userGigs: updatedUserGigs,
            gigs: updatedGigs,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to toggle gig status:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      applyToGig: async (gigId: string, applicationData = {}) => {
        set({ isApplying: true });
        try {
          const application = await workerAPI.applyToGig(
            gigId,
            applicationData
          );
          const { appliedGigs } = get();
          set({
            appliedGigs: [application, ...appliedGigs],
            isApplying: false,
          });
        } catch (error) {
          console.error('Failed to apply to gig:', error);
          set({ isApplying: false });
          throw error;
        }
      },

      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setLocationFilter: (location: string) =>
        set({ locationFilter: location }),
      setJobTypeFilter: (jobType: string) => set({ jobTypeFilter: jobType }),

      clearFilters: () =>
        set({
          searchTerm: '',
          locationFilter: '',
          jobTypeFilter: '',
        }),
      reset: () => set(initialState),
    }),
    {
      name: 'gigs-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist filters and search term, not the actual data
        searchTerm: state.searchTerm,
        locationFilter: state.locationFilter,
        jobTypeFilter: state.jobTypeFilter,
      }),
    }
  )
);

// Gig stats selector function that takes userGigs as input
export const useGigStats = (userGigs?: Gig[]) => {
  return useMemo(() => {
    const safeUserGigs = Array.isArray(userGigs) ? userGigs : [];

    return {
      total: safeUserGigs.length,
      active: safeUserGigs.filter((gig) => gig.status === 'active').length,
      applications: safeUserGigs.reduce(
        (acc, gig) => acc + (gig.applicationCount || 0),
        0
      ),
    };
  }, [userGigs]);
};

// Original gig stats selector for the store
const gigStatsSelector = (state: GigsState) => {
  const { gigs = [], userGigs = [] } = state;

  // Ensure we have arrays to work with
  const safeGigs = Array.isArray(gigs) ? gigs : [];
  const safeUserGigs = Array.isArray(userGigs) ? userGigs : [];

  return {
    total: safeUserGigs.length || safeGigs.length,
    active:
      safeUserGigs.filter((gig) => gig.status === 'active').length ||
      safeGigs.filter((gig) => gig.status === 'active').length,
  };
};

// Store-based gig stats hook
export const useGigStatsFromStore = () => {
  return useGigsStore(useShallow(gigStatsSelector));
};

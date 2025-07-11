'use client';

import { useMemo } from 'react';
import { useGigsStore } from '@/lib/store/gigsStore';
import { useToast } from '@/hooks/use-toast';
import { Gig } from '@/lib/types';

/**
 * Custom hook to calculate statistics for a list of gigs.
 * @param gigs - An array of Gig objects.
 * @returns An object with total, active, and application counts.
 */
export const useGigStats = (gigs: Gig[] | undefined) => {
  return useMemo(() => {
    const safeGigs = Array.isArray(gigs) ? gigs : [];
    const stats = {
      total: safeGigs.length,
      active: safeGigs.filter((gig) => gig.status === 'active').length,
      applications: safeGigs.reduce(
        (acc, gig) => acc + (gig.applicationCount || 0),
        0
      ),
    };
    return stats;
  }, [gigs]);
};

/**
 * Custom hook to provide gig-related operations like deletion and status toggle.
 * @returns An object with operation functions and loading states.
 */
export const useGigOperations = () => {
  const { deleteGig, toggleGigStatus, updateGig, isLoading, isDeleting } =
    useGigsStore();
  const { toast } = useToast();

  const handleDeleteGig = async (gigId: string): Promise<boolean> => {
    try {
      await deleteGig(gigId);
      toast({
        title: 'Gig Deleted',
        description: 'The gig has been successfully removed.',
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error Deleting Gig',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateGig = async (
    gigId: string,
    gigData: any
  ): Promise<boolean> => {
    try {
      await updateGig(gigId, gigData);
      toast({
        title: 'Gig Updated',
        description: 'The gig has been successfully updated.',
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error Updating Gig',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleToggleGigStatus = async (
    gigId: string,
    currentStatus: string
  ): Promise<boolean> => {
    try {
      const isCurrentlyActive = currentStatus === 'active';
      await toggleGigStatus(gigId, isCurrentlyActive);
      toast({
        title: `Gig ${isCurrentlyActive ? 'Deactivated' : 'Activated'}`,
        description: `The gig has been ${isCurrentlyActive ? 'deactivated' : 'activated'} successfully.`,
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error Updating Gig Status',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    handleDeleteGig,
    handleUpdateGig,
    handleToggleGigStatus,
    isDeleting,
    isToggling: isLoading,
    isUpdating: isLoading,
  };
};

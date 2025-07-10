'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Factory,
  CheckCircle,
  Users,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  XCircle,
  Loader,
  Power,
  PowerOff,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import Link from 'next/link';

import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { useGigsStore } from '@/lib/store/gigsStore';
import { Gig, UserType } from '@/lib/types';
import withAuth from '@/components/auth/withAuth';

import { IndustrialButton as Button } from '@/components/ui/industrial-button';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardDescription,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/industrial-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IndustrialBadge as Badge } from '@/components/ui/industrial-badge';
import {
  IndustrialContainer,
  IndustrialLayout,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useGigOperations, useGigStats } from '../../../../hooks/useGigHooks';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const headerVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

function StartupGigsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const {
    userGigs,
    isLoading,
    fetchUserGigs,
    deleteGig: deleteGigFromStore,
  } = useGigsStore(
    useShallow((state) => ({
      userGigs: state.userGigs,
      isLoading: state.isLoading,
      fetchUserGigs: state.fetchUserGigs,
      deleteGig: state.deleteGig,
    }))
  );
  const { handleDeleteGig, handleToggleGigStatus, isDeleting, isToggling } =
    useGigOperations();

  // Ensure userGigs is always an array before using it
  const safeUserGigs = useMemo(
    () => (Array.isArray(userGigs) ? userGigs : []),
    [userGigs]
  );

  const gigStats = useGigStats(safeUserGigs);
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      fetchUserGigs();
    }
  }, [fetchUserGigs, user?.id]);

  const handleDelete = async (gigId: string) => {
    const success = await handleDeleteGig(gigId);
    if (success) {
      deleteGigFromStore(gigId);
    }
  };

  const handleToggleStatus = async (gigId: string, currentStatus: string) => {
    const success = await handleToggleGigStatus(gigId, currentStatus);
    // The store will be updated automatically by the toggleGigStatus action
  };

  const statsCards = [
    {
      title: 'Total Gigs',
      value: gigStats.total,
      icon: Factory,
      description: 'Total number of gigs you have created',
    },
    {
      title: 'Active Gigs',
      value: gigStats.active,
      icon: CheckCircle,
      description: 'Gigs that are currently open for applications',
    },
    {
      title: 'Total Applications',
      value: gigStats.applications,
      icon: Users,
      description: 'Total applications received for all your gigs',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="danger" className="text-xs">
            <XCircle className="mr-1 h-3 w-3" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-xs">
            <AlertCircle className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  if (isLoading && safeUserGigs.length === 0) {
    return (
      <IndustrialLayout>
        <div className="flex h-full w-full items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            <Loader className="h-16 w-16 animate-spin text-industrial-accent" />
          </motion.div>
        </div>
      </IndustrialLayout>
    );
  }

  return (
    <IndustrialLayout>
      <IndustrialContainer className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-4 lg:space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Simple Page Header */}
          <motion.div
            variants={headerVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-industrial-text-primary">
                Your Gigs
              </h1>
              <p className="text-sm lg:text-base text-industrial-text-secondary mt-1">
                Manage your job postings and monitor applications.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                asChild
                variant="industrial-accent"
                size="default"
                className="w-full sm:w-auto"
              >
                <Link href="/startup/create-gig">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Gig
                </Link>
              </Button>
              <Button
                variant="industrial-outline"
                size="default"
                onClick={() => {
                  console.log('Manual refresh triggered');
                  fetchUserGigs();
                }}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Factory className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </motion.div>
          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
            variants={itemVariants}
          >
            {statsCards.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <IndustrialCard className="h-full">
                  <IndustrialCardContent className="p-4 lg:p-6">
                    <div className="flex items-center space-x-3">
                      <stat.icon className="h-6 w-6 lg:h-8 lg:w-8 text-industrial-accent flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            ))}
          </motion.div>
          {/* Gigs Table */}
          <motion.div variants={itemVariants}>
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle>Your Gigs</IndustrialCardTitle>
                <IndustrialCardDescription>
                  A list of all the gigs you've created.
                </IndustrialCardDescription>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                {safeUserGigs.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 lg:mx-0">
                    <div className="min-w-full inline-block align-middle">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              Title
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Status
                            </TableHead>
                            <TableHead className="whitespace-nowrap hidden sm:table-cell">
                              Applications
                            </TableHead>
                            <TableHead className="whitespace-nowrap hidden md:table-cell">
                              Created At
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {safeUserGigs.map((gig: Gig) => (
                            <TableRow key={gig._id}>
                              <TableCell className="font-medium">
                                <div className="max-w-[200px] lg:max-w-none">
                                  <p className="truncate font-medium">
                                    {gig.title}
                                  </p>
                                  <p className="text-xs text-gray-500 sm:hidden mt-1">
                                    {gig.applicationCount || 0} applications •{' '}
                                    {new Date(
                                      gig.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(gig.status)}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {gig.applicationCount || 0}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(gig.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 lg:gap-2">
                                  <Button
                                    variant={
                                      gig.status === 'active'
                                        ? 'industrial-outline'
                                        : 'industrial-accent'
                                    }
                                    size="icon-sm"
                                    className="h-8 w-8 lg:h-9 lg:w-9"
                                    onClick={() =>
                                      handleToggleStatus(gig._id, gig.status)
                                    }
                                    disabled={isToggling}
                                    title={
                                      gig.status === 'active'
                                        ? 'Deactivate Gig'
                                        : 'Activate Gig'
                                    }
                                  >
                                    {isToggling ? (
                                      <Loader className="h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
                                    ) : gig.status === 'active' ? (
                                      <PowerOff className="h-3 w-3 lg:h-4 lg:w-4" />
                                    ) : (
                                      <Power className="h-3 w-3 lg:h-4 lg:w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="industrial-outline"
                                    size="icon-sm"
                                    className="h-8 w-8 lg:h-9 lg:w-9"
                                    onClick={() =>
                                      router.push(
                                        `/startup/gigs/edit/${gig._id}`
                                      )
                                    }
                                    title="Edit Gig"
                                  >
                                    <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                                  </Button>
                                  <Button
                                    variant="industrial-danger"
                                    size="icon-sm"
                                    className="h-8 w-8 lg:h-9 lg:w-9"
                                    onClick={() => handleDelete(gig._id)}
                                    disabled={isDeleting}
                                    title="Delete Gig"
                                  >
                                    {isDeleting ? (
                                      <Loader className="h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 lg:py-12 px-4">
                    <IndustrialIcon
                      icon="factory"
                      className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400"
                    />
                    <h3 className="mt-4 text-lg lg:text-xl font-medium text-gray-800">
                      No Gigs Created Yet
                    </h3>
                    <p className="mt-2 text-sm lg:text-base text-industrial-text-secondary max-w-md mx-auto">
                      Ready to build your team? Post your first gig now.
                    </p>
                    <Button
                      variant="industrial-accent"
                      className="mt-6 w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/startup/create-gig">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Gig
                      </Link>
                    </Button>
                  </div>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

export default withAuth(StartupGigsPage, {
  allowedUserTypes: [UserType.STARTUP],
});

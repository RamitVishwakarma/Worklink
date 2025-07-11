'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { Badge as RegularBadge } from '@/components/ui/badge';
import {
  IndustrialContainer,
  IndustrialLayout,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useGigOperations, useGigStats } from '../../../../hooks/useGigHooks';
import { EditGigModal } from '@/components/gigs/EditGigModal';
import { DeleteGigModal } from '@/components/gigs/DeleteGigModal';

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
  const { userGigs, isLoading, fetchUserGigs } = useGigsStore(
    useShallow((state) => ({
      userGigs: state.userGigs,
      isLoading: state.isLoading,
      fetchUserGigs: state.fetchUserGigs,
    }))
  );
  const {
    handleDeleteGig,
    handleUpdateGig,
    handleToggleGigStatus,
    isDeleting,
    isToggling,
    isUpdating,
  } = useGigOperations();

  // Ensure userGigs is always an array before using it
  const safeUserGigs = useMemo(
    () => (Array.isArray(userGigs) ? userGigs : []),
    [userGigs]
  );

  const gigStats = useGigStats(safeUserGigs);
  const router = useRouter();

  // Modal states
  const [editGig, setEditGig] = useState<Gig | null>(null);
  const [deleteGig, setDeleteGig] = useState<Gig | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserGigs();
    }
  }, [fetchUserGigs, user?.id]);

  const handleDelete = async (gig: Gig) => {
    setDeleteGig(gig);
  };

  const handleEdit = (gig: Gig) => {
    setEditGig(gig);
  };

  const handleToggleStatus = async (gigId: string, currentStatus: string) => {
    const success = await handleToggleGigStatus(gigId, currentStatus);
    // The store will refresh the data automatically
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
            <div className="flex items-center">
              <CheckCircle className="mr-1 h-3 w-3" />
              <span>Active</span>
            </div>
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="default" className="text-xs">
            <div className="flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              <span>Inactive</span>
            </div>
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="danger" className="text-xs">
            <div className="flex items-center">
              <XCircle className="mr-1 h-3 w-3" />
              <span>Closed</span>
            </div>
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-xs">
            <div className="flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              <span>{status}</span>
            </div>
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
                  <div className="flex">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Gig
                  </div>
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
                <div className="flex">
                  {isLoading ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Factory className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </div>
              </Button>
            </div>
          </motion.div>
          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
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
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="whitespace-nowrap">
                                Title
                              </TableHead>
                              <TableHead className="whitespace-nowrap">
                                Status
                              </TableHead>
                              <TableHead className="whitespace-nowrap">
                                Applications
                              </TableHead>
                              <TableHead className="whitespace-nowrap">
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
                                  <div>
                                    <p className="font-medium text-industrial-text-primary">
                                      {gig.title}
                                    </p>
                                    <p className="text-sm text-industrial-text-secondary mt-1">
                                      {gig.description
                                        ? gig.description.length > 60
                                          ? `${gig.description.substring(0, 60)}...`
                                          : gig.description
                                        : 'No description'}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(gig.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-industrial-text-secondary" />
                                    <span>{gig.applicationCount || 0}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {new Date(gig.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant={
                                        gig.status === 'active'
                                          ? 'industrial-accent'
                                          : 'industrial-outline'
                                      }
                                      size="icon-sm"
                                      className={`h-9 w-9 focus:ring-2 ${
                                        gig.status === 'active'
                                          ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-400 text-yellow-700 focus:ring-yellow-200'
                                          : 'hover:bg-green-50 border-green-400 text-green-700 focus:ring-green-200'
                                      }`}
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
                                      <div className="flex h-full items-center justify-center">
                                        {isToggling ? (
                                          <Loader className="h-4 w-4 animate-spin" />
                                        ) : gig.status === 'active' ? (
                                          <PowerOff className="h-4 w-4" />
                                        ) : (
                                          <Power className="h-4 w-4" />
                                        )}
                                      </div>
                                    </Button>
                                    <Button
                                      variant="industrial-outline"
                                      size="icon-sm"
                                      className="h-9 w-9 bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                                      onClick={() => handleEdit(gig)}
                                      title="Edit Gig"
                                    >
                                      <div className="flex h-full items-center justify-center">
                                        <Edit className="h-4 w-4" />
                                      </div>
                                    </Button>
                                    <Button
                                      variant="industrial-danger"
                                      size="icon-sm"
                                      className="h-9 w-9 bg-red-50 hover:bg-red-100 border-red-300 text-red-600 hover:border-red-400 focus:ring-2 focus:ring-red-200"
                                      onClick={() => handleDelete(gig)}
                                      disabled={isDeleting}
                                      title="Delete Gig"
                                    >
                                      <div className="flex h-full items-center justify-center">
                                        {isDeleting ? (
                                          <Loader className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-4 w-4" />
                                        )}
                                      </div>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                      {safeUserGigs.map((gig: Gig) => (
                        <motion.div
                          key={gig._id}
                          variants={itemVariants}
                          className="border border-industrial-border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                        >
                          {/* Header with title and status */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-industrial-text-primary truncate">
                                {gig.title}
                              </h3>
                              {gig.description && (
                                <p className="text-sm text-industrial-text-secondary mt-1 line-clamp-2 leading-relaxed">
                                  {gig.description}
                                </p>
                              )}
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              {getStatusBadge(gig.status)}
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-industrial-text-secondary flex-shrink-0" />
                              <span className="text-industrial-text-secondary">
                                {gig.applicationCount || 0} applications
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Factory className="h-4 w-4 text-industrial-text-secondary flex-shrink-0" />
                              <span className="text-industrial-text-secondary">
                                Created{' '}
                                {new Date(gig.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Additional Info on Mobile */}
                          <div className="space-y-2 mb-4 text-sm">
                            {gig.location && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-industrial-text-primary">
                                  Location:
                                </span>
                                <span className="text-industrial-text-secondary">
                                  {gig.location}
                                </span>
                              </div>
                            )}
                            {gig.salary && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-industrial-text-primary">
                                  Salary:
                                </span>
                                <span className="text-industrial-text-secondary">
                                  ₹{gig.salary.toLocaleString()}/year
                                </span>
                              </div>
                            )}
                            {gig.skillsRequired &&
                              gig.skillsRequired.length > 0 && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-industrial-text-primary">
                                    Skills:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {gig.skillsRequired
                                      .slice(0, 3)
                                      .map((skill) => (
                                        <RegularBadge
                                          key={skill}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {skill}
                                        </RegularBadge>
                                      ))}
                                    {gig.skillsRequired.length > 3 && (
                                      <RegularBadge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        +{gig.skillsRequired.length - 3} more
                                      </RegularBadge>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant={
                                gig.status === 'active'
                                  ? 'industrial-outline'
                                  : 'industrial-accent'
                              }
                              size="sm"
                              className={`flex-1 sm:flex-none ${
                                gig.status === 'active'
                                  ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-400 text-yellow-700'
                                  : 'hover:bg-green-50 border-green-400 text-green-700'
                              }`}
                              onClick={() =>
                                handleToggleStatus(gig._id, gig.status)
                              }
                              disabled={isToggling}
                            >
                              <div className="flex items-center justify-center p-2">
                                {isToggling ? (
                                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                                ) : gig.status === 'active' ? (
                                  <PowerOff className="h-4 w-4 mr-2" />
                                ) : (
                                  <Power className="h-4 w-4 mr-2" />
                                )}
                                {gig.status === 'active'
                                  ? 'Deactivate'
                                  : 'Activate'}
                              </div>
                            </Button>
                            <Button
                              variant="industrial-outline"
                              size="sm"
                              className="flex-1 sm:flex-none bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-600 hover:border-blue-400"
                              onClick={() => handleEdit(gig)}
                            >
                              <div className="flex items-center justify-center p-2">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </div>
                            </Button>
                            <Button
                              variant="industrial-danger"
                              size="sm"
                              className="flex-1 sm:flex-none"
                              onClick={() => handleDelete(gig)}
                              disabled={isDeleting}
                            >
                              <div className="flex items-center justify-center p-2">
                                {isDeleting ? (
                                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                Delete
                              </div>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 lg:py-12 px-4">
                    <IndustrialIcon
                      icon="factory"
                      className="mx-auto h-12 w-12 lg:h-16 lg:w-16 text-gray-400"
                    />
                    <h3 className="mt-4 text-lg lg:text-xl font-semibold text-gray-800">
                      No Gigs Created Yet
                    </h3>
                    <p className="mt-2 text-sm lg:text-base text-industrial-text-secondary max-w-md mx-auto leading-relaxed">
                      Ready to build your team? Post your first gig now and
                      start attracting talented workers.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="industrial-accent"
                        className="w-full sm:w-auto"
                        asChild
                      >
                        <Link href="/startup/create-gig">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Gig
                        </Link>
                      </Button>
                      <Button
                        variant="industrial-outline"
                        className="w-full sm:w-auto"
                        onClick={() => fetchUserGigs()}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Factory className="mr-2 h-4 w-4" />
                        )}
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </motion.div>
      </IndustrialContainer>

      {/* Edit Gig Modal */}
      <EditGigModal
        isOpen={!!editGig}
        onClose={() => setEditGig(null)}
        gig={editGig}
        onSave={handleUpdateGig}
        isLoading={isUpdating}
      />

      {/* Delete Gig Modal */}
      <DeleteGigModal
        isOpen={!!deleteGig}
        onClose={() => setDeleteGig(null)}
        gig={deleteGig}
        onConfirm={handleDeleteGig}
        isLoading={isDeleting}
      />
    </IndustrialLayout>
  );
}

export default withAuth(StartupGigsPage, {
  allowedUserTypes: [UserType.STARTUP],
});

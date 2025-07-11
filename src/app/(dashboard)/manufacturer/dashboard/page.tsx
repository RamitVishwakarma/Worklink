'use client';

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { IndustrialAccessibilityProvider } from '@/components/ui/industrial-accessibility-enhanced';
import { useAuthStore } from '@/lib/store/authStore';
import withAuth from '@/components/auth/withAuth';
import { UserType, MachineApplication } from '@/lib/types';
import {
  useMachinesStore,
  useMachineStats,
  useApplicationsStore,
  useMachineApplicationStats,
} from '@/lib/store';
import {
  Settings,
  Plus,
  Factory,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  Edit,
} from 'lucide-react';
import Link from 'next/link';

function ManufacturerDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  // Store data
  const {
    userMachines: rawMachines,
    isLoading: machinesLoading,
    fetchUserMachines,
  } = useMachinesStore();
  const {
    machineApplications: rawMachineApplications,
    machineApplicationsLoading,
  } = useApplicationsStore();
  const machineStats = useMachineStats();
  const applicationStats = useMachineApplicationStats();

  // Defensive array checks
  const machines = useMemo(() => {
    return Array.isArray(rawMachines) ? rawMachines : [];
  }, [rawMachines]);
  const machineApplications = Array.isArray(rawMachineApplications)
    ? rawMachineApplications
    : [];

  const loading = machinesLoading || machineApplicationsLoading;

  // Fetch user machines on mount
  useEffect(() => {
    if (isAuthenticated && user?.userType === 'manufacturer') {
      console.log('Dashboard: Fetching user machines...');
      fetchUserMachines();
    }
  }, [isAuthenticated, user?.userType, fetchUserMachines]);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard: rawMachines =', rawMachines);
    console.log('Dashboard: machines =', machines);
    console.log('Dashboard: machinesLoading =', machinesLoading);
    console.log('Dashboard: isAuthenticated =', isAuthenticated);
    console.log('Dashboard: user =', user);
  }, [rawMachines, machines, machinesLoading, isAuthenticated, user]);

  // Get recent machines and applications for display
  // const recentMachines = machines.slice(0, 3);
  const recentApplications = machineApplications.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <IndustrialAccessibilityProvider>
      <IndustrialLayout>
        <IndustrialContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <IndustrialHeader
                  level={1}
                  className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl lg:text-3xl"
                >
                  <div className="p-2 bg-gradient-to-br from-industrial-accent/20 to-industrial-accent/10 rounded-md border border-industrial-accent/30 flex items-center justify-center">
                    <IndustrialIcon
                      icon="factory"
                      size="lg"
                      className="text-industrial-accent"
                    />
                  </div>
                  <span className="truncate">Manufacturer Dashboard</span>
                </IndustrialHeader>
                <p className="text-industrial-secondary mt-1 sm:mt-2 text-sm sm:text-base">
                  Welcome back, {user?.companyName || 'Manufacturer'}! Manage
                  your machines and applications.
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                <Link
                  href="/manufacturer/profile"
                  className="flex-1 sm:flex-initial"
                >
                  <Button
                    variant="industrial-secondary"
                    size="sm"
                    className="w-full sm:w-auto h-9 text-xs sm:text-sm"
                  >
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Profile</span>
                    <span className="xs:hidden">Settings</span>
                  </Button>
                </Link>
                <Link
                  href="/manufacturer/add-machine"
                  className="flex-1 sm:flex-initial"
                >
                  <Button
                    variant="industrial-primary"
                    size="sm"
                    className="w-full sm:w-auto h-9 text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Add Machine</span>
                    <span className="xs:hidden">Add</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <IndustrialCard key={i}>
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2" />
                      <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-2" />
                      <Skeleton className="h-2 sm:h-3 w-28 sm:w-32" />
                    </IndustrialCardContent>
                  </IndustrialCard>
                ))
              ) : (
                <>
                  <IndustrialCard
                    key="total-machines"
                    variant="industrial"
                    className="hover:shadow-lg transition-shadow"
                  >
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            Total Machines
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                            {machineStats.total}
                          </p>
                        </div>
                        <IndustrialIcon
                          icon="factory"
                          size="lg"
                          className="text-industrial-accent flex-shrink-0"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {machineStats.active} currently active
                      </p>
                    </IndustrialCardContent>
                  </IndustrialCard>

                  <IndustrialCard
                    key="total-applications"
                    variant="industrial"
                    className="hover:shadow-lg transition-shadow"
                  >
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            Total Applications
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-emerald-500">
                            {applicationStats.total}
                          </p>
                        </div>
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {applicationStats.pending} pending review
                      </p>
                    </IndustrialCardContent>
                  </IndustrialCard>

                  <IndustrialCard
                    key="approved-applications"
                    variant="industrial"
                    className="hover:shadow-lg transition-shadow"
                  >
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            Approved Applications
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                            {applicationStats.approved}
                          </p>
                        </div>
                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Successfully processed
                      </p>
                    </IndustrialCardContent>
                  </IndustrialCard>

                  <IndustrialCard
                    key="pending-applications"
                    variant="industrial"
                    className="hover:shadow-lg transition-shadow"
                  >
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            Pending Applications
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-industrial-accent">
                            {applicationStats.pending}
                          </p>
                        </div>
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-industrial-accent flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Awaiting your review
                      </p>
                    </IndustrialCardContent>
                  </IndustrialCard>

                  <IndustrialCard
                    key="active-machines"
                    variant="industrial"
                    className="hover:shadow-lg transition-shadow"
                  >
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            Active Machines
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                            {machineStats.active}
                          </p>
                        </div>
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Available for applications
                      </p>
                    </IndustrialCardContent>
                  </IndustrialCard>

                  <IndustrialCard
                    key="rejected-applications"
                    variant="industrial"
                    className="hover:shadow-lg transition-shadow"
                  >
                    <IndustrialCardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            Rejected Applications
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-red-600">
                            {applicationStats.rejected}
                          </p>
                        </div>
                        <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Declined requests
                      </p>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </>
              )}
            </motion.div>{' '}
            {/* Recent Machines */}
            <motion.div variants={itemVariants}>
              <IndustrialCard variant="industrial">
                <IndustrialCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <IndustrialCardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <IndustrialIcon icon="gear" size="sm" />
                    Your Machines
                  </IndustrialCardTitle>
                  <Link href="/manufacturer/machines">
                    <Button
                      variant="industrial-secondary"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </IndustrialCardHeader>
                <IndustrialCardContent className="p-3 sm:p-6">
                  {loading ? (
                    <div className="space-y-3 sm:space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-3 sm:space-x-4"
                        >
                          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded flex-shrink-0" />
                          <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-3 sm:h-4 w-32 sm:w-48" />
                            <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                          </div>
                          <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : machines.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <IndustrialIcon
                        icon="factory"
                        size="xl"
                        className="text-industrial-muted mx-auto mb-3 sm:mb-4"
                      />
                      <p className="text-industrial-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                        No machines listed yet
                      </p>
                      <Link href="/manufacturer/add-machine">
                        <Button
                          variant="industrial-primary"
                          className="w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Machine
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {machines.slice(0, 5).map((machine, index) => (
                        <div
                          key={machine.id || machine._id || `machine-${index}`}
                          className="flex items-center justify-between p-3 sm:p-4 border border-industrial-border rounded-lg hover:bg-industrial-primary/5 transition-colors"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-industrial-accent to-industrial-accent/80 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IndustrialIcon
                                icon="factory"
                                size="md"
                                color="white"
                                className="text-industrial-gunmetal-900"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-industrial-primary text-sm sm:text-base truncate">
                                {machine.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-industrial-gunmetal-600 truncate">
                                {machine.type} • {machine.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                            <Badge
                              variant={
                                machine.available
                                  ? 'industrial-primary'
                                  : 'industrial-secondary'
                              }
                              className="text-xs hidden sm:inline-flex"
                            >
                              {machine.available ? 'Available' : 'Unavailable'}
                            </Badge>
                            <div
                              className={`w-2 h-2 rounded-full sm:hidden ${machine.available ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                            <Link href={`/manufacturer/machines`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>{' '}
            {/* Recent Applications */}
            <motion.div variants={itemVariants}>
              <IndustrialCard variant="industrial">
                <IndustrialCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <IndustrialCardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <IndustrialIcon icon="hardhat" size="sm" />
                    Recent Applications
                  </IndustrialCardTitle>
                  <Link href="/manufacturer/applications">
                    <Button
                      variant="industrial-secondary"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </IndustrialCardHeader>
                <IndustrialCardContent className="p-3 sm:p-6">
                  {loading ? (
                    <div className="space-y-3 sm:space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-3 sm:space-x-4"
                        >
                          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
                          <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-3 sm:h-4 w-32 sm:w-48" />
                            <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                          </div>
                          <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : machineApplications.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 text-industrial-gunmetal-500 mx-auto mb-3 sm:mb-4" />
                      <p className="text-industrial-gunmetal-600 text-sm sm:text-base">
                        No applications received yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {recentApplications.map(
                        (application: MachineApplication, index) => (
                          <div
                            key={
                              application.id ||
                              application._id ||
                              `application-${index}`
                            }
                            className="flex items-center justify-between p-3 sm:p-4 border-2 border-industrial-gunmetal-300 rounded-lg hover:bg-industrial-gunmetal-50 transition-colors shadow-industrial-sm hover:shadow-industrial-md hover:border-industrial-gunmetal-400 bg-white"
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-industrial-navy-500 to-industrial-navy-600 rounded-lg flex items-center justify-center shadow-industrial-sm flex-shrink-0">
                                {application.applicantType === 'worker' ? (
                                  <IndustrialIcon
                                    icon="hardhat"
                                    size="sm"
                                    className="text-white"
                                  />
                                ) : (
                                  <IndustrialIcon
                                    icon="cog"
                                    size="sm"
                                    className="text-white"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-industrial-gunmetal-800 text-sm sm:text-base truncate">
                                  {application.applicantType === 'worker'
                                    ? 'Worker'
                                    : 'Startup'}{' '}
                                  - {application.applicantId}
                                </h3>
                                <p className="text-xs sm:text-sm text-industrial-gunmetal-600 flex items-center gap-1 truncate">
                                  <IndustrialIcon
                                    icon="wrench"
                                    size="sm"
                                    className="text-industrial-gunmetal-500 flex-shrink-0"
                                  />
                                  Applied for {application.machine?.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                              <Badge
                                variant={
                                  application.status === 'approved'
                                    ? 'industrial-success'
                                    : application.status === 'rejected'
                                      ? 'industrial-danger'
                                      : 'industrial-accent'
                                }
                                className="uppercase text-xs font-bold"
                              >
                                {application.status}
                              </Badge>
                              <span className="text-xs text-industrial-gunmetal-600 bg-industrial-gunmetal-100 px-2 py-1 rounded whitespace-nowrap">
                                {new Date(
                                  application.appliedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>
            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <IndustrialCard variant="industrial-accent">
                <IndustrialCardHeader className="flex flex-row items-center justify-between">
                  <IndustrialCardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <IndustrialIcon icon="gear" size="sm" animated />
                    Quick Actions
                  </IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent className="p-3 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <Link href="/manufacturer/add-machine" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 sm:p-4 border-2 border-industrial-gunmetal-300 hover:bg-industrial-gunmetal-50 hover:border-industrial-gunmetal-400 text-left bg-white"
                      >
                        <div className="flex items-center w-full">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-industrial-safety-300 to-industrial-safety-400 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-industrial-sm flex-shrink-0">
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-industrial-gunmetal-800" />
                          </div>
                          <div className="text-left flex flex-col min-w-0 flex-1">
                            <div className="font-medium text-industrial-gunmetal-800 text-sm sm:text-base truncate">
                              Add New Machine
                            </div>
                            <div className="text-xs text-industrial-gunmetal-600 line-clamp-2 sm:whitespace-normal">
                              List a new machine for applications
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/manufacturer/machines" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 sm:p-4 border-2 border-industrial-gunmetal-300 hover:bg-industrial-gunmetal-50 hover:border-industrial-gunmetal-400 text-left bg-white"
                      >
                        <div className="flex items-center w-full">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-industrial-navy-500 to-industrial-navy-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-industrial-sm flex-shrink-0">
                            <Factory className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="text-left flex flex-col min-w-0 flex-1">
                            <div className="font-medium text-industrial-gunmetal-800 text-sm sm:text-base truncate">
                              Manage Machines
                            </div>
                            <div className="text-xs text-industrial-gunmetal-600 line-clamp-2 sm:whitespace-normal">
                              View and edit your machines
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/manufacturer/applications" className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 sm:p-4 border-2 border-industrial-gunmetal-300 hover:bg-industrial-gunmetal-50 hover:border-industrial-gunmetal-400 text-left bg-white"
                      >
                        <div className="flex items-center w-full">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-industrial-gunmetal-600 to-industrial-gunmetal-700 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-industrial-sm flex-shrink-0">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="text-left flex flex-col min-w-0 flex-1">
                            <div className="font-medium text-industrial-gunmetal-800 text-sm sm:text-base truncate">
                              Review Applications
                            </div>
                            <div className="text-xs text-industrial-gunmetal-600 line-clamp-2 sm:whitespace-normal">
                              Approve or reject requests
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>
          </motion.div>
        </IndustrialContainer>
      </IndustrialLayout>
    </IndustrialAccessibilityProvider>
  );
}

export default withAuth(ManufacturerDashboardPage, {
  allowedUserTypes: [UserType.MANUFACTURER],
});

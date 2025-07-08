'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardDescription,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { IndustrialAccessibilityProvider } from '@/components/ui/industrial-accessibility-enhanced';
import { IndustrialGrid } from '@/components/ui/industrial-grid-system';
import { IndustrialAnimatedElement } from '@/components/ui/industrial-animation';
import { useAuthStore } from '@/lib/store/authStore';
import {
  useGigsStore,
  useGigStats,
  useApplicationsStore,
  useGigApplicationStats,
  useProfilesStore,
} from '@/lib/store';
import withAuth from '@/components/auth/withAuth';
import { UserType, GigApplication } from '@/lib/types';
import {
  Briefcase,
  Users,
  Eye,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Factory,
  Settings,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

function StartupDashboardPage() {
  const { user } = useAuthStore();

  // Store data
  const { gigs: rawGigs, isLoading: gigsLoading } = useGigsStore();
  const { gigApplications: rawGigApplications, gigApplicationsLoading } =
    useApplicationsStore();
  const { currentProfile } = useProfilesStore();
  const gigStats = useGigStats();
  const applicationStats = useGigApplicationStats();

  // Defensive array checks
  const gigs = Array.isArray(rawGigs) ? rawGigs : [];
  const gigApplications = Array.isArray(rawGigApplications)
    ? rawGigApplications
    : [];

  const loading = gigsLoading || gigApplicationsLoading;

  // Get recent data - filter user's gigs for startup
  const userGigs = gigs.filter((gig) => gig.postedBy === user?.id);
  const recentGigs = userGigs.slice(0, 5);
  const recentApplications = gigApplications.slice(0, 5);

  React.useEffect(() => {
    if (!loading) {
      const message = `Startup dashboard loaded. You have ${userGigs.length} posted gigs, ${applicationStats.total} total applications received, and ${applicationStats.pending} pending reviews.`;
      console.log('Accessibility:', message);
    }
  }, [loading, userGigs.length, applicationStats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Industrial easing
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      y: -8,
      rotateX: 5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6 max-sm:p-4">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <IndustrialCard key={i}>
              <IndustrialCardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-12" />
              </IndustrialCardContent>
            </IndustrialCard>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((cardIndex) => (
            <IndustrialCard key={cardIndex}>
              <IndustrialCardHeader className="p-6 pb-4">
                <Skeleton className="h-6 w-32" />
              </IndustrialCardHeader>
              <IndustrialCardContent className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </IndustrialCardContent>
            </IndustrialCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <IndustrialAccessibilityProvider>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-sm:p-4"
      >
        {/* Dashboard Header */}
        <motion.div variants={itemVariants} className="relative">
          {/* Industrial accent bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-1 bg-industrial-accent rounded-full"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="p-3 sm:p-4 bg-gradient-to-br from-industrial-accent/20 to-industrial-accent/10 rounded-xl border border-industrial-accent/30"
              >
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-industrial-gunmetal-600" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-industrial-gunmetal-800">
                    Startup Dashboard
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base lg:text-lg text-industrial-gunmetal-600 mt-1 sm:mt-2"
                >
                  Welcome back,{' '}
                  {(currentProfile as any)?.companyName ||
                    user?.companyName ||
                    user?.name}
                  !
                </motion.p>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end"
            >
              <Link href="/startup/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-700 bg-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link href="/startup/create-gig">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-industrial-accent hover:bg-industrial-safety-500 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Gig
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Total Gigs Card */}
            <motion.div variants={cardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-gunmetal-700 bg-gradient-to-br from-industrial-gunmetal-50 to-industrial-gunmetal-100">
                <IndustrialCardContent className="p-3 sm:p-4 md:p-6">
                  {/* Metal texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-industrial-accent/5 to-transparent opacity-50" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm font-medium text-industrial-gunmetal-700 uppercase tracking-wide"
                      >
                        Total Gigs
                      </motion.p>
                      <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.4,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        className="text-3xl font-bold text-industrial-gunmetal-800 mt-1"
                      >
                        {gigStats.total}
                      </motion.p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 sm:p-3 aspect-square bg-industrial-gunmetal-300/20 rounded-md border border-industrial-gunmetal-300/30 flex items-center justify-center"
                    >
                      <IndustrialIcon
                        icon="factory"
                        size="sm"
                        className="text-industrial-gunmetal-800 h-5 w-5 sm:h-6 sm:w-6"
                      />
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-industrial-gunmetal-600 mt-3 font-medium"
                  >
                    Posted opportunities
                  </motion.p>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>

            {/* Active Gigs Card */}
            <motion.div variants={cardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-safety-500 bg-gradient-to-br from-amber-50 to-amber-100">
                <IndustrialCardContent className="p-3 sm:p-4 md:p-6">
                  {/* Metal texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-industrial-safety-500/5 to-transparent opacity-50" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm font-medium text-amber-700 uppercase tracking-wide"
                      >
                        Active Gigs
                      </motion.p>
                      <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.5,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        className="text-3xl font-bold text-amber-700 mt-1"
                      >
                        {gigStats.active}
                      </motion.p>
                    </div>
                    <IndustrialAnimatedElement
                      variant="gear"
                      animationType="hover"
                      className="p-2 sm:p-3 aspect-square bg-industrial-safety-500/20 rounded-md border border-industrial-safety-500/30 flex items-center justify-center"
                    >
                      <IndustrialIcon
                        icon="gear"
                        size="sm"
                        className="text-industrial-safety-600 h-5 w-5 sm:h-6 sm:w-6"
                      />
                    </IndustrialAnimatedElement>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-amber-700 mt-3 font-medium"
                  >
                    Currently recruiting
                  </motion.p>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>

            {/* Total Applications Card */}
            <motion.div variants={cardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50 to-blue-100">
                <IndustrialCardContent className="p-3 sm:p-4 md:p-6">
                  {/* Metal texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm font-medium text-blue-700 uppercase tracking-wide"
                      >
                        Applications
                      </motion.p>
                      <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.5,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        className="text-3xl font-bold text-blue-700 mt-1"
                      >
                        {applicationStats.total}
                      </motion.p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: -15, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 sm:p-3 aspect-square bg-blue-500/20 rounded-md border border-blue-500/30 flex items-center justify-center"
                    >
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-blue-700 mt-3 font-medium"
                  >
                    Worker applications
                  </motion.p>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>

            {/* Pending Applications Card */}
            <motion.div variants={cardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-safety-500 bg-gradient-to-br from-industrial-gunmetal-50 to-industrial-gunmetal-100">
                <IndustrialCardContent className="p-3 sm:p-4 md:p-6">
                  {/* Metal texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-industrial-safety-500/5 to-transparent opacity-50" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm font-medium text-industrial-gunmetal-700 uppercase tracking-wide"
                      >
                        Pending Review
                      </motion.p>
                      <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.5,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        className="text-3xl font-bold text-industrial-gunmetal-800 mt-1"
                      >
                        {applicationStats.pending}
                      </motion.p>
                    </div>
                    <IndustrialAnimatedElement
                      variant="gear"
                      animationType="hover"
                      className="p-2 sm:p-3 aspect-square bg-industrial-safety-500/20 rounded-md border border-industrial-safety-500/30 flex items-center justify-center"
                    >
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-industrial-safety-600" />
                    </IndustrialAnimatedElement>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-industrial-gunmetal-600 mt-3 font-medium"
                  >
                    Awaiting your action
                  </motion.p>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Gigs */}
          <motion.div variants={itemVariants}>
            <IndustrialCard>
              <IndustrialCardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-industrial-accent/10 rounded-md flex items-center justify-center">
                      <IndustrialIcon
                        icon="factory"
                        size="sm"
                        className="text-industrial-accent h-5 w-5"
                      />
                    </div>
                    <div>
                      <IndustrialCardTitle className="text-industrial-gunmetal-800 text-lg">
                        Your Recent Gigs
                      </IndustrialCardTitle>
                      <IndustrialCardDescription className="text-industrial-gunmetal-600">
                        Recently posted job opportunities
                      </IndustrialCardDescription>
                    </div>
                  </div>
                  <Link className="max-sm:hidden" href="/startup/gigs">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-industrial-accent hover:text-industrial-accent hover:bg-industrial-accent/10"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </IndustrialCardHeader>
              <IndustrialCardContent className="p-4 pt-2 sm:p-6 sm:pt-3">
                {recentGigs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-industrial-gunmetal-200 rounded-lg bg-industrial-gunmetal-50/50">
                    <Factory className="mx-auto h-10 w-10 text-industrial-gunmetal-400" />
                    <p className="mt-2 text-industrial-gunmetal-600">
                      No gigs posted yet
                    </p>
                    <Link href="/startup/create-gig">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-industrial-accent text-industrial-accent hover:bg-industrial-accent/10"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Gig
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentGigs.map((gig) => (
                      <div
                        key={gig.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-industrial-gunmetal-200 bg-white hover:bg-industrial-gunmetal-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-medium text-industrial-gunmetal-800 truncate">
                            {gig.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <div className="flex items-center text-xs text-industrial-gunmetal-600">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{gig.location}</span>
                            </div>
                            <div className="flex items-center text-xs text-industrial-gunmetal-600">
                              <DollarSign className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>
                                {gig.salary
                                  ? `$${gig.salary}/hr`
                                  : 'Not specified'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/startup/gigs/${gig.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View gig details</span>
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          {/* Recent Applications */}
          <motion.div variants={itemVariants}>
            <IndustrialCard>
              <IndustrialCardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-md flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <IndustrialCardTitle className="text-industrial-gunmetal-800 text-lg">
                        Recent Applications
                      </IndustrialCardTitle>
                      <IndustrialCardDescription className="text-industrial-gunmetal-600">
                        Workers interested in your gigs
                      </IndustrialCardDescription>
                    </div>
                  </div>
                  <Link className="max-sm:hidden" href="/startup/applications">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-500/10"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </IndustrialCardHeader>
              <IndustrialCardContent className="p-4 pt-2 sm:p-6 sm:pt-3">
                {recentApplications.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-industrial-gunmetal-200 rounded-lg bg-industrial-gunmetal-50/50">
                    <Users className="mx-auto h-10 w-10 text-industrial-gunmetal-400" />
                    <p className="mt-2 text-industrial-gunmetal-600">
                      No applications received yet
                    </p>
                    <p className="text-sm text-industrial-gunmetal-500 mt-1">
                      Applications will appear here once workers apply to your
                      gigs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-start justify-between p-3 rounded-lg border border-industrial-gunmetal-200 bg-white hover:bg-industrial-gunmetal-50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-medium text-industrial-gunmetal-800 truncate">
                              {application.workerName || 'Worker'}
                            </h4>
                            <Badge
                              variant={
                                application.status === 'approved'
                                  ? 'industrial-success'
                                  : application.status === 'rejected'
                                    ? 'destructive'
                                    : 'outline'
                              }
                              className="text-xs"
                            >
                              {application.status === 'pending' && 'Pending'}
                              {application.status === 'approved' && 'Approved'}
                              {application.status === 'rejected' && 'Rejected'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center text-xs text-industrial-gunmetal-600">
                              <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {application.gig?.title || 'Gig'}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-industrial-gunmetal-600">
                              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>
                                Applied{' '}
                                {new Date(
                                  application.appliedAt || Date.now()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/startup/applications/${application.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View application</span>
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <IndustrialCard>
            <IndustrialCardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-industrial-gunmetal-200/50 rounded-md flex items-center justify-center">
                  <IndustrialIcon
                    icon="cog"
                    size="sm"
                    className="text-industrial-gunmetal-700 h-5 w-5"
                  />
                </div>
                <div>
                  <IndustrialCardTitle className="text-industrial-gunmetal-800 text-lg">
                    Quick Actions
                  </IndustrialCardTitle>
                  <IndustrialCardDescription className="text-industrial-gunmetal-600">
                    Shortcuts to common tasks
                  </IndustrialCardDescription>
                </div>
              </div>
            </IndustrialCardHeader>
            <IndustrialCardContent className="p-4 pt-2 sm:p-6 sm:pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-800 bg-white"
                  asChild
                >
                  <Link href="/startup/create-gig">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">Create Gig</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-800 bg-white"
                  asChild
                >
                  <Link href="/startup/gigs">
                    <Factory className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">Manage Gigs</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-800 bg-white"
                  asChild
                >
                  <Link href="/startup/applications">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">
                      Review Applications
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-800 bg-white"
                  asChild
                >
                  <Link href="/startup/profile">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">
                      Company Profile
                    </span>
                  </Link>
                </Button>
              </div>
            </IndustrialCardContent>
          </IndustrialCard>
        </motion.div>
      </motion.div>
    </IndustrialAccessibilityProvider>
  );
}

export default withAuth(StartupDashboardPage, {
  allowedUserTypes: [UserType.STARTUP],
});

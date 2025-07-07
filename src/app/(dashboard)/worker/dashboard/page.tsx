'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { IndustrialAccessibilityProvider } from '@/components/ui/industrial-accessibility-enhanced';
import { useAuthStore } from '@/lib/store/authStore';
import {
  useGigsStore,
  useGigStats,
  useApplicationsStore,
  useGigApplicationStats,
  useProfilesStore,
} from '@/lib/store';
import {
  Briefcase,
  MapPin,
  Calendar,
  Building,
  HardHat,
  Factory,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Wrench,
} from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { UserType, GigApplication, WorkerProfile } from '@/lib/types';
import Link from 'next/link';

function WorkerDashboardPage() {
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

  // Get recent data
  const recentGigs = gigs.slice(0, 6);
  const recentApplications = gigApplications.slice(0, 3);

  // Enhanced loading announcement for accessibility
  React.useEffect(() => {
    if (!loading) {
      // Announce when dashboard data has loaded for screen readers
      const message = `Dashboard loaded. You have ${applicationStats.total} total applications, ${applicationStats.pending} pending, and ${gigStats.active} active gigs available.`;
      // This would typically be handled by the accessibility provider
      console.log('Accessibility:', message);
    }
  }, [loading, applicationStats, gigStats]);

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
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
        className="space-y-6"
      >
        {/* Dashboard Header */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="sm:p-3 p-2 bg-gradient-to-br from-industrial-accent/20 to-industrial-accent/10 rounded-xl border border-industrial-accent/30 flex items-center justify-center"
            >
              <HardHat className="sm:size-8 size-5 text-industrial-accent" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-industrial-gunmetal-800">
                Worker Dashboard
              </h1>
              <p className="text-industrial-gunmetal-600 mt-1">
                Welcome back, {user?.email?.split('@')[0] || 'Worker'}!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          <motion.div variants={cardVariants} whileHover="hover">
            <IndustrialCard className="relative overflow-hidden">
              <IndustrialCardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-industrial-navy-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-industrial-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-industrial-gunmetal-600">
                      Available Gigs
                    </p>
                    <p className="text-2xl font-bold text-industrial-gunmetal-800">
                      {gigStats.active}
                    </p>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <IndustrialCard className="relative overflow-hidden">
              <IndustrialCardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-industrial-safety-100 rounded-lg">
                    <Clock className="h-5 w-5 text-industrial-safety-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-industrial-gunmetal-600">
                      Pending Applications
                    </p>
                    <p className="text-2xl font-bold text-industrial-gunmetal-800">
                      {applicationStats.pending}
                    </p>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <IndustrialCard className="relative overflow-hidden">
              <IndustrialCardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-industrial-gunmetal-600">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-industrial-gunmetal-800">
                      {applicationStats.approved}
                    </p>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <IndustrialCard className="relative overflow-hidden">
              <IndustrialCardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-industrial-gunmetal-600">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-industrial-gunmetal-800">
                      {applicationStats.rejected}
                    </p>
                  </div>
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </motion.div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Gigs to Apply For */}
          <motion.div variants={cardVariants} whileHover="hover">
            <IndustrialCard className="h-full px-0 pt-0 border-l-4 border-l-industrial-navy-600">
              <IndustrialCardHeader className="p-6 pb-4 bg-industrial-navy-50">
                <div className="flex items-center justify-between">
                  <div>
                    <IndustrialCardTitle className="flex items-center gap-2 text-industrial-navy-700">
                      <Briefcase className="h-5 w-5 text-industrial-navy-600" />
                      Available Gigs to Apply For
                    </IndustrialCardTitle>
                    <p className="text-sm text-industrial-navy-600 mt-1">
                      Browse and apply to new job opportunities
                    </p>
                  </div>
                  <Link className="max-sm:hidden" href="/worker/browse-gigs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-industrial-navy-200 text-industrial-navy-700 hover:bg-industrial-navy-50"
                    >
                      Browse All
                    </Button>
                  </Link>
                </div>
              </IndustrialCardHeader>
              <IndustrialCardContent className="p-6 space-y-4">
                {recentGigs.length === 0 ? (
                  <div className="text-center py-6">
                    <Factory className="h-12 w-12 text-industrial-navy-400 mx-auto mb-3" />
                    <p className="text-industrial-navy-600 font-medium">
                      No new gigs available
                    </p>
                    <p className="text-industrial-gunmetal-500 text-sm">
                      Check back later for new opportunities
                    </p>
                  </div>
                ) : (
                  recentGigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="border border-industrial-navy-200 rounded-lg p-4 hover:border-industrial-navy-400 hover:bg-industrial-navy-50/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-industrial-gunmetal-800 mb-2">
                          {gig.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-industrial-navy-100 text-industrial-navy-700 border-industrial-navy-200"
                        >
                          {gig.jobType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-industrial-gunmetal-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{gig.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{gig.location}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-industrial-gunmetal-800">
                          ${gig.salary?.toLocaleString() || 'TBD'}
                        </span>
                        <Button
                          size="sm"
                          className="text-xs px-3 py-1 bg-industrial-navy-600 hover:bg-industrial-navy-700"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          {/* Your Job Applications Status */}
          <motion.div variants={cardVariants} whileHover="hover">
            <IndustrialCard className="pt-0 px-0 h-full border-l-4 border-l-industrial-safety-500">
              <IndustrialCardHeader className="p-6 pb-4 bg-industrial-safety-50">
                <div className="flex items-center justify-between">
                  <div>
                    <IndustrialCardTitle className="flex items-center gap-2 text-industrial-safety-700">
                      <FileText className="h-5 w-5 text-industrial-safety-600" />
                      Your Job Applications Status
                    </IndustrialCardTitle>
                    <p className="text-sm text-industrial-safety-600 mt-1">
                      Track the status of your submitted applications
                    </p>
                  </div>
                  <Link className="max-sm:hidden" href="/worker/applied-gigs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-industrial-safety-200 text-industrial-safety-700 hover:bg-industrial-safety-50"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </IndustrialCardHeader>
              <IndustrialCardContent className="p-6 space-y-4">
                {recentApplications.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 text-industrial-safety-400 mx-auto mb-3" />
                    <p className="text-industrial-safety-600 font-medium">
                      No applications submitted yet
                    </p>
                    <p className="text-industrial-gunmetal-500 text-sm">
                      Apply to gigs to track your application status here
                    </p>
                    <Link href="/worker/browse-gigs">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-industrial-safety-200 text-industrial-safety-700 hover:bg-industrial-safety-50"
                      >
                        Browse Available Gigs
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-industrial-safety-200 rounded-lg p-4 hover:bg-industrial-safety-50/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-industrial-gunmetal-800">
                          {application.gig?.title || 'Unknown Gig'}
                        </h4>
                        <Badge
                          variant={
                            application.status === 'approved'
                              ? 'default'
                              : application.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className={
                            application.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : application.status === 'rejected'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-industrial-safety-100 text-industrial-safety-700 border-industrial-safety-200'
                          }
                        >
                          {application.status === 'pending'
                            ? '⏳ Pending Review'
                            : application.status === 'approved'
                              ? '✅ Approved'
                              : application.status === 'rejected'
                                ? '❌ Rejected'
                                : application.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-industrial-gunmetal-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>
                            {application.gig?.company || 'Unknown Company'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Applied{' '}
                            {new Date(
                              application.appliedAt || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-industrial-gunmetal-500">
                        {application.status === 'pending' &&
                          'Your application is being reviewed by the employer'}
                        {application.status === 'approved' &&
                          'Congratulations! You have been selected for this position'}
                        {application.status === 'rejected' &&
                          'Unfortunately, you were not selected for this position'}
                      </p>
                    </div>
                  ))
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </div>
      </motion.div>
    </IndustrialAccessibilityProvider>
  );
}

export default withAuth(WorkerDashboardPage, {
  allowedUserTypes: [UserType.WORKER],
});

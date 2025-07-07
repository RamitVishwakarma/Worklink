'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import {
  IndustrialGrid,
  IndustrialDashboardGrid,
} from '@/components/ui/industrial-grid-system';
import {
  IndustrialAccessibilityProvider,
  IndustrialAnnouncement,
} from '@/components/ui/industrial-accessibility-enhanced';
import {
  IndustrialText,
  IndustrialAnimatedElement,
  IndustrialButton,
} from '@/components/ui';
import designTokens from '@/components/ui/industrial-design-tokens';
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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

// Enhanced metal card variants
const metalCardVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 15 },
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
    scale: 1.02,
    y: -2,
    boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

function StartupDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

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

  if (loading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
          {' '}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mb-2 bg-industrial-gunmetal-200/50" />
                <Skeleton className="h-3 sm:h-4 w-full sm:w-96 bg-industrial-gunmetal-200/50" />
              </div>
              <Skeleton className="h-9 sm:h-10 w-full sm:w-32 bg-industrial-gunmetal-200/50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <IndustrialCard key={i}>
                  <IndustrialCardContent className="p-3 sm:p-4 lg:p-6">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mb-3 sm:mb-4 bg-industrial-gunmetal-200/50" />
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2 bg-industrial-gunmetal-200/50" />
                    <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 bg-industrial-gunmetal-200/50" />
                  </IndustrialCardContent>
                </IndustrialCard>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <IndustrialCard>
                <IndustrialCardHeader className="p-3 sm:p-4 lg:p-6">
                  <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-industrial-gunmetal-200/50" />
                </IndustrialCardHeader>
                <IndustrialCardContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-full sm:w-48 bg-industrial-gunmetal-200/50" />
                      <Skeleton className="h-3 sm:h-4 w-3/4 sm:w-32 bg-industrial-gunmetal-200/50" />
                    </div>
                  ))}
                </IndustrialCardContent>
              </IndustrialCard>
              <IndustrialCard>
                <IndustrialCardHeader className="p-3 sm:p-4 lg:p-6">
                  <Skeleton className="h-5 sm:h-6 w-28 sm:w-40 bg-industrial-gunmetal-200/50" />
                </IndustrialCardHeader>
                <IndustrialCardContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-full sm:w-48 bg-industrial-gunmetal-200/50" />
                      <Skeleton className="h-3 sm:h-4 w-3/4 sm:w-32 bg-industrial-gunmetal-200/50" />
                    </div>
                  ))}
                </IndustrialCardContent>
              </IndustrialCard>
            </div>
          </div>
        </IndustrialContainer>
      </IndustrialLayout>
    );
  }

  return (
    <IndustrialAccessibilityProvider>
      <IndustrialLayout>
        <IndustrialContainer>
          <IndustrialAnimatedElement
            variant="staggerContainer"
            custom={{
              initial: 'hidden',
              animate: 'visible',
              variants: containerVariants,
            }}
            className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 mt-2 sm:mt-4 md:mt-6 px-2 sm:px-4 lg:px-0"
          >
            {/* Enhanced Header with industrial accent bar */}
            <motion.div className="relative" variants={itemVariants}>
              {/* Animated metal accent bar */}
              <IndustrialAnimatedElement
                custom={{
                  initial: { width: 0 },
                  animate: { width: '100%' },
                  transition: { duration: 1.2, delay: 0.5, ease: 'easeOut' },
                }}
                variant="custom"
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-industrial-accent via-industrial-safety-400 to-industrial-accent rounded-full"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 pt-2 sm:pt-4">
                <div className="flex items-start gap-3 sm:items-center sm:gap-4 min-w-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 sm:p-3 flex-shrink-0 aspect-square bg-gradient-to-br from-industrial-accent/20 to-industrial-accent/10 rounded-md border border-industrial-accent/30 flex items-center justify-center"
                  >
                    <Image
                      src="/logo.png"
                      alt="WorkLink Logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <IndustrialHeader
                        level={1}
                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl break-words"
                      >
                        <IndustrialText as="span" variant="default">
                          Welcome back,{' '}
                          {(currentProfile as any)?.companyName ||
                            user?.companyName ||
                            user?.name}
                          !
                        </IndustrialText>
                      </IndustrialHeader>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs sm:text-sm text-industrial-muted-foreground mt-1"
                    >
                      Manage your gigs, review applications, and grow your team
                    </motion.p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-start sm:justify-end"
                >
                  <Link href="/startup/profile">
                    <Button
                      variant="industrial-secondary"
                      size="sm"
                      className="hover:scale-105 transition-transform bg-industrial-gunmetal-200 hover:bg-industrial-gunmetal-300 text-industrial-gunmetal-800 border-industrial-gunmetal-300"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/startup/create-gig">
                    <Button
                      variant="industrial-accent"
                      size="sm"
                      className="hover:scale-105 transition-transform shadow-lg hover:shadow-xl bg-industrial-safety-400 hover:bg-industrial-safety-500 text-industrial-dark border-industrial-safety-500"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Gig
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Stats Cards with Industrial Design System */}
            <motion.div variants={itemVariants}>
              <IndustrialDashboardGrid
                layout="default"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full"
              >
                {/* Total Gigs Card */}
                <motion.div variants={metalCardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden border-l-4 border-l-industrial-gunmetal-700 bg-gradient-to-br from-industrial-gunmetal-50 to-industrial-gunmetal-100"
                  >
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
                <motion.div variants={metalCardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden border-l-4 border-l-industrial-safety-500 bg-gradient-to-br from-amber-50 to-amber-100"
                  >
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
                        transition={{ delay: 0.7 }}
                        className="text-xs text-amber-600 mt-3 font-medium"
                      >
                        Currently accepting
                      </motion.p>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </motion.div>

                {/* Total Applications Card */}
                <motion.div variants={metalCardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100"
                  >
                    <IndustrialCardContent className="p-3 sm:p-4 md:p-6">
                      {/* Metal texture overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm font-medium text-blue-700 uppercase tracking-wide"
                          >
                            Total Applications
                          </motion.p>
                          <motion.p
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              delay: 0.6,
                              type: 'spring',
                              stiffness: 100,
                            }}
                            className="text-3xl font-bold text-blue-700 mt-1"
                          >
                            {applicationStats.total}
                          </motion.p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="p-2 sm:p-3 aspect-square bg-blue-500/20 rounded-md border border-blue-500/30 flex items-center justify-center"
                        >
                          <IndustrialIcon
                            icon="wrench"
                            size="sm"
                            className="text-blue-700 h-5 w-5 sm:h-6 sm:w-6"
                          />
                        </motion.div>
                      </div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-xs text-blue-600 mt-3 font-medium"
                      >
                        Received applications
                      </motion.p>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </motion.div>

                {/* Pending Reviews Card */}
                <motion.div variants={metalCardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100"
                  >
                    <IndustrialCardContent className="p-3 sm:p-4 md:p-6">
                      {/* Metal texture overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-sm font-medium text-emerald-700 uppercase tracking-wide"
                          >
                            Pending Reviews
                          </motion.p>
                          <motion.p
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              delay: 0.7,
                              type: 'spring',
                              stiffness: 100,
                            }}
                            className="text-3xl font-bold text-emerald-700 mt-1"
                          >
                            {applicationStats.pending}
                          </motion.p>
                        </div>
                        <IndustrialAnimatedElement
                          variant="gear"
                          animationType="hover"
                          className="p-2 sm:p-3 aspect-square bg-emerald-500/20 rounded-md border border-emerald-500/30 flex items-center justify-center"
                        >
                          <IndustrialIcon
                            icon="cog"
                            size="sm"
                            className="text-emerald-700 h-5 w-5 sm:h-6 sm:w-6"
                          />
                        </IndustrialAnimatedElement>
                      </div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="text-xs text-emerald-600 mt-3 font-medium"
                      >
                        Awaiting decision
                      </motion.p>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </motion.div>
              </IndustrialDashboardGrid>
            </motion.div>

            {/* Enhanced Main Content Grid with Industrial Design */}
            <IndustrialGrid
              columns={{ default: 1, lg: 2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
              variant="industrial"
              pattern="grid"
              equalHeight
            >
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
                            Recent Gigs
                          </IndustrialCardTitle>
                          <IndustrialCardDescription className="text-industrial-gunmetal-600">
                            Your latest job postings
                          </IndustrialCardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-700 bg-white"
                        asChild
                      >
                        <Link href="/startup/gigs">
                          <Eye className="h-4 w-4 mr-2" />
                          View All
                        </Link>
                      </Button>
                    </div>
                  </IndustrialCardHeader>
                  <IndustrialCardContent className="p-4 pt-2 sm:p-6 sm:pt-3">
                    {recentGigs.length === 0 ? (
                      <div className="text-center py-8">
                        <IndustrialIcon
                          icon="factory"
                          className="h-12 w-12 text-industrial-muted-foreground mx-auto mb-4"
                        />
                        <p className="text-sm text-industrial-gunmetal-600">
                          No gigs created yet
                        </p>
                        <Button
                          className="mt-2 bg-industrial-safety-400 hover:bg-industrial-safety-500 text-industrial-dark border-industrial-safety-500"
                          size="sm"
                          asChild
                        >
                          <Link href="/startup/create-gig">
                            Create Your First Gig
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentGigs.map((gig) => (
                          <div
                            key={gig.id}
                            className="flex items-start space-x-3 p-3 border border-industrial-border rounded-lg hover:bg-industrial-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-industrial-gunmetal-800">
                                {gig.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-sm text-industrial-gunmetal-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {gig.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />$
                                  {gig.salary?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {gig.isActive ? (
                                <Badge
                                  variant="industrial-secondary"
                                  className="bg-amber-100 text-amber-700 border-amber-300/30"
                                >
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="industrial-outline"
                                  className="text-industrial-gunmetal-600"
                                >
                                  Inactive
                                </Badge>
                              )}
                              <span className="text-xs text-industrial-gunmetal-600">
                                {new Date(gig.createdAt).toLocaleDateString()}
                              </span>
                            </div>
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
                        <div className="p-1.5 bg-industrial-safety-400/10 rounded-md flex items-center justify-center">
                          <IndustrialIcon
                            icon="wrench"
                            size="sm"
                            className="text-industrial-safety-500 h-5 w-5"
                          />
                        </div>
                        <div>
                          <IndustrialCardTitle className="text-industrial-gunmetal-800 text-lg">
                            Recent Applications
                          </IndustrialCardTitle>
                          <IndustrialCardDescription className="text-industrial-gunmetal-600">
                            Latest applications received
                          </IndustrialCardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-700 bg-white"
                        asChild
                      >
                        <Link href="/startup/applications">
                          <Users className="h-4 w-4 mr-2" />
                          View All
                        </Link>
                      </Button>
                    </div>
                  </IndustrialCardHeader>
                  <IndustrialCardContent className="p-4 pt-2 sm:p-6 sm:pt-3">
                    {recentApplications.length === 0 ? (
                      <div className="text-center py-8">
                        <IndustrialIcon
                          icon="gear"
                          className="h-12 w-12 text-industrial-gunmetal-400 mx-auto mb-4"
                        />
                        <p className="text-sm text-industrial-gunmetal-600">
                          No applications received yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentApplications.map(
                          (application: GigApplication) => (
                            <div
                              key={application.id}
                              className="flex items-start space-x-3 p-3 border border-industrial-border rounded-lg hover:bg-industrial-muted/50 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-industrial-gunmetal-800">
                                  {application.workerName}
                                </h4>
                                <p className="text-sm text-industrial-gunmetal-600">
                                  Applied for:{' '}
                                  {application.gig?.title || 'Unknown Gig'}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-industrial-gunmetal-600">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(
                                    application.appliedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {application.status.toLowerCase() ===
                                  'pending' && (
                                  <Badge
                                    variant="industrial-secondary"
                                    className="bg-amber-100 text-amber-700 border-amber-300/30"
                                  >
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {application.status.toLowerCase() ===
                                  'approved' && (
                                  <Badge
                                    variant="industrial-secondary"
                                    className="bg-emerald-100 text-emerald-700 border-emerald-300/30"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                    Approved
                                  </Badge>
                                )}
                                {application.status.toLowerCase() ===
                                  'rejected' && (
                                  <Badge
                                    variant="industrial-outline"
                                    className="bg-red-100 text-red-600 border-red-300/30"
                                  >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Rejected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            </IndustrialGrid>

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
                        Common tasks to manage your startup
                      </IndustrialCardDescription>
                    </div>
                  </div>
                </IndustrialCardHeader>
                <IndustrialCardContent className="p-4 pt-2 sm:p-6 sm:pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-800 bg-white"
                      asChild
                    >
                      <Link href="/startup/create-gig">
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-sm sm:text-base">
                          Create New Gig
                        </span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 border-industrial-border hover:bg-industrial-gunmetal-100 hover:border-industrial-gunmetal-300 text-industrial-gunmetal-800 bg-white"
                      asChild
                    >
                      <Link href="/startup/gigs">
                        <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-sm sm:text-base">
                          Manage Gigs
                        </span>
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
          </IndustrialAnimatedElement>
        </IndustrialContainer>
      </IndustrialLayout>
    </IndustrialAccessibilityProvider>
  );
}

export default withAuth(StartupDashboardPage, {
  allowedUserTypes: [UserType.STARTUP],
});

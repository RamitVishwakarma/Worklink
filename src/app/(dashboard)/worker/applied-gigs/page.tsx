'use client';

import { useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialAccessibilityProvider } from '@/components/ui/industrial-accessibility-enhanced';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { useApplicationsStore, useGigApplicationStats } from '@/lib/store';
import { GigApplication } from '@/lib/types';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  RefreshCw,
  HardHat,
} from 'lucide-react';

// Industrial Design System Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Industrial precision easing
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <Badge className="bg-industrial-safety-300 text-industrial-gunmetal-800 hover:bg-industrial-safety-300 border-industrial-safety-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-industrial-muted text-industrial-muted-foreground hover:bg-industrial-muted border-industrial-border">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export default function AppliedGigsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Store data
  const { gigApplications: applications, gigApplicationsLoading: loading } =
    useApplicationsStore();
  const applicationStats = useGigApplicationStats();
  const refreshApplications = async () => {
    setRefreshing(true);
    try {
      // Since applications are auto-fetched by AppProvider,
      // we'll provide user feedback without actual refresh
      toast({
        title: 'Info',
        description: 'Applications are automatically kept up to date',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh applications',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };
  if (loading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
          <IndustrialAccessibilityProvider>
            <div className="flex items-center justify-center min-h-[400px]">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 border-4 border-industrial-accent/30 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner gear */}
                <div className="p-4 bg-industrial-gunmetal-100 rounded-full border-2 border-industrial-accent/50">
                  <IndustrialIcon
                    icon="gear"
                    size="xl"
                    className="text-industrial-accent"
                  />
                </div>
              </motion.div>
            </div>
          </IndustrialAccessibilityProvider>
        </IndustrialContainer>
      </IndustrialLayout>
    );
  }
  const stats = applicationStats;
  return (
    <IndustrialLayout padding="sm">
      <IndustrialContainer size="xl">
        <IndustrialAccessibilityProvider>
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Header */}
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
                    <IndustrialIcon
                      icon="wrench"
                      size="lg"
                      className="text-industrial-gunmetal-600 sm:w-8 sm:h-8"
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
                        className="text-industrial-gunmetal-800 font-bold text-2xl sm:text-3xl lg:text-4xl"
                      >
                        Applied Gigs
                      </IndustrialHeader>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm sm:text-base lg:text-lg text-industrial-gunmetal-600 mt-1 sm:mt-2"
                    >
                      Track your gig applications and their status
                    </motion.p>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex-shrink-0"
                >
                  <Button
                    variant="industrial-outline"
                    onClick={refreshApplications}
                    disabled={refreshing}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                    />
                    <span className="sm:inline">Refresh</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={itemVariants}
            >
              <IndustrialCard>
                <IndustrialCardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <IndustrialIcon
                      icon="factory"
                      size="sm"
                      className="text-industrial-muted-foreground flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-industrial-gunmetal-600 truncate">
                        Total Applied
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-industrial-accent">
                        {stats.total}
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>

              <IndustrialCard>
                <IndustrialCardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-industrial-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-industrial-gunmetal-600 truncate">
                        Pending
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-industrial-safety-500">
                        {stats.pending}
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>

              <IndustrialCard>
                <IndustrialCardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-industrial-safety-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-industrial-gunmetal-600 truncate">
                        Approved
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-industrial-safety-500">
                        {stats.approved}
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>

              <IndustrialCard>
                <IndustrialCardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-industrial-gunmetal-600 truncate">
                        Rejected
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">
                        {stats.rejected}
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>
            {/* Applications List */}
            <motion.div variants={itemVariants}>
              {applications.length === 0 ? (
                <IndustrialCard>
                  <IndustrialCardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                    <IndustrialIcon
                      icon="factory"
                      size="lg"
                      className="mb-3 sm:mb-4 text-industrial-accent"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-industrial-gunmetal-800 text-center">
                      No Applications Found
                    </h3>
                    <p className="text-sm sm:text-base text-industrial-gunmetal-600 text-center max-w-md">
                      You haven't applied to any gigs yet. Start browsing
                      available gigs to apply.
                    </p>
                    <Button
                      variant="industrial-accent"
                      className="mt-4 w-full sm:w-auto"
                      onClick={() => (window.location.href = '/gigs')}
                    >
                      <HardHat className="mr-2 h-4 w-4" />
                      Browse Gigs
                    </Button>
                  </IndustrialCardContent>
                </IndustrialCard>
              ) : (
                <IndustrialCard>
                  <IndustrialCardHeader className="pb-4">
                    <IndustrialCardTitle className="flex items-center gap-2 text-industrial-gunmetal-800 text-lg sm:text-xl">
                      <IndustrialIcon
                        icon="cog"
                        size="sm"
                        className="text-industrial-accent flex-shrink-0"
                      />
                      <span className="truncate">Your Applications</span>
                    </IndustrialCardTitle>
                    <IndustrialCardDescription className="text-industrial-gunmetal-600 text-sm sm:text-base">
                      A detailed view of all your gig applications
                    </IndustrialCardDescription>
                  </IndustrialCardHeader>
                  <IndustrialCardContent className="px-0 sm:px-6">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-industrial-border">
                              <TableHead className="text-industrial-gunmetal-800 font-semibold text-left px-4">
                                Gig Title
                              </TableHead>
                              <TableHead className="text-industrial-gunmetal-800 font-semibold text-left px-4">
                                Company
                              </TableHead>
                              <TableHead className="text-industrial-gunmetal-800 font-semibold text-left px-4">
                                Location
                              </TableHead>
                              <TableHead className="text-industrial-gunmetal-800 font-semibold text-left px-4">
                                Salary
                              </TableHead>
                              <TableHead className="text-industrial-gunmetal-800 font-semibold text-left px-4">
                                Applied On
                              </TableHead>
                              <TableHead className="text-industrial-gunmetal-800 font-semibold text-left px-4">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applications.map((application: GigApplication) => (
                              <TableRow
                                key={application.id}
                                className="border-industrial-border hover:bg-industrial-muted/50"
                              >
                                <TableCell className="font-medium text-industrial-gunmetal-800 px-4">
                                  <div className="max-w-[200px] truncate">
                                    {application.gig?.title || 'Unknown'}
                                  </div>
                                </TableCell>
                                <TableCell className="px-4">
                                  <div className="flex items-center space-x-2 max-w-[150px]">
                                    <Building2 className="h-4 w-4 text-industrial-gunmetal-600 flex-shrink-0" />
                                    <span className="text-industrial-gunmetal-700 truncate">
                                      {application.gig?.company || 'Unknown'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="px-4">
                                  <div className="flex items-center space-x-2 max-w-[150px]">
                                    <MapPin className="h-4 w-4 text-industrial-gunmetal-600 flex-shrink-0" />
                                    <span className="text-industrial-gunmetal-700 truncate">
                                      {application.gig?.location || 'Unknown'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="px-4">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-industrial-gunmetal-600 flex-shrink-0" />
                                    <span className="text-industrial-gunmetal-700">
                                      $
                                      {application.gig?.salary?.toLocaleString() ||
                                        'N/A'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="px-4">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-industrial-gunmetal-600 flex-shrink-0" />
                                    <span className="text-industrial-gunmetal-700 text-sm">
                                      {new Date(
                                        application.appliedAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="px-4">
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(application.status)}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    {/* Mobile/Tablet View */}
                    <div className="lg:hidden space-y-3 px-4 sm:px-6">
                      {applications.map((application: GigApplication) => (
                        <motion.div
                          key={application.id}
                          className="border border-industrial-border rounded-lg p-3 sm:p-4 space-y-3 bg-industrial-background"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-industrial-gunmetal-800 text-sm sm:text-base line-clamp-2">
                                {application.gig?.title || 'Unknown'}
                              </h3>
                              <p className="text-xs sm:text-sm text-industrial-gunmetal-600 flex items-center gap-1 mt-1">
                                <Building2 className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {application.gig?.company || 'Unknown'}
                                </span>
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 text-industrial-gunmetal-700">
                              <MapPin className="h-3 w-3 text-industrial-accent flex-shrink-0" />
                              <span className="truncate">
                                {application.gig?.location || 'Unknown'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-industrial-gunmetal-700">
                              <DollarSign className="h-3 w-3 text-industrial-accent flex-shrink-0" />
                              <span className="truncate">
                                $
                                {application.gig?.salary?.toLocaleString() ||
                                  'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs sm:text-sm text-industrial-gunmetal-700 pt-1 border-t border-industrial-border/50">
                            <Calendar className="h-3 w-3 text-industrial-accent flex-shrink-0" />
                            <span>
                              Applied:{' '}
                              {new Date(
                                application.appliedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              )}
            </motion.div>{' '}
          </motion.div>
        </IndustrialAccessibilityProvider>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

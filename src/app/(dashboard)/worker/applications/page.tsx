'use client';

import React, { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  IndustrialLayout,
  IndustrialContainer,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { useApplicationsStore, useGigApplicationStats } from '@/lib/store';
import { GigApplication } from '@/lib/types';
import withAuth from '@/components/auth/withAuth';
import { UserType } from '@/lib/types';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

// Industrial animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const metalCardVariants = {
  hover: {
    scale: 1.02,
    boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.3 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Status badge component with industrial styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="industrial-success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="industrial-danger" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="industrial-warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

function ApplicationsPage() {
  const { user } = useAuthStore();
  const { gigApplications, gigApplicationsLoading: loading } =
    useApplicationsStore();
  const applicationStats = useGigApplicationStats();
  const { toast } = useToast();

  // Filter applications for current worker
  const applications = gigApplications.filter(
    (app: GigApplication) => app.workerId === user?.id
  );

  if (loading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-48 mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-64 bg-gray-200" />
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <IndustrialCard key={i} className="border-gray-200">
                  <IndustrialCardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-full mb-4 bg-gray-200" />
                    <Skeleton className="h-4 w-20 mb-2 bg-gray-200" />
                    <Skeleton className="h-8 w-16 bg-gray-200" />
                  </IndustrialCardContent>
                </IndustrialCard>
              ))}
            </div>

            {/* Applications Table Skeleton */}
            <IndustrialCard className="border-gray-200">
              <IndustrialCardHeader>
                <Skeleton className="h-6 w-32 bg-gray-200" />
                <Skeleton className="h-4 w-48 bg-gray-200" />
              </IndustrialCardHeader>
              <IndustrialCardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <IndustrialCard key={i} className="border-gray-200">
                      <IndustrialCardHeader>
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32 bg-gray-200" />
                            <Skeleton className="h-4 w-48 bg-gray-200" />
                          </div>
                          <Skeleton className="h-6 w-20 bg-gray-200" />
                        </div>
                      </IndustrialCardHeader>
                      <IndustrialCardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <Skeleton className="h-4 w-24 bg-gray-200" />
                          <Skeleton className="h-4 w-32 bg-gray-200" />
                          <Skeleton className="h-4 w-28 bg-gray-200" />
                        </div>
                      </IndustrialCardContent>
                    </IndustrialCard>
                  ))}
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>
        </IndustrialContainer>
      </IndustrialLayout>
    );
  }

  return (
    <IndustrialLayout>
      <IndustrialContainer>
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Header with Industrial Styling */}
          <motion.div variants={headerVariants} className="relative">
            {/* Animated Metal Accent Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-industrial-accent via-industrial-safety-400 to-industrial-accent rounded-full"
            />

            <div className="flex items-center gap-4 pt-4">
              {/* 3D Industrial Icon with Hover Animation */}
              <motion.div
                whileHover={{
                  rotateY: 15,
                  scale: 1.1,
                  rotateX: 5,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative"
              >
                <motion.div
                  animate={{
                    rotateZ: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 2,
                  }}
                >
                  <IndustrialIcon
                    icon="wrench"
                    size="xl"
                    className="text-industrial-accent drop-shadow-lg"
                  />
                </motion.div>

                {/* Industrial glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-industrial-accent/20 to-transparent rounded-full blur-xl" />
              </motion.div>

              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-industrial-foreground via-industrial-accent to-industrial-foreground bg-clip-text text-transparent mb-2">
                    My Applications
                  </h1>
                  <p className="text-industrial-muted-foreground text-lg">
                    Track the status of your industrial gig applications
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Metal texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-industrial-gunmetal-50/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Enhanced Stats Cards with Industrial Styling */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            {/* Total Applications Card */}
            <motion.div variants={metalCardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-accent bg-gradient-to-br from-industrial-gunmetal-50 to-industrial-gunmetal-100">
                {/* Metal grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(156, 163, 175, 0.3) 1px, transparent 0),
                        linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px),
                        linear-gradient(0deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
                    }}
                  />
                </div>

                <IndustrialCardContent className="p-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FileText className="h-6 w-6 text-industrial-accent" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-industrial-muted-foreground">
                        Total Applications
                      </p>
                      <p className="text-3xl font-bold text-industrial-foreground">
                        {applications.length}
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>

            {/* Pending Applications Card */}
            <motion.div variants={metalCardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-safety-400 bg-gradient-to-br from-industrial-safety-50 to-industrial-safety-100">
                {/* Metal grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(251, 191, 36, 0.3) 1px, transparent 0),
                        linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px),
                        linear-gradient(0deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
                    }}
                  />
                </div>

                <IndustrialCardContent className="p-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Clock className="h-6 w-6 text-industrial-safety-400" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-industrial-muted-foreground">
                        Pending Review
                      </p>
                      <p className="text-3xl font-bold text-industrial-foreground">
                        {
                          applications.filter((app) => app.status === 'pending')
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>

            {/* Approved Applications Card */}
            <motion.div variants={metalCardVariants} whileHover="hover">
              <IndustrialCard className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100">
                {/* Metal grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0),
                        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                        linear-gradient(0deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px, 20px 20px, 20px 20px',
                    }}
                  />
                </div>

                <IndustrialCardContent className="p-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-industrial-muted-foreground">
                        Approved
                      </p>
                      <p className="text-3xl font-bold text-industrial-foreground">
                        {
                          applications.filter(
                            (app) => app.status === 'approved'
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>
          </motion.div>

          {/* Enhanced Applications List Section */}
          <motion.div variants={itemVariants}>
            {applications.length === 0 ? (
              <motion.div variants={metalCardVariants} whileHover="hover">
                <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-muted bg-gradient-to-br from-industrial-muted/10 to-industrial-muted/20">
                  <IndustrialCardContent className="text-center py-12">
                    <motion.div
                      animate={{ rotate: [0, 2, -2, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <AlertTriangle className="h-16 w-16 text-industrial-muted-foreground mb-4 mx-auto" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-industrial-foreground">
                      No Applications Found
                    </h3>
                    <p className="text-industrial-muted-foreground text-center mb-6 max-w-md mx-auto">
                      You haven't applied to any gigs yet. Start browsing
                      industrial opportunities and submit your first
                      application.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        variant="industrial-accent"
                        className="shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <a href="/gigs">
                          <FileText className="h-4 w-4 mr-2" />
                          Browse Available Gigs
                        </a>
                      </Button>
                    </motion.div>
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            ) : (
              <motion.div variants={metalCardVariants} whileHover="hover">
                <IndustrialCard className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100">
                  {/* Metal grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0),
                          linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                          linear-gradient(0deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px, 20px 20px, 20px 20px',
                      }}
                    />
                  </div>

                  <IndustrialCardHeader className="relative z-10">
                    <IndustrialCardTitle className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <IndustrialIcon
                          icon="gear"
                          size="md"
                          className="text-emerald-500"
                        />
                      </motion.div>
                      <span className="text-industrial-foreground font-bold">
                        All Applications
                      </span>
                    </IndustrialCardTitle>
                    <IndustrialCardDescription className="text-industrial-muted-foreground">
                      Track your industrial gig applications and their current
                      status
                    </IndustrialCardDescription>
                  </IndustrialCardHeader>

                  <IndustrialCardContent className="relative z-10">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <Table className="border-industrial-border">
                        <TableHeader>
                          <TableRow className="border-industrial-border bg-industrial-muted/20">
                            <TableHead className="text-industrial-foreground font-semibold">
                              Job Title
                            </TableHead>
                            <TableHead className="text-industrial-foreground">
                              Company
                            </TableHead>
                            <TableHead className="text-industrial-foreground">
                              Location
                            </TableHead>
                            <TableHead className="text-industrial-foreground">
                              Salary
                            </TableHead>
                            <TableHead className="text-industrial-foreground">
                              Applied
                            </TableHead>
                            <TableHead className="text-industrial-foreground">
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
                              <TableCell className="font-medium text-industrial-foreground">
                                {application.gig?.title || 'Unknown'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Building2 className="h-4 w-4 text-industrial-muted-foreground" />
                                  <span className="text-industrial-foreground">
                                    {application.gig?.company || 'Unknown'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-industrial-muted-foreground" />
                                  <span className="text-industrial-foreground">
                                    {application.gig?.location || 'Unknown'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-industrial-muted-foreground" />
                                  <span className="text-industrial-foreground">
                                    {application.gig?.salary
                                      ? `$${application.gig.salary.toLocaleString()}`
                                      : 'Not specified'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-industrial-muted-foreground" />
                                  <span className="text-industrial-foreground">
                                    {new Date(
                                      application.appliedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(application.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {applications.map((application: GigApplication) => (
                        <motion.div
                          key={application.id}
                          className="border border-industrial-border rounded-lg p-4 space-y-3 bg-industrial-background"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-industrial-foreground">
                                {application.gig?.title || 'Unknown'}
                              </h3>
                              <p className="text-sm text-industrial-muted-foreground flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {application.gig?.company || 'Unknown'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1 text-industrial-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {application.gig?.location || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-1 text-industrial-muted-foreground">
                              <DollarSign className="h-3 w-3" />$
                              {application.gig?.salary?.toLocaleString() ||
                                'N/A'}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-industrial-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Applied:{' '}
                            {new Date(
                              application.appliedAt
                            ).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

export default withAuth(ApplicationsPage, {
  allowedUserTypes: [UserType.WORKER],
});

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardDescription,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndustrialInput } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useMachinesStore,
  useApplicationsStore,
  useMachineApplicationStats,
  useAuthStore,
} from '@/lib/store';
import { Machine, MachineApplication, UserType } from '@/lib/types';
import { manufacturerAPI } from '@/lib/api';
import withAuth from '@/components/auth/withAuth';
import {
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  Calendar,
  Loader2,
  Users,
  AlertTriangle,
  Eye,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function MachineApplicationsPage() {
  const {
    machines,
    isLoading: machinesLoading,
    fetchUserMachines,
  } = useMachinesStore();
  const {
    machineApplications: rawApplications,
    machineApplicationsLoading,
    fetchApplications,
    updateApplicationStatus,
  } = useApplicationsStore();
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const machineId = params.id as string;

  // Ensure applications is always an array
  const applications = useMemo(() => {
    const result = Array.isArray(rawApplications) ? rawApplications : [];
    return result;
  }, [rawApplications]);
  const isLoading = machinesLoading || machineApplicationsLoading;

  // Get current machine from store
  const machine = machines.find((m) => m._id === machineId) || null;
  const [filteredApplications, setFilteredApplications] = useState<
    MachineApplication[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [processingApplication, setProcessingApplication] = useState<
    string | null
  >(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    application: MachineApplication | null;
    action: 'approve' | 'reject' | null;
  }>({
    open: false,
    application: null,
    action: null,
  });

  const fetchMachineAndApplications = useCallback(async () => {
    if (!user || !machineId) return;

    try {
      // Fetch applications using store (no user ID needed)
      await fetchApplications();
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to fetch machine applications',
        variant: 'destructive',
      });
    }
  }, [user, machineId, fetchApplications, toast]);

  const handleApplicationAction = (
    application: MachineApplication,
    action: 'approve' | 'reject'
  ) => {
    setConfirmDialog({
      open: true,
      application,
      action,
    });
  };
  const confirmApplicationAction = async () => {
    const { application, action } = confirmDialog;
    if (!application || !action) return;

    setProcessingApplication(application._id);
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const success = await updateApplicationStatus(
        application._id,
        status,
        'machine'
      );

      if (success) {
        toast({
          title: 'Success',
          description: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
        });
        // Refresh applications to get updated data
        await fetchApplications();
      } else {
        throw new Error(`Failed to ${action} application`);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || `Failed to ${action} application`,
        variant: 'destructive',
      });
    } finally {
      setProcessingApplication(null);
      setConfirmDialog({ open: false, application: null, action: null });
    }
  };

  useEffect(() => {
    if (user?.userType === UserType.MANUFACTURER) {
      fetchMachineAndApplications();
    }
  }, [user, machineId, fetchMachineAndApplications]);

  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (application) =>
          application.applicantId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          application.applicantType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          application.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (application) => application.status === statusFilter
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (application) => application.applicantType === typeFilter
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, typeFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-industrial-accent';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-industrial-secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 bg-gray-200" />
              <div>
                <Skeleton className="h-8 w-64 bg-gray-200 mb-2" />
                <Skeleton className="h-4 w-48 bg-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <IndustrialCard key={index}>
                  <IndustrialCardContent className="p-4">
                    <Skeleton className="h-4 w-24 bg-gray-200 mb-2" />
                    <Skeleton className="h-8 w-16 bg-gray-200" />
                  </IndustrialCardContent>
                </IndustrialCard>
              ))}
            </div>

            <IndustrialCard>
              <IndustrialCardContent className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-industrial-muted" />
                        <div>
                          <Skeleton className="h-4 w-32 bg-industrial-muted mb-1" />
                          <Skeleton className="h-3 w-24 bg-industrial-muted" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 bg-industrial-muted" />
                        <Skeleton className="h-8 w-20 bg-industrial-muted" />
                      </div>
                    </div>
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="hover:bg-industrial-muted"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>{' '}
              <div>
                <IndustrialHeader level={1}>
                  Applications for {machine?.name}
                </IndustrialHeader>
                <p className="text-gray-600 mt-2">
                  Manage applications for your {machine?.type}
                </p>
              </div>
            </div>

            {machine && (
              <IndustrialCard className="border-industrial-primary/20">
                <IndustrialCardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-industrial-accent to-industrial-accent/80 rounded-lg flex items-center justify-center">
                        <IndustrialIcon
                          icon="factory"
                          size="md"
                          className="text-industrial-background"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-industrial-foreground">
                          {machine.name}
                        </h3>{' '}
                        <p className="text-sm text-industrial-muted-foreground flex items-center gap-2">
                          <IndustrialIcon icon="wrench" size="sm" />
                          {machine.type}
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 text-industrial-muted-foreground" />
                          {machine.location}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={machine.available ? 'default' : 'secondary'}
                      className={
                        machine.available
                          ? 'bg-industrial-accent text-industrial-background'
                          : 'bg-industrial-muted text-industrial-muted-foreground'
                      }
                    >
                      {machine.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            )}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <IndustrialCard className="border-industrial-primary/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {applications.length}
                    </p>{' '}
                  </div>
                  <Users className="h-8 w-8 text-industrial-primary" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-industrial-secondary/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        applications.filter((app) => app.status === 'pending')
                          .length
                      }
                    </p>{' '}
                  </div>
                  <Clock className="h-8 w-8 text-gray-600" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-industrial-accent/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {
                        applications.filter((app) => app.status === 'approved')
                          .length
                      }
                    </p>{' '}
                  </div>
                  <CheckCircle className="h-8 w-8 text-industrial-accent" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-red-500/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-500">
                      {
                        applications.filter((app) => app.status === 'rejected')
                          .length
                      }
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <IndustrialInput
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="pending"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="approved"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Approved
                    </SelectItem>
                    <SelectItem
                      value="rejected"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Rejected
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px] bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      All Types
                    </SelectItem>
                    <SelectItem
                      value="worker"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Workers
                    </SelectItem>
                    <SelectItem
                      value="startup"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Startups
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={fetchMachineAndApplications}
              variant="outline"
              className="border-industrial-border hover:bg-industrial-muted"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>

          {/* Applications List */}
          <motion.div variants={itemVariants}>
            <IndustrialCard>
              <IndustrialCardHeader>
                <IndustrialCardTitle>Applications</IndustrialCardTitle>
                <IndustrialCardDescription>
                  Review and manage applications for this machine
                </IndustrialCardDescription>
              </IndustrialCardHeader>
              <IndustrialCardContent>
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-industrial-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-industrial-foreground mb-2">
                      {applications.length === 0
                        ? 'No applications yet'
                        : 'No matches found'}
                    </h3>
                    <p className="text-industrial-muted-foreground">
                      {applications.length === 0
                        ? 'Applications will appear here when workers or startups apply for this machine'
                        : 'Try adjusting your search or filter criteria'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      const statusColor = getStatusColor(application.status);

                      return (
                        <motion.div
                          key={application.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-industrial-border rounded-lg p-4 hover:bg-industrial-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {' '}
                              <div className="h-12 w-12 bg-gradient-to-br from-industrial-primary to-industrial-primary/80 rounded-full flex items-center justify-center">
                                {application.applicantType === 'worker' ? (
                                  <User className="h-6 w-6 text-industrial-background" />
                                ) : (
                                  <Building2 className="h-6 w-6 text-industrial-background" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-industrial-foreground">
                                    {application.applicantType === 'worker'
                                      ? 'Worker'
                                      : 'Startup'}{' '}
                                    Application
                                  </h4>
                                  <Badge
                                    variant={getStatusBadgeVariant(
                                      application.status
                                    )}
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {application.status
                                      .charAt(0)
                                      .toUpperCase() +
                                      application.status.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-industrial-muted-foreground">
                                  Applied on{' '}
                                  {new Date(
                                    application.appliedAt
                                  ).toLocaleDateString()}
                                </p>
                                {application.requestedStartDate && (
                                  <p className="text-sm text-industrial-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3" />
                                    Requested:{' '}
                                    {new Date(
                                      application.requestedStartDate
                                    ).toLocaleDateString()}
                                    {application.requestedEndDate &&
                                      ` - ${new Date(application.requestedEndDate).toLocaleDateString()}`}
                                  </p>
                                )}
                              </div>
                            </div>

                            {application.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application,
                                      'approve'
                                    )
                                  }
                                  className="bg-industrial-accent hover:bg-industrial-accent/90 text-industrial-background"
                                  disabled={
                                    processingApplication === application.id
                                  }
                                >
                                  {processingApplication === application.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application,
                                      'reject'
                                    )
                                  }
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                  disabled={
                                    processingApplication === application.id
                                  }
                                >
                                  {processingApplication === application.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </motion.div>
      </IndustrialContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, application: null, action: null })
        }
      >
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            {' '}
            <DialogTitle className="flex items-center gap-2 text-industrial-foreground">
              {confirmDialog.action === 'approve' ? (
                <CheckCircle className="h-6 w-6 text-industrial-accent" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}{' '}
              Application
            </DialogTitle>
            <DialogDescription className="text-industrial-muted-foreground">
              Are you sure you want to {confirmDialog.action} this application
              from{' '}
              {confirmDialog.application?.applicantType === 'worker'
                ? 'worker'
                : 'startup'}
              ?
              {confirmDialog.action === 'reject' &&
                ' This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({
                  open: false,
                  application: null,
                  action: null,
                })
              }
              disabled={processingApplication !== null}
              className="border-industrial-border hover:bg-industrial-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApplicationAction}
              disabled={processingApplication !== null}
              className={
                confirmDialog.action === 'approve'
                  ? 'bg-industrial-accent hover:bg-industrial-accent/90 text-industrial-background'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              {processingApplication ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {confirmDialog.action === 'approve'
                    ? 'Approving...'
                    : 'Rejecting...'}
                </>
              ) : (
                <>
                  {confirmDialog.action === 'approve' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IndustrialLayout>
  );
}

export default withAuth(MachineApplicationsPage, {
  allowedUserTypes: [UserType.MANUFACTURER],
});

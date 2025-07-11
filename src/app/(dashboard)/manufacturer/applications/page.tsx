'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import { useApplicationsStore, useAuthStore } from '@/lib/store';
import { MachineApplication, UserType } from '@/lib/types';
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

function AllApplicationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [applications, setApplications] = useState<MachineApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    MachineApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    application: MachineApplication | null;
    action: 'approve' | 'reject' | null;
  }>({
    open: false,
    application: null,
    action: null,
  });

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await manufacturerAPI.getMachineApplications();

      // Handle different possible response structures
      let applicationsData: MachineApplication[] = [];

      if (Array.isArray(response)) {
        // Direct array response
        applicationsData = response;
      } else if (response && typeof response === 'object') {
        // Object response - check common keys
        applicationsData =
          (response as any).Applications ||
          (response as any).applications ||
          (response as any).data ||
          [];
      }

      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
      // Set empty array on error to prevent filter errors
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    let filtered = Array.isArray(applications) ? [...applications] : [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.machine?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicantType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((app) => app.applicantType === typeFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, typeFilter]);

  const handleActionClick = (
    application: MachineApplication,
    action: 'approve' | 'reject'
  ) => {
    setConfirmDialog({
      open: true,
      application,
      action,
    });
  };

  const confirmAction = async () => {
    const { application, action } = confirmDialog;
    if (!application || !action) return;

    setUpdating(application._id || application.id);
    try {
      await manufacturerAPI.updateApplicationStatus(
        application._id || application.id,
        action === 'approve' ? 'approved' : 'rejected'
      );

      toast({
        title: 'Success',
        description: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
      });

      // Refresh applications
      fetchApplications();
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || `Failed to ${action} application`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
      setConfirmDialog({ open: false, application: null, action: null });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
    }
  };

  const getApplicantIcon = (type: string) => {
    return type === 'worker' ? (
      <User className="h-4 w-4" />
    ) : (
      <Building2 className="h-4 w-4" />
    );
  };

  const stats = {
    total: Array.isArray(applications) ? applications.length : 0,
    pending: Array.isArray(applications)
      ? applications.filter((app) => app.status === 'pending').length
      : 0,
    approved: Array.isArray(applications)
      ? applications.filter((app) => app.status === 'approved').length
      : 0,
    rejected: Array.isArray(applications)
      ? applications.filter((app) => app.status === 'rejected').length
      : 0,
  };

  if (loading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
          <div className="flex items-center space-x-4 mb-8">
            <IndustrialIcon icon="factory" size="lg" />
            <div>
              <IndustrialHeader level={1}>All Applications</IndustrialHeader>
              <p className="text-gray-600 mt-2">
                Manage all machine applications from workers and startups
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <IndustrialCard key={index}>
                <IndustrialCardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 bg-gray-200 mb-2" />
                  <Skeleton className="h-8 w-1/2 bg-gray-200" />
                </IndustrialCardContent>
              </IndustrialCard>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full bg-gray-200" />
            ))}
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <IndustrialIcon
                    icon="factory"
                    size="lg"
                    className="text-blue-600"
                  />
                  <div>
                    <IndustrialHeader level={1} className="text-gray-800">
                      All Applications
                    </IndustrialHeader>
                    <p className="text-gray-600 mt-2">
                      Manage all machine applications from workers and startups
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={fetchApplications}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <IndustrialCard className="border-blue-200">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.total}
                    </p>
                  </div>
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-yellow-200">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-emerald-200">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats.approved}
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-red-200">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.rejected}
                    </p>
                  </div>
                  <XCircle className="h-6 w-6 text-red-600" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <IndustrialInput
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
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
          </motion.div>

          {/* Applications Table */}
          <motion.div variants={itemVariants}>
            <IndustrialCard>
              <IndustrialCardContent className="p-0">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {applications.length === 0
                        ? 'No applications yet'
                        : 'No matches found'}
                    </h3>
                    <p className="text-gray-600">
                      {applications.length === 0
                        ? 'Applications will appear here once workers or startups apply for your machines'
                        : 'Try adjusting your search or filter criteria'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-gray-700">
                          Applicant
                        </TableHead>
                        <TableHead className="text-gray-700">Machine</TableHead>
                        <TableHead className="text-gray-700">
                          Applied Date
                        </TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                        <TableHead className="text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {filteredApplications.map((application) => (
                          <motion.tr
                            key={application._id || application.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {getApplicantIcon(
                                      application.applicantType
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {application.applicantType === 'worker'
                                      ? 'Worker'
                                      : 'Startup'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    ID: {application.applicantId}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-gray-800">
                                {application.machine?.name || 'Unknown Machine'}
                              </div>
                              <div className="text-sm text-gray-600">
                                {application.machine?.type || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-800">
                                {new Date(
                                  application.appliedAt
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(
                                  application.appliedAt
                                ).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(application.status)}
                            </TableCell>
                            <TableCell>
                              {application.status === 'pending' ? (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() =>
                                      handleActionClick(application, 'approve')
                                    }
                                    disabled={
                                      updating ===
                                      (application._id || application.id)
                                    }
                                  >
                                    {updating ===
                                    (application._id || application.id) ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() =>
                                      handleActionClick(application, 'reject')
                                    }
                                    disabled={
                                      updating ===
                                      (application._id || application.id)
                                    }
                                  >
                                    {updating ===
                                    (application._id || application.id) ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <XCircle className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {application.status === 'approved'
                                    ? 'Approved'
                                    : 'Rejected'}
                                </span>
                              )}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                )}
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </motion.div>
      </IndustrialContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Confirm Action
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to {confirmDialog.action} this application
              from {confirmDialog.application?.applicantType} for machine "
              {confirmDialog.application?.machine?.name}"? This action cannot be
              undone.
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
              disabled={updating !== null}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={updating !== null}
              className={
                confirmDialog.action === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
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

export default withAuth(AllApplicationsPage, {
  allowedUserTypes: [UserType.MANUFACTURER],
});

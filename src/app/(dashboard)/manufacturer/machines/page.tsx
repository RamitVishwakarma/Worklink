'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { IndustrialCheckbox } from '@/components/ui/industrial-checkbox';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { useMachinesStore } from '@/lib/store';
import { Machine, UserType } from '@/lib/types';
import withAuth from '@/components/auth/withAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Wrench,
  Building2,
  IndianRupee,
  Clock,
  Loader2,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Settings,
  Eye,
  Users,
  AlertTriangle,
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Form validation schema
const machineFormSchema = z.object({
  name: z.string().min(1, 'Machine name is required'),
  type: z.string().min(1, 'Machine type is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  pricePerHour: z.number().min(0, 'Price must be positive').optional(),
  specifications: z.string().optional(),
  available: z.boolean(),
});

const getMachineStatusBadge = (
  available: boolean,
  status: string = 'active'
) => {
  if (available && status === 'active') {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-700 border-green-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Available
      </Badge>
    );
  } else if (status === 'maintenance') {
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm"
      >
        <Settings className="h-3 w-3 mr-1" />
        Maintenance
      </Badge>
    );
  } else if (status === 'inactive' || !available) {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-600 border-red-200 shadow-sm"
      >
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-600 border-gray-200 shadow-sm"
      >
        <XCircle className="h-3 w-3 mr-1" />
        Unavailable
      </Badge>
    );
  }
};

function YourMachinesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const {
    userMachines: rawMachines,
    isLoading: loading,
    fetchUserMachines,
    deleteMachine,
    toggleMachineAvailability,
  } = useMachinesStore();

  // Defensive array check with useMemo to prevent infinite re-renders
  const machines = useMemo(() => {
    return Array.isArray(rawMachines) ? rawMachines : [];
  }, [rawMachines]);

  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deletingMachine, setDeletingMachine] = useState<string | null>(null);
  const [togglingMachine, setTogglingMachine] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form setup
  const form = useForm<z.infer<typeof machineFormSchema>>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      location: '',
      pricePerHour: 0,
      specifications: '',
      available: true,
    },
  });
  const handleDeleteMachine = async (machine: Machine) => {
    setMachineToDelete(machine);
    setDeleteDialogOpen(true);
  };

  const handleViewMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setViewModalOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    form.reset({
      name: machine.name,
      type: machine.type,
      description: machine.description,
      location: machine.location,
      pricePerHour: machine.pricePerHour || 0,
      specifications:
        typeof machine.specifications === 'string'
          ? machine.specifications
          : '',
      available: machine.available,
    });
    setEditModalOpen(true);
  };

  const onSubmitEdit = async (values: z.infer<typeof machineFormSchema>) => {
    if (!selectedMachine) return;

    setIsUpdating(true);
    try {
      // For now, we'll use the manufacturer API directly since updateMachine might not exist
      const response = await fetch(
        `/api/manufacturer/update-machine/${selectedMachine._id || selectedMachine.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update machine');
      }

      toast({
        title: 'Success',
        description: 'Machine updated successfully!',
      });

      setEditModalOpen(false);
      setSelectedMachine(null);
      form.reset();

      // Refresh machines list
      await fetchUserMachines();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update machine',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteMachine = async () => {
    if (!machineToDelete) return;

    const machineId = machineToDelete._id || machineToDelete.id;
    setDeletingMachine(machineId);
    try {
      await deleteMachine(machineId);
      toast({
        title: 'Success',
        description: `Machine "${machineToDelete.name}" deleted successfully!`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to delete machine',
        variant: 'destructive',
      });
    } finally {
      setDeletingMachine(null);
      setDeleteDialogOpen(false);
      setMachineToDelete(null);
    }
  };

  const handleToggleAvailability = async (
    machineId: string,
    currentAvailability: boolean
  ) => {
    setTogglingMachine(machineId);
    try {
      await toggleMachineAvailability(machineId, !currentAvailability);
      const newStatus = !currentAvailability;

      toast({
        title: 'Success',
        description: `Machine ${newStatus ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to toggle machine availability',
        variant: 'destructive',
      });
    } finally {
      setTogglingMachine(null);
    }
  };
  useEffect(() => {
    fetchUserMachines();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let filtered = Array.isArray(machines) ? [...machines] : [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (machine) =>
          machine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === 'available') {
      filtered = filtered.filter((machine) => machine.available);
    } else if (statusFilter === 'unavailable') {
      filtered = filtered.filter((machine) => !machine.available);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((machine) =>
        machine.type?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredMachines(filtered);
  }, [machines, searchTerm, statusFilter, typeFilter]);

  const machineTypes = Array.isArray(machines)
    ? Array.from(new Set(machines.map((m) => m.type).filter(Boolean)))
    : [];

  if (loading) {
    return (
      <IndustrialLayout>
        {' '}
        <IndustrialContainer>
          <div className="flex items-center space-x-4 mb-8">
            <IndustrialIcon icon="wrench" size="lg" />
            <div>
              <IndustrialHeader level={1}>Your Machines</IndustrialHeader>
              <p className="text-gray-600 mt-2">
                Manage and monitor your industrial equipment
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <IndustrialCard key={index}>
                <IndustrialCardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                </IndustrialCardHeader>
                <IndustrialCardContent>
                  <Skeleton className="h-20 w-full bg-gray-200" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-20 bg-gray-200" />
                    <Skeleton className="h-8 w-20 bg-gray-200" />
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
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
          {/* Header */}{' '}
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-4 mb-8">
              <IndustrialIcon icon="wrench" size="lg" />
              <div>
                <IndustrialHeader level={1}>Your Machines</IndustrialHeader>
                <p className="text-gray-600 mt-2">
                  Manage and monitor your industrial equipment
                </p>
              </div>
            </div>
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
                    <p className="text-sm text-gray-600">Total Machines</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {machines.length}
                    </p>
                  </div>{' '}
                  <IndustrialIcon
                    icon="wrench"
                    className="text-industrial-primary"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-industrial-accent/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {Array.isArray(machines)
                        ? machines.filter((m) => m.available).length
                        : 0}
                    </p>
                  </div>{' '}
                  <IndustrialIcon
                    icon="gear"
                    className="text-industrial-accent"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-red-500/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-red-500">
                      {Array.isArray(machines)
                        ? machines.filter(
                            (m) => !m.available || m.status === 'inactive'
                          ).length
                        : 0}
                    </p>
                  </div>
                  <IndustrialIcon icon="gear" className="text-red-500" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-industrial-secondary/20">
              <IndustrialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Machine Types</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {machineTypes.length}
                    </p>
                  </div>{' '}
                  <IndustrialIcon icon="gear" className="text-gray-600" />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
          {/* Actions & Filters */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-industrial-muted-foreground" />
                <IndustrialInput
                  placeholder="Search machines..."
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
                      value="available"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Available
                    </SelectItem>
                    <SelectItem
                      value="unavailable"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Inactive
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
                    {Array.isArray(machineTypes) &&
                      machineTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type.toLowerCase()}
                          className="text-gray-900 hover:bg-gray-50"
                        >
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => router.push('/manufacturer/add-machine')}
              className="bg-industrial-accent hover:bg-industrial-accent/90 text-industrial-background"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Machine
            </Button>
          </motion.div>
          {/* Machines Grid */}
          <motion.div variants={itemVariants}>
            {filteredMachines.length === 0 ? (
              <IndustrialCard className="text-center py-12">
                <IndustrialCardContent>
                  <div className="flex flex-col items-center space-y-4">
                    {' '}
                    <IndustrialIcon
                      icon="wrench"
                      size="lg"
                      className="text-gray-400"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {machines.length === 0
                          ? 'No machines yet'
                          : 'No matches found'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {machines.length === 0
                          ? 'Start by adding your first industrial machine'
                          : 'Try adjusting your search or filter criteria'}
                      </p>
                      {machines.length === 0 && (
                        <Button
                          onClick={() =>
                            router.push('/manufacturer/add-machine')
                          }
                          className="bg-industrial-accent hover:bg-industrial-accent/90 text-industrial-background"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Machine
                        </Button>
                      )}
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(filteredMachines) &&
                    filteredMachines.map((machine) => (
                      <motion.div
                        key={machine._id || machine.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                      >
                        <IndustrialCard className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 bg-gradient-to-br from-industrial-background to-industrial-muted/5 opacity-50" />
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-industrial-primary/10 to-transparent" />

                          <div className="relative">
                            <IndustrialCardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <IndustrialCardTitle className="text-lg group-hover:text-industrial-primary transition-colors">
                                    {machine.name}
                                  </IndustrialCardTitle>
                                  <IndustrialCardDescription className="flex items-center gap-1 mt-1">
                                    <IndustrialIcon icon="wrench" size="sm" />
                                    {machine.type}
                                  </IndustrialCardDescription>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-industrial-muted"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleViewMachine(machine)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEditMachine(machine)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Machine
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/manufacturer/machines/${machine._id || machine.id}/applications`
                                        )
                                      }
                                    >
                                      <Users className="h-4 w-4 mr-2" />
                                      View Applications
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleAvailability(
                                          machine._id || machine.id,
                                          machine.available || false
                                        )
                                      }
                                      disabled={
                                        togglingMachine ===
                                        (machine._id || machine.id)
                                      }
                                    >
                                      {togglingMachine ===
                                      (machine._id || machine.id) ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : machine.available ? (
                                        <ToggleLeft className="h-4 w-4 mr-2" />
                                      ) : (
                                        <ToggleRight className="h-4 w-4 mr-2" />
                                      )}
                                      {machine.available
                                        ? 'Deactivate'
                                        : 'Activate'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteMachine(machine)
                                      }
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      disabled={
                                        deletingMachine ===
                                        (machine._id || machine.id)
                                      }
                                    >
                                      {deletingMachine ===
                                      (machine._id || machine.id) ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                      )}
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </IndustrialCardHeader>

                            <IndustrialCardContent className="space-y-4">
                              <p className="text-sm text-industrial-gunmetal-600 line-clamp-2">
                                {machine.description}
                              </p>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  {' '}
                                  <IndustrialIcon
                                    icon="factory"
                                    size="sm"
                                    className="text-industrial-muted-foreground"
                                  />
                                  <span className="text-industrial-muted-foreground truncate">
                                    {machine.location}
                                  </span>
                                </div>

                                {machine.pricePerHour && (
                                  <div className="flex items-center gap-2">
                                    {' '}
                                    <IndustrialIcon
                                      icon="bolt"
                                      size="sm"
                                      className="text-industrial-accent"
                                    />
                                    <span className="text-industrial-accent font-medium">
                                      ₹{machine.pricePerHour}/hr
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-3">
                                  {getMachineStatusBadge(
                                    machine.available,
                                    machine.status
                                  )}

                                  {/* Toggle Switch */}
                                  <div className="flex items-center gap-2 bg-industrial-muted/20 rounded-lg px-3 py-1">
                                    <button
                                      onClick={() =>
                                        handleToggleAvailability(
                                          machine._id || machine.id,
                                          machine.available || false
                                        )
                                      }
                                      disabled={
                                        togglingMachine ===
                                        (machine._id || machine.id)
                                      }
                                      className={`
                                        relative inline-flex h-5 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 
                                        ${
                                          machine.available
                                            ? 'bg-industrial-accent border-industrial-accent'
                                            : 'bg-gray-200 border-gray-300'
                                        }
                                        ${
                                          togglingMachine ===
                                          (machine._id || machine.id)
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:shadow-md cursor-pointer'
                                        }
                                      `}
                                    >
                                      <span
                                        className={`
                                          inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                                          ${machine.available ? 'translate-x-2' : '-translate-x-2'}
                                        `}
                                      />
                                      {togglingMachine ===
                                        (machine._id || machine.id) && (
                                        <Loader2 className="absolute h-3 w-3 animate-spin text-white" />
                                      )}
                                    </button>
                                    <span className="text-xs text-industrial-muted-foreground font-medium">
                                      {togglingMachine ===
                                      (machine._id || machine.id)
                                        ? 'Updating...'
                                        : machine.available
                                          ? 'Active'
                                          : 'Inactive'}
                                    </span>
                                  </div>
                                </div>

                                <span className="text-xs text-industrial-muted-foreground">
                                  {new Date(
                                    machine.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </IndustrialCardContent>
                          </div>
                        </IndustrialCard>
                      </motion.div>
                    ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </IndustrialContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-industrial-foreground">
              <IndustrialIcon icon="gear" className="text-red-500" />
              Delete Machine
            </DialogTitle>
            <DialogDescription className="text-industrial-muted-foreground">
              Are you sure you want to delete "{machineToDelete?.name}"? This
              action cannot be undone. All associated applications will also be
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingMachine !== null}
              className="border-industrial-border hover:bg-industrial-muted"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteMachine}
              disabled={deletingMachine !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingMachine ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Machine
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Machine Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-industrial-foreground">
              <IndustrialIcon icon="gear" className="text-industrial-primary" />
              Machine Details
            </DialogTitle>
          </DialogHeader>

          {selectedMachine && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-industrial-foreground">
                    {selectedMachine.name}
                  </h3>
                  <p className="text-industrial-muted-foreground flex items-center gap-2 mt-1">
                    <IndustrialIcon icon="wrench" size="sm" />
                    {selectedMachine.type}
                  </p>
                </div>
                <div className="ml-4">
                  {getMachineStatusBadge(
                    selectedMachine.available,
                    selectedMachine.status
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-industrial-foreground">
                      Description
                    </label>
                    <p className="mt-1 text-industrial-muted-foreground">
                      {selectedMachine.description}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-industrial-foreground">
                      Location
                    </label>
                    <p className="mt-1 text-industrial-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedMachine.location}
                    </p>
                  </div>

                  {selectedMachine.pricePerHour && (
                    <div>
                      <label className="text-sm font-medium text-industrial-foreground">
                        Price per Hour
                      </label>
                      <p className="mt-1 text-industrial-accent font-medium flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />₹
                        {selectedMachine.pricePerHour}/hour
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-industrial-foreground">
                      Created
                    </label>
                    <p className="mt-1 text-industrial-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedMachine.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-industrial-foreground">
                      Status
                    </label>
                    <p className="mt-1">
                      {selectedMachine.available ? (
                        <span className="text-green-600 font-medium">
                          Available for use
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Currently unavailable
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-industrial-foreground">
                      Machine ID
                    </label>
                    <p className="mt-1 text-xs text-industrial-muted-foreground font-mono">
                      {selectedMachine._id || selectedMachine.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {selectedMachine.specifications && (
                <div>
                  <label className="text-sm font-medium text-industrial-foreground">
                    Specifications
                  </label>
                  <div className="mt-2 p-4 bg-industrial-muted/20 rounded-lg">
                    <p className="text-industrial-muted-foreground whitespace-pre-wrap">
                      {typeof selectedMachine.specifications === 'string'
                        ? selectedMachine.specifications
                        : JSON.stringify(
                            selectedMachine.specifications,
                            null,
                            2
                          )}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleEditMachine(selectedMachine);
                  }}
                  className="bg-industrial-primary hover:bg-industrial-primary/90 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Machine
                </Button>

                <Button
                  onClick={() =>
                    router.push(
                      `/manufacturer/machines/${selectedMachine._id || selectedMachine.id}/applications`
                    )
                  }
                  variant="outline"
                  className="border-industrial-border hover:bg-industrial-muted"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applications
                </Button>

                <Button
                  onClick={() => setViewModalOpen(false)}
                  variant="outline"
                  className="border-industrial-border hover:bg-industrial-muted ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Machine Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-industrial-foreground">
              <Edit className="h-5 w-5 text-industrial-primary" />
              Edit Machine
            </DialogTitle>
            <DialogDescription className="text-industrial-muted-foreground">
              Update your machine details and specifications.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Machine Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-industrial-foreground">
                        Machine Name
                      </FormLabel>
                      <FormControl>
                        <IndustrialInput
                          placeholder="Enter machine name"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Machine Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-industrial-foreground">
                        Machine Type
                      </FormLabel>
                      <FormControl>
                        <IndustrialInput
                          placeholder="e.g., CNC Machine, 3D Printer"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-industrial-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your machine and its capabilities"
                        className="bg-white min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-industrial-foreground">
                        Location
                      </FormLabel>
                      <FormControl>
                        <IndustrialInput
                          placeholder="Enter location"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price per Hour */}
                <FormField
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-industrial-foreground">
                        Price per Hour (₹)
                      </FormLabel>
                      <FormControl>
                        <IndustrialInput
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Specifications */}
              <FormField
                control={form.control}
                name="specifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-industrial-foreground">
                      Specifications
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed specifications, capabilities, and technical details"
                        className="bg-white min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-industrial-muted-foreground">
                      Include technical specifications, dimensions, power
                      requirements, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Availability */}
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-industrial-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-industrial-foreground">
                        Machine Availability
                      </FormLabel>
                      <FormDescription className="text-industrial-muted-foreground">
                        Enable this to allow workers and startups to apply for
                        machine usage.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <IndustrialCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedMachine(null);
                    form.reset();
                  }}
                  disabled={isUpdating}
                  className="border-industrial-border hover:bg-industrial-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-industrial-accent hover:bg-industrial-accent/90 text-industrial-background"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Update Machine
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </IndustrialLayout>
  );
}

export default withAuth(YourMachinesPage, {
  allowedUserTypes: [UserType.MANUFACTURER],
});

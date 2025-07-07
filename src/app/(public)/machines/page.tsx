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
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Loader2,
  Building2,
  Settings,
  CheckCircle,
  XCircle,
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

export default function MachinesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const {
    machines: rawMachines,
    isLoading: loading,
    isApplying,
    fetchMachines,
    applyToMachine,
  } = useMachinesStore();

  // Defensive array check with useMemo
  const machines = useMemo(
    () => (Array.isArray(rawMachines) ? rawMachines : []),
    [rawMachines]
  );

  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [applyingToMachine, setApplyingToMachine] = useState<string | null>(
    null
  );
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

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

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((machine) =>
        machine.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((machine) =>
        machine.type?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    // Availability filter
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(
        (machine) => machine.availability || machine.isAvailable
      );
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(
        (machine) => !(machine.availability || machine.isAvailable)
      );
    }

    setFilteredMachines(filtered);
  }, [machines, searchTerm, locationFilter, typeFilter, availabilityFilter]);

  const handleApplyToMachine = async (machine: Machine) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply for machines.',
        variant: 'destructive',
      });
      router.push('/signin');
      return;
    }

    setApplyingToMachine(machine._id || machine.id);
    try {
      await applyToMachine(machine._id || machine.id);
      toast({
        title: 'Application Submitted',
        description: `Your application for "${machine.name}" has been submitted successfully!`,
      });
    } catch (error: any) {
      toast({
        title: 'Application Failed',
        description:
          error.response?.data?.message || 'Failed to apply for machine',
        variant: 'destructive',
      });
    } finally {
      setApplyingToMachine(null);
    }
  };

  const openApplicationDialog = (machine: Machine) => {
    setSelectedMachine(machine);
    setApplicationDialogOpen(true);
  };

  const confirmApplication = () => {
    if (selectedMachine) {
      handleApplyToMachine(selectedMachine);
    }
    setApplicationDialogOpen(false);
    setSelectedMachine(null);
  };

  // Get unique values for filters
  const locations = Array.isArray(machines)
    ? Array.from(
        new Set(
          machines
            .map((m) => m.location)
            .filter(
              (location) =>
                location && typeof location === 'string' && location.trim()
            )
        )
      )
    : [];

  const types = Array.isArray(machines)
    ? Array.from(
        new Set(
          machines
            .map((m) => m.type)
            .filter((type) => type && typeof type === 'string' && type.trim())
        )
      )
    : [];

  if (loading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
          <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12 lg:mt-16">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-200 mb-2" />
                <Skeleton className="h-4 w-48 sm:w-80 bg-gray-200" />
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {[1, 2, 3, 4].map((i) => (
                <IndustrialCard key={i} className="border-gray-200">
                  <IndustrialCardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 bg-gray-200 mb-2" />
                        <Skeleton className="h-5 sm:h-6 w-6 sm:w-8 bg-gray-200" />
                      </div>
                      <Skeleton className="h-5 w-5 sm:h-8 sm:w-8 bg-gray-200 rounded flex-shrink-0" />
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              ))}
            </div>

            {/* Search and Filters Skeleton */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Skeleton className="h-9 sm:h-10 w-full sm:max-w-md bg-gray-200" />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Skeleton className="h-9 sm:h-10 w-full sm:w-[140px] bg-gray-200" />
                <Skeleton className="h-9 sm:h-10 w-full sm:w-[140px] bg-gray-200" />
                <Skeleton className="h-9 sm:h-10 w-full sm:w-[140px] bg-gray-200" />
              </div>
            </div>

            {/* Machines Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, index) => (
                <IndustrialCard
                  key={index}
                  className="h-full flex flex-col border-gray-200"
                >
                  <IndustrialCardHeader className="pb-2 sm:pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-5 sm:h-6 w-3/4 bg-gray-200 mb-2" />
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded" />
                          <Skeleton className="h-3 sm:h-4 w-1/2 bg-gray-200" />
                        </div>
                      </div>
                      <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-200 rounded-full flex-shrink-0" />
                    </div>
                  </IndustrialCardHeader>
                  <IndustrialCardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
                    <Skeleton className="h-8 sm:h-12 w-full bg-gray-200" />

                    <div className="grid grid-cols-1 gap-2 sm:gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-3/4 bg-gray-200" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-1/2 bg-gray-200" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-2/3 bg-gray-200" />
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 mt-auto">
                      <Skeleton className="h-8 sm:h-10 w-full bg-gray-200" />
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              ))}
            </div>
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
          className="space-y-4 sm:space-y-6 mt-8 sm:mt-12 lg:mt-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              <IndustrialIcon
                icon="gear"
                size="lg"
                className="text-blue-600 flex-shrink-0"
              />
              <div className="min-w-0">
                <IndustrialHeader
                  level={1}
                  className="text-xl sm:text-2xl lg:text-3xl text-gray-900 break-words"
                >
                  Browse Machines
                </IndustrialHeader>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 break-words">
                  Discover and apply for industrial equipment
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <IndustrialCard className="border-blue-200">
              <IndustrialCardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Total Machines
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900 truncate">
                      {machines.length}
                    </p>
                  </div>
                  <IndustrialIcon
                    icon="gear"
                    className="text-blue-600 flex-shrink-0"
                    size="sm"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-yellow-200">
              <IndustrialCardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Available
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-600 truncate">
                      {Array.isArray(machines)
                        ? machines.filter(
                            (m) => m.availability || m.isAvailable
                          ).length
                        : 0}
                    </p>
                  </div>
                  <IndustrialIcon
                    icon="gear"
                    className="text-yellow-600 flex-shrink-0"
                    size="sm"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-red-200">
              <IndustrialCardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      In Use
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">
                      {Array.isArray(machines)
                        ? machines.filter(
                            (m) => !(m.availability || m.isAvailable)
                          ).length
                        : 0}
                    </p>
                  </div>
                  <IndustrialIcon
                    icon="gear"
                    className="text-red-600 flex-shrink-0"
                    size="sm"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>

            <IndustrialCard className="border-gray-200">
              <IndustrialCardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Machine Types
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                      {types.length}
                    </p>
                  </div>
                  <IndustrialIcon
                    icon="gear"
                    className="text-gray-600 flex-shrink-0"
                    size="sm"
                  />
                </div>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <IndustrialInput
                  placeholder="Search machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-300 text-gray-900 text-sm">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      All Locations
                    </SelectItem>
                    {Array.isArray(locations) &&
                      locations
                        .filter((location) => location && location.trim())
                        .map((location) => (
                          <SelectItem
                            key={location}
                            value={location.toLowerCase().trim()}
                            className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                          >
                            {location}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-300 text-gray-900 text-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      All Types
                    </SelectItem>
                    {Array.isArray(types) &&
                      types
                        .filter((type) => type && type.trim())
                        .map((type) => (
                          <SelectItem
                            key={type}
                            value={type.toLowerCase().trim()}
                            className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                          >
                            {type}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>

                <Select
                  value={availabilityFilter}
                  onValueChange={setAvailabilityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-300 text-gray-900 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="available"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      Available
                    </SelectItem>
                    <SelectItem
                      value="unavailable"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      In Use
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Machines Grid */}
          <motion.div variants={itemVariants}>
            {filteredMachines.length === 0 ? (
              <IndustrialCard className="text-center py-8 sm:py-12">
                <IndustrialCardContent>
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                    <IndustrialIcon
                      icon="gear"
                      size="lg"
                      className="text-gray-400"
                    />
                    <div className="max-w-md">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {machines.length === 0
                          ? 'No machines available'
                          : 'No matches found'}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 break-words">
                        {machines.length === 0
                          ? 'Check back later for available industrial equipment'
                          : 'Try adjusting your search or filter criteria'}
                      </p>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                        <IndustrialCard className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 bg-gradient-to-br from-industrial-background to-industrial-muted/5 opacity-50" />
                          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-industrial-primary/10 to-transparent" />

                          <div className="relative flex-1 flex flex-col">
                            <IndustrialCardHeader className="pb-2 sm:pb-3">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <IndustrialCardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-colors text-gray-900 break-words">
                                    {machine.name}
                                  </IndustrialCardTitle>
                                  <IndustrialCardDescription className="flex items-center gap-1 mt-1">
                                    <IndustrialIcon
                                      icon="gear"
                                      size="sm"
                                      className="flex-shrink-0"
                                    />
                                    <span className="truncate text-xs sm:text-sm">
                                      {machine.type}
                                    </span>
                                  </IndustrialCardDescription>
                                </div>
                                <Badge
                                  variant={
                                    machine.availability || machine.isAvailable
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className={`flex-shrink-0 text-xs ${
                                    machine.availability || machine.isAvailable
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {machine.availability || machine.isAvailable
                                    ? 'Available'
                                    : 'In Use'}
                                </Badge>
                              </div>
                            </IndustrialCardHeader>

                            <IndustrialCardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                                {machine.description}
                              </p>

                              <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm flex-1">
                                <div className="flex items-center gap-2">
                                  <IndustrialIcon
                                    icon="factory"
                                    size="sm"
                                    className="text-gray-500 flex-shrink-0"
                                  />
                                  <span className="text-gray-600 truncate">
                                    {machine.location}
                                  </span>
                                </div>

                                {machine.pricePerHour && (
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-green-600 font-medium truncate">
                                      ${machine.pricePerHour}/hr
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 truncate">
                                    Listed{' '}
                                    {new Date(
                                      machine.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-3 sm:pt-4 mt-auto">
                                {machine.availability || machine.isAvailable ? (
                                  <Button
                                    onClick={() =>
                                      openApplicationDialog(machine)
                                    }
                                    disabled={
                                      applyingToMachine ===
                                      (machine._id || machine.id)
                                    }
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                                    size="sm"
                                  >
                                    {applyingToMachine ===
                                    (machine._id || machine.id) ? (
                                      <>
                                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                                        <span className="hidden sm:inline">
                                          Applying...
                                        </span>
                                        <span className="sm:hidden">...</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">
                                          Apply to Use
                                        </span>
                                        <span className="sm:hidden">Apply</span>
                                      </>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    variant="secondary"
                                    className="w-full text-xs sm:text-sm"
                                    size="sm"
                                  >
                                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                      Currently In Use
                                    </span>
                                    <span className="sm:hidden">In Use</span>
                                  </Button>
                                )}
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

      {/* Application Confirmation Dialog */}
      <Dialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      >
        <DialogContent className="bg-white border-gray-200 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
              <IndustrialIcon icon="gear" className="text-blue-600" />
              Apply for Machine
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm sm:text-base">
              Are you sure you want to apply to use "{selectedMachine?.name}"?
              The manufacturer will review your application and respond
              accordingly.
            </DialogDescription>
          </DialogHeader>

          {selectedMachine && (
            <div className="space-y-2 sm:space-y-3 py-3 sm:py-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <IndustrialIcon
                  icon="gear"
                  size="sm"
                  className="text-gray-500 flex-shrink-0"
                />
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 break-words">
                  {selectedMachine.type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <IndustrialIcon
                  icon="factory"
                  size="sm"
                  className="text-gray-500 flex-shrink-0"
                />
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900 break-words">
                  {selectedMachine.location}
                </span>
              </div>

              {selectedMachine.pricePerHour && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600">Rate:</span>
                  <span className="text-green-600 font-medium">
                    ${selectedMachine.pricePerHour}/hour
                  </span>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setApplicationDialogOpen(false)}
              className="border-industrial-border hover:bg-industrial-muted text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApplication}
              className="bg-industrial-accent hover:bg-industrial-accent/90 text-industrial-background text-sm"
            >
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IndustrialLayout>
  );
}

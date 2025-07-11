'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardDescription,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndustrialInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, useMachinesStore } from '@/lib/store';
import withAuth from '@/components/auth/withAuth';
import { Machine, UserType } from '@/lib/types';
import {
  Settings,
  MapPin,
  IndianRupee,
  Building2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Wrench,
  Calendar,
  Send,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StartupMachinesPage = () => {
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all-locations');
  const [typeFilter, setTypeFilter] = useState('all-types');
  const [availabilityFilter, setAvailabilityFilter] = useState('all-machines');

  const { toast } = useToast();
  const { user } = useAuthStore(); // Store data
  const { machines, isLoading, applyToMachine, isApplying } =
    useMachinesStore();

  // Filter machines based on search and filter criteria
  useEffect(() => {
    let filtered = machines;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter && locationFilter !== 'all-locations') {
      filtered = filtered.filter((machine) =>
        machine.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter && typeFilter !== 'all-types') {
      filtered = filtered.filter((machine) =>
        machine.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    // Availability filter
    if (availabilityFilter && availabilityFilter !== 'all-machines') {
      if (availabilityFilter === 'available') {
        filtered = filtered.filter((machine) => machine.isAvailable);
      } else if (availabilityFilter === 'unavailable') {
        filtered = filtered.filter((machine) => !machine.isAvailable);
      }
    }
    setFilteredMachines(filtered);
  }, [machines, searchTerm, locationFilter, typeFilter, availabilityFilter]);

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge
        variant="outline"
        className="text-green-600 border-green-200 bg-green-50"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="text-red-600 border-red-200 bg-red-50"
      >
        <XCircle className="h-3 w-3 mr-1" />
        Unavailable
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setTypeFilter('');
    setAvailabilityFilter('');
  };
  const uniqueLocations = [
    ...new Set(machines.map((machine) => machine.location)),
  ];
  const uniqueTypes = [...new Set(machines.map((machine) => machine.type))];
  // Handle apply to machine
  const handleApplyToMachine = async (machineId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to apply to machines.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await applyToMachine(machineId); // No user ID or type needed
      toast({
        title: 'Success',
        description: 'Successfully applied to machine!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply to machine. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>{' '}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <IndustrialCard key={i} variant="industrial">
                <IndustrialCardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </IndustrialCardHeader>
                <IndustrialCardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <IndustrialLayout>
      <IndustrialContainer className="py-8">
        <IndustrialHeader className="mb-8">
          <div className="flex items-center gap-3">
            <IndustrialIcon
              icon="factory"
              size="lg"
              className="text-industrial-accent"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Available Machines
              </h1>
              <p className="text-gray-600">
                Browse and apply to use manufacturing machines from verified
                manufacturers.
              </p>
            </div>
          </div>
        </IndustrialHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Filters */}
          <IndustrialCard variant="industrial">
            <IndustrialCardHeader>
              <IndustrialCardTitle className="flex items-center gap-2">
                <IndustrialIcon icon="gear" size="sm" />
                Filters
              </IndustrialCardTitle>
            </IndustrialCardHeader>
            <IndustrialCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <IndustrialInput
                      id="search"
                      placeholder="Search machines..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchTerm(e.target.value)
                      }
                      className="pl-10"
                      variant="industrial"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">
                        All locations
                      </SelectItem>
                      {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Machine Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All types</SelectItem>
                      {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-machines">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>{' '}
              {(searchTerm ||
                locationFilter ||
                typeFilter ||
                availabilityFilter) && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </IndustrialCardContent>
          </IndustrialCard>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {filteredMachines.length} machine
                {filteredMachines.length !== 1 ? 's' : ''} found
              </h2>
            </div>{' '}
            {filteredMachines.length === 0 ? (
              <IndustrialCard variant="industrial">
                <IndustrialCardContent className="flex flex-col items-center justify-center py-16">
                  <IndustrialIcon
                    icon="wrench"
                    size="xl"
                    className="text-gray-600 mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    No machines found
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    No machines match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </IndustrialCardContent>
              </IndustrialCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachines.map((machine, index) => (
                  <motion.div
                    key={machine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <IndustrialCard className="h-full" variant="industrial">
                      <IndustrialCardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <IndustrialCardTitle className="text-lg">
                              {machine.name}
                            </IndustrialCardTitle>{' '}
                            <IndustrialCardDescription className="flex items-center gap-1">
                              <IndustrialIcon icon="cog" size="sm" />
                              {machine.type}
                            </IndustrialCardDescription>
                          </div>
                          {getAvailabilityBadge(machine.isAvailable || false)}
                        </div>
                      </IndustrialCardHeader>
                      <IndustrialCardContent className="space-y-4">
                        <p className="text-sm text-industrial-gunmetal-600 line-clamp-3">
                          {machine.description}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4" />
                            <span>Manufacturer ID: {machine.manufacturer}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{machine.location}</span>
                          </div>

                          {machine.pricePerHour && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <IndianRupee className="h-4 w-4" />
                              <span>₹{machine.pricePerHour}/hour</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Listed{' '}
                              {new Date(machine.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {machine.specifications &&
                          Object.keys(machine.specifications).length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">
                                Specifications:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(machine.specifications)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant="industrial-secondary"
                                      className="text-xs"
                                    >
                                      {key}: {String(value)}
                                    </Badge>
                                  ))}
                                {Object.keys(machine.specifications).length >
                                  3 && (
                                  <Badge
                                    variant="industrial-secondary"
                                    className="text-xs"
                                  >
                                    +
                                    {Object.keys(machine.specifications)
                                      .length - 3}{' '}
                                    more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                        {machine.hasApplied ? (
                          <Button
                            className="w-full"
                            variant="industrial-secondary"
                            disabled
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Application Submitted
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            variant="industrial-primary"
                            onClick={() => handleApplyToMachine(machine._id)}
                            disabled={!machine.isAvailable || isApplying}
                          >
                            {isApplying ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Apply to Use
                              </>
                            )}
                          </Button>
                        )}
                      </IndustrialCardContent>
                    </IndustrialCard>
                  </motion.div>
                ))}
              </div>
            )}{' '}
          </div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
};

export default withAuth(StartupMachinesPage, {
  allowedUserTypes: [UserType.STARTUP],
});

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndustrialBadge } from '@/components/ui/industrial-badge';
import { IndustrialInput } from '@/components/ui/industrial-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialDashboardGrid } from '@/components/ui/industrial-grid-system';
import { IndustrialAccessibilityProvider } from '@/components/ui/industrial-accessibility-enhanced';
import designTokens from '@/components/ui/industrial-design-tokens';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { useGigsStore } from '@/lib/store';
import { useGigOperations } from '@/hooks/useApiIntegration';
import { Gig } from '@/lib/types';
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Building,
  Loader2,
  Factory,
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export default function WorkerBrowseGigsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { gigs, isLoading: gigsLoading, fetchGigs } = useGigsStore();
  const { handleApplyToGig: applyToGigOperation } = useGigOperations();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  // Fetch gigs on component mount
  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Ensure gigs is always an array
  const gigsArray = Array.isArray(gigs) ? gigs : [];

  // Filter and sort gigs
  const filteredGigs = gigsArray
    .filter((gig: Gig) => {
      const matchesSearch = gig.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLocation =
        locationFilter === 'all' ||
        (gig.location &&
          gig.location.toLowerCase().includes(locationFilter.toLowerCase()));
      const matchesExperience =
        experienceFilter === 'all' ||
        (gig.description &&
          gig.description
            .toLowerCase()
            .includes(experienceFilter.toLowerCase()));

      return matchesSearch && matchesLocation && matchesExperience;
    })
    .sort((a: Gig, b: Gig) => {
      switch (sortBy) {
        case 'salary-high':
          return (b.salary || 0) - (a.salary || 0);
        case 'salary-low':
          return (a.salary || 0) - (b.salary || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'latest':
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

  const handleApplyToGig = async (gigId: string) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply for gigs.',
        variant: 'destructive',
      });
      return;
    }

    setApplyingTo(gigId);
    try {
      await applyToGigOperation(gigId);
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully!',
      });
    } catch (error) {
      toast({
        title: 'Application Failed',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setApplyingTo(null);
    }
  };

  if (gigsLoading) {
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

  return (
    <IndustrialLayout>
      <IndustrialContainer>
        <IndustrialAccessibilityProvider>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
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
                      icon="factory"
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
                        Browse Gigs
                      </IndustrialHeader>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm sm:text-base lg:text-lg text-industrial-gunmetal-600 mt-1 sm:mt-2"
                    >
                      Discover and apply to manufacturing opportunities
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div variants={itemVariants}>
              <IndustrialCard
                variant="industrial"
                className="relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="h-full w-full" />
                </div>

                <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                  <IndustrialCardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20">
                      <Search className="h-4 w-4 text-industrial-accent" />
                    </div>
                    <span className="text-industrial-gunmetal-800 font-semibold">
                      Search & Filter
                    </span>
                  </IndustrialCardTitle>
                </IndustrialCardHeader>

                <IndustrialCardContent className="relative max-sm:p-2 p-6">
                  <IndustrialDashboardGrid
                    layout="default"
                    pattern="none"
                    gap={designTokens.spacing['4']}
                    className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-industrial-gunmetal-700">
                        Search Gigs
                      </label>
                      <IndustrialInput
                        placeholder="Search by title, skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-industrial-gunmetal-700">
                        Location
                      </label>
                      <Select
                        value={locationFilter}
                        onValueChange={setLocationFilter}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-industrial-gunmetal-700">
                        Experience Level
                      </label>
                      <Select
                        value={experienceFilter}
                        onValueChange={setExperienceFilter}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-industrial-gunmetal-700">
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">Latest</SelectItem>
                          <SelectItem value="salary-high">
                            Salary: High to Low
                          </SelectItem>
                          <SelectItem value="salary-low">
                            Salary: Low to High
                          </SelectItem>
                          <SelectItem value="title">Title A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </IndustrialDashboardGrid>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>

            {/* Results Section */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-industrial-gunmetal-600"
                >
                  Showing {filteredGigs.length} gig
                  {filteredGigs.length !== 1 ? 's' : ''}
                </motion.p>
              </div>

              <IndustrialDashboardGrid
                layout="default"
                gap={designTokens.spacing['6']}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredGigs.map((gig: Gig) => (
                  <motion.div
                    key={gig.id}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <IndustrialCard
                      variant="industrial"
                      className="relative overflow-hidden h-full"
                    >
                      {/* Industrial pattern overlay */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="h-full w-full" />
                      </div>

                      <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                        <IndustrialCardTitle className="flex items-center gap-3">
                          <div className="p-2 bg-industrial-navy-100 rounded-lg border border-industrial-navy-200">
                            <Factory className="h-4 w-4 text-industrial-navy-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-industrial-gunmetal-800 line-clamp-2">
                              {gig.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <IndustrialBadge variant="secondary">
                                {gig.jobType}
                              </IndustrialBadge>
                            </div>
                          </div>
                        </IndustrialCardTitle>
                      </IndustrialCardHeader>

                      <IndustrialCardContent className="relative p-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-2 text-sm text-industrial-gunmetal-600">
                            <Building className="h-4 w-4" />
                            <span>{gig.company}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-industrial-gunmetal-600">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {gig.location || 'Location not specified'}
                            </span>
                          </div>

                          {gig.salary && (
                            <div className="flex items-center gap-2 text-sm text-industrial-gunmetal-600">
                              <DollarSign className="h-4 w-4" />
                              <span>₹{gig.salary.toLocaleString()}/month</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-industrial-gunmetal-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Posted{' '}
                              {new Date(
                                gig.createdAt || ''
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          {gig.description && (
                            <p className="text-sm text-industrial-gunmetal-600 line-clamp-3">
                              {gig.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-industrial-border/50">
                          <Button
                            onClick={() => handleApplyToGig(gig.id!)}
                            disabled={applyingTo === gig.id}
                            variant="industrial-accent"
                            className="w-full"
                          >
                            {applyingTo === gig.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'linear',
                                  }}
                                  className="mr-2"
                                >
                                  <Loader2 className="h-4 w-4" />
                                </motion.div>
                                Applying...
                              </>
                            ) : (
                              <>
                                <Briefcase className="h-4 w-4 mr-2" />
                                Apply Now
                              </>
                            )}
                          </Button>
                        </div>
                      </IndustrialCardContent>
                    </IndustrialCard>
                  </motion.div>
                ))}
              </IndustrialDashboardGrid>

              {filteredGigs.length === 0 && !gigsLoading && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <IndustrialIcon
                    icon="factory"
                    size="xl"
                    className="text-industrial-gunmetal-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-industrial-gunmetal-800 mb-2">
                    No gigs found
                  </h3>
                  <p className="text-industrial-gunmetal-600">
                    Try adjusting your search criteria or check back later for
                    new opportunities.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </IndustrialAccessibilityProvider>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

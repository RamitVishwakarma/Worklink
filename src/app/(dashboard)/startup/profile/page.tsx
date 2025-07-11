'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardDescription,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndustrialInput } from '@/components/ui/industrial-input';
import { IndustrialTextarea } from '@/components/ui/industrial-textarea';
import { IndustrialBadge } from '@/components/ui/industrial-badge';
import { Label } from '@/components/ui/label';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialGrid } from '@/components/ui/industrial-grid-system';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { IndustrialAccessibilityProvider } from '@/components/ui/industrial-accessibility-enhanced';
import designTokens from '@/components/ui/industrial-design-tokens';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { useProfilesStore } from '@/lib/store';
import withAuth from '@/components/auth/withAuth';
import { UserType, StartupProfile } from '@/lib/types';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Edit3,
  Save,
  X,
  Globe,
  Briefcase,
  Factory,
  Award,
  Shield,
  Loader2,
  TrendingUp,
  Target,
  IndianRupee,
} from 'lucide-react';

// Enhanced animation variants with industrial precision
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.0,
      ease: [0.25, 0.46, 0.45, 0.94], // Industrial precision easing
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 20, rotateY: 5 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.02,
    y: -8,
    rotateX: -2,
    boxShadow: '0 25px 30px -5px rgba(44, 62, 80, 0.15)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Enhanced 3D metal card variant for premium feel
const metalCardVariants = {
  hidden: { opacity: 0, scale: 0.9, rotateY: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 1.0,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.03,
    y: -6,
    rotateY: 2,
    rotateX: -1,
    boxShadow: '0 20px 25px -5px rgba(44, 62, 80, 0.2)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

function StartupProfilePage() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StartupProfile>>({});

  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const {
    currentProfile,
    isLoading,
    isUpdating,
    fetchCurrentUserProfile,
    updateCurrentUserProfile,
  } = useProfilesStore();

  const profile = currentProfile as StartupProfile | null;

  const fetchProfile = async () => {
    try {
      await fetchCurrentUserProfile(UserType.STARTUP);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch profile',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      // Ensure our formData has both email and companyEmail set if either exists
      const dataToUpdate = {
        ...formData,
      };

      const updatedProfile = (await updateCurrentUserProfile(
        UserType.STARTUP,
        dataToUpdate
      )) as StartupProfile;

      setEditing(false);

      // Update auth store with new profile data
      updateUser({
        ...user,
        companyName: updatedProfile.companyName,
        email: updatedProfile.email,
        ...(updatedProfile.email
          ? ({ companyEmail: updatedProfile.email } as any)
          : {}),
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  const handleInputChange = (
    field: keyof StartupProfile,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Memoize the fetchProfile function to avoid recreating it on each render
  const memoizedFetchProfile = useCallback(fetchProfile, [
    fetchCurrentUserProfile,
    toast,
  ]);

  useEffect(() => {
    memoizedFetchProfile();
  }, [memoizedFetchProfile]);

  useEffect(() => {
    if (profile) {
      // Initialize form data from profile
      setFormData(profile);
    } else if (user) {
      // If profile data is not available but user data exists in auth store,
      // initialize form data from local storage user data
      const initialData: Partial<StartupProfile> = {
        companyName: user.companyName || '',
        // Check for both email and companyEmail field in user data
        email: user.email || (user as any).companyEmail || '',
        // Map workSector to industry if it exists in user data
        industry: (user as any).workSector || (user as any).industry || '',
      };
      setFormData(initialData);
    }
  }, [profile, user]);

  // Enhanced loading state with industrial design
  if (isLoading) {
    return (
      <IndustrialAccessibilityProvider>
        <IndustrialLayout>
          <IndustrialContainer>
            <div className="flex items-center justify-center min-h-[500px]">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                {/* Outer rotating ring with industrial styling */}
                <motion.div
                  className="absolute inset-0 border-4 border-industrial-accent/30 rounded-full w-20 h-20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                {/* Middle ring */}
                <motion.div
                  className="absolute inset-2 border-2 border-industrial-safety-400/40 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                {/* Inner gear with factory icon */}
                <div className="relative p-4 bg-industrial-gunmetal-100 rounded-full border-2 border-industrial-accent/50 w-20 h-20 flex items-center justify-center">
                  <IndustrialIcon
                    icon="factory"
                    size="md"
                    className="text-industrial-accent"
                  />
                </div>
              </motion.div>
            </div>
          </IndustrialContainer>
        </IndustrialLayout>
      </IndustrialAccessibilityProvider>
    );
  }

  return (
    <IndustrialAccessibilityProvider>
      <IndustrialLayout>
        <IndustrialContainer>
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Header with 3D Industrial Elements */}
            <motion.div variants={itemVariants} className="relative">
              {/* Animated metal accent bar with shimmer effect */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-industrial-accent via-industrial-safety-400 to-industrial-accent rounded-full"
              >
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 2,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </motion.div>

              {/* Responsive header with flex-direction changes for mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 gap-4">
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  {/* Enhanced 3D Factory Icon - Optimized for mobile */}
                  <motion.div
                    whileHover={{
                      rotateY: 180,
                      scale: 1.15,
                      rotateX: 10,
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="relative hidden sm:block"
                  >
                    <motion.div
                      animate={{
                        rotateZ: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="p-5 bg-gradient-to-br from-industrial-accent/25 to-industrial-accent/10 rounded-2xl border-2 border-industrial-accent/40 shadow-xl"
                    >
                      <IndustrialIcon
                        icon="factory"
                        size="xl"
                        className="text-industrial-accent drop-shadow-lg"
                      />
                    </motion.div>

                    {/* Industrial glow effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-industrial-accent/30 to-transparent rounded-2xl blur-xl -z-10" />
                  </motion.div>

                  {/* Smaller icon for mobile */}
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="p-3 bg-gradient-to-br from-industrial-accent/25 to-industrial-accent/10 rounded-xl border-2 border-industrial-accent/40 sm:hidden"
                  >
                    <IndustrialIcon
                      icon="factory"
                      size="sm"
                      className="text-industrial-accent drop-shadow-lg"
                    />
                  </motion.div>

                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-industrial-accent to-gray-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                        Company Profile
                      </h1>
                      <p className="text-gray-600 text-sm sm:text-lg">
                        Manage your industrial company information
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Enhanced Action Buttons - Mobile optimized */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end"
                >
                  {editing ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 sm:flex-none"
                      >
                        <Button
                          variant="industrial-outline"
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="hover:bg-industrial-muted/50 transition-all duration-300 w-full sm:w-auto"
                          size="sm"
                          title="Cancel"
                        >
                          <X className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Cancel</span>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 sm:flex-none"
                      >
                        <Button
                          onClick={handleSave}
                          disabled={isUpdating}
                          variant="industrial-accent"
                          className="shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                          size="sm"
                          title={isUpdating ? 'Saving...' : 'Save Changes'}
                        >
                          {isUpdating ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="sm:mr-2"
                              >
                                <Loader2 className="h-4 w-4" />
                              </motion.div>
                              <span className="hidden sm:inline">
                                Saving Changes...
                              </span>
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">
                                Save Changes
                              </span>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        onClick={() => setEditing(true)}
                        variant="industrial-accent"
                        className="shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                        size="sm"
                        title="Edit Profile"
                      >
                        <Edit3 className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit Profile</span>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Main Content with Industrial Grid System - Mobile Optimized */}
            <IndustrialGrid
              columns={{ default: 1, lg: 3 }}
              gap="4 md:8"
              variant="industrial"
              className="w-full"
            >
              {/* Enhanced Company Information Form - 2 Columns */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                variants={itemVariants}
              >
                {/* Company Profile Overview - if not editing */}
                {!editing && profile && (
                  <motion.div variants={metalCardVariants} whileHover="hover">
                    <IndustrialCard
                      variant="industrial"
                      className="relative overflow-hidden bg-gradient-to-br from-industrial-gunmetal-50 to-white border-l-4 border-l-industrial-accent"
                    >
                      {/* Industrial pattern overlay */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_#2C3E50_1px,_transparent_0)] bg-[length:24px_24px]" />
                      </div>

                      <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                        <IndustrialCardTitle className="flex items-center gap-3 text-xl">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20"
                          >
                            <IndustrialIcon
                              icon="factory"
                              size="sm"
                              className="text-industrial-accent"
                            />
                          </motion.div>
                          <span className="bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                            Company Overview
                          </span>
                        </IndustrialCardTitle>
                      </IndustrialCardHeader>

                      <IndustrialCardContent className="relative max-[425px]:p-2 p-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Company Stats */}
                          <div className="flex-1 space-y-6">
                            {/* Status Badges - Mobile Optimized */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.5,
                                type: 'spring',
                                stiffness: 200,
                              }}
                              className="flex flex-wrap items-center gap-2 sm:gap-3"
                            >
                              <IndustrialBadge
                                variant="success"
                                className="shadow-md text-xs sm:text-sm"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Active
                              </IndustrialBadge>
                              <IndustrialBadge
                                variant="secondary"
                                className="shadow-md text-xs sm:text-sm"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </IndustrialBadge>
                            </motion.div>

                            {/* Company Information Grid - Mobile Optimized */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                              <motion.div
                                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 flex-shrink-0">
                                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                                    Company Name
                                  </p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-industrial-accent transition-colors truncate">
                                    {profile.companyName ||
                                      user?.companyName ||
                                      'Not specified'}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex-shrink-0">
                                  <Factory className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                                    Industry
                                  </p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-industrial-accent transition-colors truncate">
                                    {profile.industry ||
                                      (user as any)?.workSector ||
                                      'Not specified'}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 flex-shrink-0">
                                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                                    Founded Year
                                  </p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-industrial-accent transition-colors truncate">
                                    {profile.foundedYear || 'Not specified'}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 flex-shrink-0">
                                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                                    Contact Email
                                  </p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-industrial-accent transition-colors truncate">
                                    {profile.email ||
                                      user?.email ||
                                      (user as any)?.companyEmail ||
                                      'Not specified'}
                                  </p>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </IndustrialCardContent>
                    </IndustrialCard>
                  </motion.div>
                )}

                {/* Enhanced Company Information Form */}
                <motion.div variants={metalCardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden bg-gradient-to-br from-industrial-gunmetal-50 to-white"
                  >
                    {/* Metal grid pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="h-full w-full bg-[linear-gradient(90deg,_#34495E_1px,_transparent_1px),_linear-gradient(#34495E_1px,_transparent_1px)] bg-[length:20px_20px]" />
                    </div>

                    <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                      <IndustrialCardTitle className="flex items-center gap-3 text-xl">
                        <motion.div className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20">
                          <IndustrialIcon
                            icon="gear"
                            size="sm"
                            className="text-industrial-accent"
                          />
                        </motion.div>
                        <span className="bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                          Company Information
                        </span>
                      </IndustrialCardTitle>
                      <IndustrialCardDescription className="mt-2">
                        Essential business information and contact details
                      </IndustrialCardDescription>
                    </IndustrialCardHeader>

                    <IndustrialCardContent className="relative max-[425px]:p-2 p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label
                            htmlFor="companyName"
                            className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                          >
                            <IndustrialIcon
                              icon="factory"
                              size="sm"
                              className="text-industrial-accent sm:hidden h-3 w-3"
                            />
                            <IndustrialIcon
                              icon="factory"
                              size="sm"
                              className="text-industrial-accent hidden sm:block"
                            />
                            Company Name *
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="companyName"
                              value={
                                formData.companyName || user?.companyName || ''
                              }
                              onChange={(e) =>
                                handleInputChange('companyName', e.target.value)
                              }
                              placeholder="Enter your company name"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent text-sm sm:text-base"
                            />
                          ) : (
                            <p className="p-2 sm:p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 text-sm sm:text-base">
                              {profile?.companyName ||
                                user?.companyName ||
                                'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label
                            htmlFor="industry"
                            className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                          >
                            <IndustrialIcon
                              icon="gear"
                              size="sm"
                              className="text-industrial-accent sm:hidden h-3 w-3"
                            />
                            <IndustrialIcon
                              icon="gear"
                              size="sm"
                              className="text-industrial-accent hidden sm:block"
                            />
                            Industry *
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="industry"
                              value={
                                formData.industry ||
                                (user as any)?.workSector ||
                                ''
                              }
                              onChange={(e) =>
                                handleInputChange('industry', e.target.value)
                              }
                              placeholder="e.g., Manufacturing, Technology"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent text-sm sm:text-base"
                            />
                          ) : (
                            <p className="p-2 sm:p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 text-sm sm:text-base">
                              {profile?.industry ||
                                (user as any)?.workSector ||
                                'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4 text-industrial-accent" />
                            Email Address *
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="email"
                              type="email"
                              value={
                                formData.email ||
                                user?.email ||
                                (user as any)?.companyEmail ||
                                ''
                              }
                              onChange={(e) =>
                                handleInputChange('email', e.target.value)
                              }
                              placeholder="company@example.com"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                          ) : (
                            <p className="p-3 border truncate border-gray-200 rounded-md bg-gray-50 text-gray-800">
                              {profile?.email ||
                                user?.email ||
                                (user as any)?.companyEmail ||
                                'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4 text-industrial-accent" />
                            Phone Number
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="phone"
                              value={formData.phone || ''}
                              onChange={(e) =>
                                handleInputChange('phone', e.target.value)
                              }
                              placeholder="+91 98765 43210"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                          ) : (
                            <p className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800">
                              {profile?.phone || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label
                            htmlFor="address"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4 text-industrial-accent" />
                            Company Address
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="address"
                              value={formData.address || ''}
                              onChange={(e) =>
                                handleInputChange('address', e.target.value)
                              }
                              placeholder="123 Industrial Road, Mumbai, Maharashtra 400001"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                          ) : (
                            <p className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800">
                              {profile?.address || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="website"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <Globe className="h-4 w-4 text-industrial-accent" />
                            Company Website
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="website"
                              type="url"
                              value={formData.website || ''}
                              onChange={(e) =>
                                handleInputChange('website', e.target.value)
                              }
                              placeholder="https://www.yourcompany.com"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                          ) : (
                            <p className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800">
                              {profile?.website ? (
                                <a
                                  href={profile.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-industrial-accent hover:underline"
                                >
                                  {profile.website}
                                </a>
                              ) : (
                                'Not specified'
                              )}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="foundedYear"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4 text-industrial-accent" />
                            Founded Year
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="foundedYear"
                              type="number"
                              min="1800"
                              max={new Date().getFullYear()}
                              value={formData.foundedYear || ''}
                              onChange={(e) =>
                                handleInputChange(
                                  'foundedYear',
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="2020"
                              className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                          ) : (
                            <p className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800">
                              {profile?.foundedYear || 'Not specified'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Company Description */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-gray-700 font-semibold flex items-center gap-2"
                        >
                          <IndustrialIcon
                            icon="factory"
                            size="sm"
                            className="text-industrial-accent"
                          />
                          Company Description
                        </Label>
                        {editing ? (
                          <IndustrialTextarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) =>
                              handleInputChange('description', e.target.value)
                            }
                            placeholder="Describe your company's mission, capabilities, and what makes you unique in the industrial sector..."
                            rows={4}
                            className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                          />
                        ) : (
                          <p className="p-3 border border-gray-200 rounded-md bg-gray-50 min-h-[100px] text-gray-800">
                            {profile?.description || 'No description available'}
                          </p>
                        )}
                      </div>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </motion.div>
              </motion.div>

              {/* Enhanced Profile Statistics */}
              <motion.div className="space-y-6" variants={itemVariants}>
                <motion.div variants={cardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden border-l-4 border-l-industrial-accent bg-gradient-to-br from-industrial-gunmetal-50 to-industrial-gunmetal-100"
                  >
                    {/* Industrial pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_#2C3E50_1px,_transparent_0)] bg-[length:24px_24px]" />
                    </div>

                    <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                      <IndustrialCardTitle className="flex items-center gap-3 text-xl">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20"
                        >
                          <IndustrialIcon
                            icon="gear"
                            size="sm"
                            className="text-industrial-accent"
                          />
                        </motion.div>
                        <span className="bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                          Profile Statistics
                        </span>
                      </IndustrialCardTitle>
                      <IndustrialCardDescription className="mt-2">
                        Your company metrics
                      </IndustrialCardDescription>
                    </IndustrialCardHeader>

                    <IndustrialCardContent className="relative p-6 max-[425px]:p-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Profile Complete</span>
                        <span className="font-semibold text-industrial-accent">
                          85%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Active Since</span>
                        <span className="font-semibold text-gray-800">
                          2024
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-semibold text-gray-800">
                          Today
                        </span>
                      </div>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </motion.div>

                <motion.div variants={cardVariants} whileHover="hover">
                  <IndustrialCard
                    variant="industrial"
                    className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500"
                  >
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_#1E40AF_1px,_transparent_0)] bg-[length:20px_20px]" />
                    </div>

                    <IndustrialCardHeader className="relative border-b border-blue-500/20">
                      <IndustrialCardTitle className="flex items-center gap-3 text-xl">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20"
                        >
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </motion.div>
                        <span className="text-blue-800">Quick Actions</span>
                      </IndustrialCardTitle>
                    </IndustrialCardHeader>

                    <IndustrialCardContent className="relative p-3 sm:p-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                          size="sm"
                        >
                          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="truncate">View Public Profile</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                          size="sm"
                        >
                          <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="truncate">Create New Gig</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                          size="sm"
                        >
                          <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="truncate">Manage Applications</span>
                        </Button>
                      </div>
                    </IndustrialCardContent>
                  </IndustrialCard>
                </motion.div>
              </motion.div>
            </IndustrialGrid>
          </motion.div>
        </IndustrialContainer>
      </IndustrialLayout>
    </IndustrialAccessibilityProvider>
  );
}

export default withAuth(StartupProfilePage, {
  allowedUserTypes: [UserType.STARTUP],
});

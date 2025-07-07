'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndustrialInput } from '@/components/ui/industrial-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useAuthStore, useProfilesStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import withAuth from '@/components/auth/withAuth';
import { UserType, ManufacturerProfile } from '@/lib/types';
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Save,
  X,
  Factory,
  Calendar,
  TrendingUp,
  Settings,
  Loader2,
} from 'lucide-react';

function ManufacturerProfilePage() {
  const { user, updateUser } = useAuthStore();
  const {
    currentProfile,
    isLoading,
    isUpdating,
    fetchCurrentUserProfile,
    updateCurrentUserProfile,
  } = useProfilesStore();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    contactPerson: '',
    contactEmail: '',
  });

  // Memoize the fetchProfile function
  const memoizedFetchProfile = useCallback(async () => {
    try {
      await fetchCurrentUserProfile(UserType.MANUFACTURER);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch profile',
        variant: 'destructive',
      });
    }
  }, [fetchCurrentUserProfile, toast]);

  useEffect(() => {
    if (user) {
      memoizedFetchProfile();
    }
  }, [user, memoizedFetchProfile]);

  // Update form data when profile loads
  useEffect(() => {
    if (currentProfile) {
      const manufacturerProfile = currentProfile as any; // Using any to handle different data structures
      setFormData({
        companyName: manufacturerProfile.companyName || '',
        industry:
          manufacturerProfile.industry || manufacturerProfile.workSector || '',
        description: manufacturerProfile.description || '',
        address: manufacturerProfile.address || '',
        city:
          manufacturerProfile.city || manufacturerProfile.location?.city || '',
        state:
          manufacturerProfile.state ||
          manufacturerProfile.location?.state ||
          '',
        zipCode: manufacturerProfile.zipCode || '',
        phone: manufacturerProfile.phone || '',
        website: manufacturerProfile.website || '',
        contactPerson: manufacturerProfile.contactPerson || '',
        contactEmail:
          manufacturerProfile.contactEmail ||
          manufacturerProfile.companyEmail ||
          '',
      });
    }
  }, [currentProfile]);

  // Removed the incomplete function as it's now handled by memoizedFetchProfile
  const handleSave = async () => {
    try {
      // Transform form data to match backend expected format
      const profileUpdateData = {
        companyName: formData.companyName,
        workSector: formData.industry, // Backend expects workSector
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        website: formData.website,
        contactPerson: formData.contactPerson,
        companyEmail: formData.contactEmail, // Backend expects companyEmail
      };

      const updatedProfile = await updateCurrentUserProfile(
        UserType.MANUFACTURER,
        profileUpdateData as any // Use any to handle backend data structure
      );

      // Update user in auth store if company name changed
      if (formData.companyName !== user?.companyName) {
        updateUser({ ...user!, companyName: formData.companyName });
      }

      // The store should already have the updated profile, but let's ensure form data is synced
      if (updatedProfile) {
        const manufacturerProfile = updatedProfile as any;
        setFormData({
          companyName: manufacturerProfile.companyName || '',
          industry:
            manufacturerProfile.industry ||
            manufacturerProfile.workSector ||
            '',
          description: manufacturerProfile.description || '',
          address: manufacturerProfile.address || '',
          city:
            manufacturerProfile.city ||
            manufacturerProfile.location?.city ||
            '',
          state:
            manufacturerProfile.state ||
            manufacturerProfile.location?.state ||
            '',
          zipCode: manufacturerProfile.zipCode || '',
          phone: manufacturerProfile.phone || '',
          website: manufacturerProfile.website || '',
          contactPerson: manufacturerProfile.contactPerson || '',
          contactEmail:
            manufacturerProfile.contactEmail ||
            manufacturerProfile.companyEmail ||
            '',
        });
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      setEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (currentProfile) {
      const manufacturerProfile = currentProfile as any; // Using any to handle different data structures
      setFormData({
        companyName: manufacturerProfile.companyName || '',
        industry:
          manufacturerProfile.industry || manufacturerProfile.workSector || '',
        description: manufacturerProfile.description || '',
        address: manufacturerProfile.address || '',
        city:
          manufacturerProfile.city || manufacturerProfile.location?.city || '',
        state:
          manufacturerProfile.state ||
          manufacturerProfile.location?.state ||
          '',
        zipCode: manufacturerProfile.zipCode || '',
        phone: manufacturerProfile.phone || '',
        website: manufacturerProfile.website || '',
        contactPerson: manufacturerProfile.contactPerson || '',
        contactEmail:
          manufacturerProfile.contactEmail ||
          manufacturerProfile.companyEmail ||
          '',
      });
    }
    setEditing(false);
  };
  // Advanced industrial animation system with precision easing
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
      transition: { duration: 0.3 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
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

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                {/* 3D Factory Icon with Hover Animation */}
                <motion.div
                  whileHover={{
                    rotateY: 15,
                    scale: 1.1,
                    rotateX: 5,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative flex-shrink-0 mt-1"
                >
                  <motion.div
                    animate={{
                      rotateZ: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatDelay: 3,
                    }}
                  >
                    <IndustrialIcon
                      icon="factory"
                      size="xl"
                      className="text-industrial-accent drop-shadow-lg"
                    />
                  </motion.div>

                  {/* Industrial glow effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-industrial-accent/20 to-transparent rounded-full blur-xl" />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-industrial-accent to-gray-800 bg-clip-text text-transparent mb-1 sm:mb-2 break-words">
                      Company Profile
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 break-words leading-relaxed">
                      Manage your manufacturing company information and
                      industrial operations
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {editing ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="order-2 sm:order-1"
                    >
                      <Button
                        variant="industrial-outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="order-1 sm:order-2"
                    >
                      <Button
                        variant="industrial-accent"
                        size="sm"
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="w-full shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="industrial-accent"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="w-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Metal texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-industrial-gunmetal-50/5 to-transparent pointer-events-none" />
          </motion.div>{' '}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Enhanced Profile Statistics */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 order-2 lg:order-1"
            >
              <motion.div variants={metalCardVariants} whileHover="hover">
                <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-accent bg-gradient-to-br from-industrial-gunmetal-50 to-industrial-gunmetal-100 h-full">
                  {/* Metal grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(156, 163, 175, 0.3) 1px, transparent 0),
                        linear-gradient(45deg, transparent 24%, rgba(156, 163, 175, 0.1) 25%, rgba(156, 163, 175, 0.1) 26%, transparent 27%, transparent 74%, rgba(156, 163, 175, 0.1) 75%, rgba(156, 163, 175, 0.1) 76%, transparent 77%)
                      `,
                        backgroundSize: '20px 20px, 60px 60px',
                      }}
                    />
                  </div>

                  {/* Gradient overlay for industrial feel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-industrial-accent/5 to-transparent opacity-50" />

                  <IndustrialCardHeader className="relative z-10">
                    <IndustrialCardTitle className="flex items-center gap-2 sm:gap-3">
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
                          className="text-industrial-accent"
                        />
                      </motion.div>
                      <span className="text-gray-800 font-bold text-sm sm:text-base truncate">
                        Manufacturing Statistics
                      </span>
                    </IndustrialCardTitle>
                  </IndustrialCardHeader>

                  <IndustrialCardContent className="space-y-3 sm:space-y-4 relative z-10">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-12 sm:h-16 w-full bg-gray-200" />
                        <Skeleton className="h-12 sm:h-16 w-full bg-gray-200" />
                        <Skeleton className="h-12 sm:h-16 w-full bg-gray-200" />
                      </>
                    ) : (
                      <>
                        {/* Total Machines */}
                        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-industrial-navy-50 border border-industrial-navy-200 rounded-lg">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <motion.div
                              whileHover={{ scale: 1.1, rotateY: 180 }}
                              transition={{ duration: 0.3 }}
                              className="flex-shrink-0"
                            >
                              <Factory className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-industrial-navy-500" />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                Total Machines
                              </p>
                              <p className="text-base sm:text-lg lg:text-2xl font-bold text-industrial-navy-600 truncate">
                                {(currentProfile as any)?.totalMachines || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Active Machines */}
                        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-industrial-safety-50 border border-industrial-safety-200 rounded-lg">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <motion.div className="flex-shrink-0">
                              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-industrial-safety-500" />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                Active Machines
                              </p>
                              <p className="text-base sm:text-lg lg:text-2xl font-bold text-industrial-safety-600 truncate">
                                {(currentProfile as any)?.activeMachines || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Member Since */}
                        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-industrial-accent-50 border border-industrial-accent-200 rounded-lg">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <motion.div
                              whileHover={{
                                scale: [1, 1.2, 1],
                                rotateX: [0, 360, 0],
                              }}
                              transition={{ duration: 0.6 }}
                              className="flex-shrink-0"
                            >
                              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-industrial-accent" />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                Member Since
                              </p>
                              <p className="text-base sm:text-lg lg:text-2xl font-bold text-industrial-accent truncate">
                                {currentProfile?.createdAt
                                  ? new Date(
                                      currentProfile.createdAt
                                    ).getFullYear()
                                  : new Date().getFullYear()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            </motion.div>{' '}
            {/* Enhanced Profile Information */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <motion.div variants={metalCardVariants} whileHover="hover">
                <IndustrialCard className="relative overflow-hidden border-l-4 border-l-industrial-navy-400 bg-gradient-to-br from-industrial-navy-50 to-industrial-navy-100 h-full">
                  {/* Metal grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(30, 64, 175, 0.3) 1px, transparent 0),
                        linear-gradient(45deg, transparent 24%, rgba(30, 64, 175, 0.1) 25%, rgba(30, 64, 175, 0.1) 26%, transparent 27%, transparent 74%, rgba(30, 64, 175, 0.1) 75%, rgba(30, 64, 175, 0.1) 76%, transparent 77%)
                      `,
                        backgroundSize: '20px 20px, 60px 60px',
                      }}
                    />
                  </div>

                  {/* Navy blue gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-industrial-navy-400/5 to-transparent opacity-50" />

                  <IndustrialCardHeader className="relative z-10">
                    <IndustrialCardTitle className="flex items-center gap-2 sm:gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotateY: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Building className="h-5 w-5 sm:h-6 sm:w-6 text-industrial-navy-400" />
                      </motion.div>
                      <span className="text-gray-800 font-bold text-sm sm:text-base lg:text-lg truncate">
                        Company Information
                      </span>
                    </IndustrialCardTitle>
                  </IndustrialCardHeader>

                  <IndustrialCardContent className="relative z-10">
                    {isLoading ? (
                      <div className="space-y-4 sm:space-y-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200" />
                            <Skeleton className="h-8 sm:h-10 w-full bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        {/* Company Name */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="companyName"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Company Name
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="companyName"
                              leftIcon="factory"
                              placeholder="Enter company name"
                              value={formData.companyName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  companyName: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <Building className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.companyName ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>{' '}
                        {/* Contact Person */}
                        <div>
                          <Label
                            htmlFor="contactPerson"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Contact Person
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="contactPerson"
                              leftIcon="hardhat"
                              placeholder="Enter contact person name"
                              value={formData.contactPerson}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  contactPerson: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.contactPerson ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Contact Email */}
                        <div>
                          <Label
                            htmlFor="contactEmail"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Contact Email
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="contactEmail"
                              leftIcon="circuit"
                              placeholder="Enter contact email"
                              value={formData.contactEmail}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  contactEmail: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.contactEmail ||
                                  (currentProfile as any)?.companyEmail ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Industry */}
                        <div>
                          <Label
                            htmlFor="industry"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Industry
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="industry"
                              leftIcon="factory"
                              placeholder="e.g., Manufacturing, Automotive"
                              value={formData.industry}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  industry: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <Factory className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.industry ||
                                  (currentProfile as any)?.workSector ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Phone */}
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Phone Number
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="phone"
                              leftIcon="bolt"
                              placeholder="Enter phone number"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.phone ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Website */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="website"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Website
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="website"
                              leftIcon="circuit"
                              placeholder="https://yourcompany.com"
                              value={formData.website}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  website: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.website ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Address */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="address"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Street Address
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="address"
                              leftIcon="wrench"
                              placeholder="Enter street address"
                              value={formData.address}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  address: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.address ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* City */}
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            City
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="city"
                              placeholder="e.g. Mumbai"
                              value={formData.city}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  city: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2">
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.city ||
                                  (currentProfile as any)?.location?.city ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* State */}
                        <div>
                          <Label
                            htmlFor="state"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            State
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="state"
                              placeholder="e.g. Maharashtra"
                              value={formData.state}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  state: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2">
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.state ||
                                  (currentProfile as any)?.location?.state ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Zip Code */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="zipCode"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Zip Code
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="zipCode"
                              placeholder="e.g. 400001"
                              value={formData.zipCode}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  zipCode: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2">
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words">
                                {(currentProfile as any)?.zipCode ||
                                  'Not specified'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Description */}
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="description"
                            className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium"
                          >
                            Company Description
                          </Label>
                          {editing ? (
                            <Textarea
                              id="description"
                              placeholder="Describe your manufacturing company, capabilities, and services..."
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              className="mt-1 sm:mt-2 min-h-[80px] sm:min-h-[100px] bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-industrial-accent focus:ring-industrial-accent text-xs sm:text-sm resize-y"
                            />
                          ) : (
                            <div className="mt-1 sm:mt-2">
                              <span className="text-xs sm:text-sm lg:text-base text-gray-800 break-words leading-relaxed">
                                {(currentProfile as any)?.description ||
                                  'No description provided'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

export default withAuth(ManufacturerProfilePage, {
  allowedUserTypes: [UserType.MANUFACTURER],
});

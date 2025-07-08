'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Save,
  Loader2,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useProfilesStore } from '@/lib/store';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import { IndustrialInput } from '@/components/ui/industrial-input';
import { IndustrialTextarea } from '@/components/ui/industrial-textarea';
import { IndustrialBadge } from '@/components/ui/industrial-badge';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserType } from '@/lib/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  skills: z.string().min(1, 'Skills are required'),
  location: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema> & {
  createdAt?: string;
};

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
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function WorkerProfilePage() {
  const { user } = useAuthStore();
  const {
    currentProfile,
    isLoading,
    isUpdating,
    fetchCurrentUserProfile,
    updateCurrentUserProfile,
  } = useProfilesStore();
  const { toast } = useToast();
  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      skills: '',
      location: '',
    },
  });

  // Use useCallback to memoize the function
  const handleFetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      await fetchCurrentUserProfile(UserType.WORKER);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    }
  }, [user, fetchCurrentUserProfile, toast]);

  useEffect(() => {
    if (user?.id) {
      handleFetchProfile();
    }
  }, [user, handleFetchProfile]);

  useEffect(() => {
    if (currentProfile) {
      const profile = currentProfile as any; // Type assertion for now

      // Handle location field - handle both old and new formats
      let location = '';
      if (profile.location) {
        if (typeof profile.location === 'object') {
          const city = profile.location.city || '';
          const state = profile.location.state || '';
          location = `${city}${city && state ? ', ' : ''}${state}`;
        } else if (typeof profile.location === 'string') {
          location = profile.location;
        }
      }

      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(', ')
          : profile.skills || '',
        location: location,
      });
    }
  }, [currentProfile, form]);

  const onSubmit = async (data: ProfileData) => {
    if (!user?.id) return;

    try {
      const updateData = {
        ...data,
        skills: data.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateCurrentUserProfile(UserType.WORKER, updateData);

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };
  if (isLoading) {
    return (
      <IndustrialLayout>
        <IndustrialContainer>
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

            <div className="flex items-center gap-6 pt-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-gradient-to-br from-industrial-accent/20 to-industrial-accent/10 rounded-xl border border-industrial-accent/30"
              >
                <IndustrialIcon
                  icon="hardhat"
                  size="xl"
                  className="text-industrial-accent"
                />
              </motion.div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <IndustrialHeader
                    level={1}
                    className="text-industrial-gunmetal-800 font-bold"
                  >
                    Worker Profile
                  </IndustrialHeader>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-industrial-gunmetal-600 mt-2"
                >
                  Manage your personal information and professional details
                </motion.p>
              </div>
            </div>
          </motion.div>{' '}
          {/* Enhanced Profile Overview */}
          {currentProfile && (
            <motion.div variants={itemVariants}>
              <motion.div variants={cardVariants} whileHover="hover">
                <IndustrialCard
                  variant="industrial"
                  className="relative overflow-hidden bg-industrial-gunmetal-50 border-l-4 border-l-industrial-accent"
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
                          icon="hardhat"
                          size="sm"
                          className="text-industrial-accent"
                        />
                      </motion.div>
                      <span className="text-industrial-gunmetal-800 font-semibold">
                        Profile Overview
                      </span>
                    </IndustrialCardTitle>
                  </IndustrialCardHeader>
                  <IndustrialCardContent className="relative p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Profile Stats */}
                      <div className="flex-1 space-y-6">
                        {/* Status Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.5,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          className="flex items-center gap-3"
                        >
                          <IndustrialBadge
                            variant="success"
                            className="shadow-md"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Active Professional
                          </IndustrialBadge>
                          <IndustrialBadge
                            variant="secondary"
                            className="shadow-md"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </IndustrialBadge>
                        </motion.div>

                        {/* Profile Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            className="flex items-center gap-3 p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                            whileHover={{ scale: 1.02, x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-industrial-gunmetal-600 uppercase tracking-wide">
                                Location
                              </p>
                              <p className="text-sm font-medium text-industrial-gunmetal-800 group-hover:text-industrial-accent transition-colors">
                                {(() => {
                                  const location = (currentProfile as any)
                                    .location;
                                  if (!location) return 'Not specified';
                                  if (typeof location === 'string')
                                    return location;
                                  if (typeof location === 'object') {
                                    const { city, state } = location;
                                    return (
                                      [city, state]
                                        .filter(Boolean)
                                        .join(', ') || 'Not specified'
                                    );
                                  }
                                  return 'Not specified';
                                })()}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex items-center gap-3 p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                            whileHover={{ scale: 1.02, x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                              <Calendar className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-xs text-industrial-gunmetal-600 uppercase tracking-wide">
                                Member Since
                              </p>
                              <p className="text-sm font-medium text-industrial-gunmetal-800 group-hover:text-industrial-accent transition-colors">
                                {new Date(
                                  (currentProfile as any).createdAt ||
                                    Date.now()
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex items-center gap-3 p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                            whileHover={{ scale: 1.02, x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                              <IndustrialIcon
                                icon="wrench"
                                size="sm"
                                className="text-purple-600"
                              />
                            </div>
                            <div>
                              <p className="text-xs text-industrial-gunmetal-600 uppercase tracking-wide">
                                Skills
                              </p>
                              <p className="text-sm font-medium text-industrial-gunmetal-800 group-hover:text-industrial-accent transition-colors">
                                {Array.isArray((currentProfile as any).skills)
                                  ? (currentProfile as any).skills.length
                                  : (currentProfile as any).skills?.split(',')
                                      .length || 0}{' '}
                                skills listed
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            </motion.div>
          )}{' '}
          {/* Enhanced Profile Form */}
          <motion.div variants={itemVariants}>
            <motion.div variants={cardVariants} whileHover="hover">
              <IndustrialCard
                variant="industrial"
                className="relative overflow-hidden bg-industrial-gunmetal-50"
              >
                {/* Metal grid pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="h-full w-full bg-[linear-gradient(90deg,_#34495E_1px,_transparent_1px),_linear-gradient(#34495E_1px,_transparent_1px)] bg-[length:20px_20px]" />
                </div>

                <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                  <IndustrialCardTitle className="flex items-center gap-3 text-xl">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20"
                    >
                      <IndustrialIcon
                        icon="gear"
                        size="sm"
                        className="text-industrial-accent"
                      />
                    </motion.div>
                    <span className="text-industrial-gunmetal-800 font-semibold">
                      Profile Information
                    </span>
                  </IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent className="relative p-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {' '}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  {...field}
                                  placeholder="Enter your full name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  {...field}
                                  type="email"
                                  placeholder="your.email@example.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (Optional)</FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  {...field}
                                  placeholder="e.g. Mumbai, Maharashtra"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skills (comma-separated)</FormLabel>
                              <FormControl>
                                <IndustrialTextarea
                                  {...field}
                                  placeholder="e.g., Welding, CNC Operation, Quality Control"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>{' '}
                      {/* Enhanced Save Button */}
                      <motion.div
                        className="flex justify-end pt-4"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          variant="industrial-accent"
                          size="lg"
                          className="px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
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
                                className="mr-2"
                              >
                                <Loader2 className="w-5 h-5" />
                              </motion.div>
                              Updating Profile...
                            </>
                          ) : (
                            <>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="mr-2"
                              >
                                <Save className="w-5 h-5" />
                              </motion.div>
                              Update Profile
                            </>
                          )}
                        </Button>{' '}
                      </motion.div>
                    </form>
                  </Form>
                </IndustrialCardContent>
              </IndustrialCard>
            </motion.div>
          </motion.div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

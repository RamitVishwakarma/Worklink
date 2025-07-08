'use client';

import { useEffect, useCallback } from 'react';
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

export const dynamic = 'force-dynamic';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters'),
  skills: z.string(),
  experience: z.string(),
  portfolio: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema> & {
  createdAt?: string;
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
      phone: '',
      location: '',
      bio: '',
      skills: '',
      experience: '',
      portfolio: '',
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

      // Handle location field - convert object to string if needed
      let locationString = '';
      if (profile.location) {
        if (typeof profile.location === 'string') {
          locationString = profile.location;
        } else if (typeof profile.location === 'object') {
          // Handle location object with city, state structure
          const { city, state } = profile.location;
          locationString = [city, state].filter(Boolean).join(', ');
        }
      }

      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: locationString,
        bio: profile.bio || '',
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(', ')
          : profile.skills || '',
        experience: profile.experience || '',
        portfolio: profile.portfolio || '',
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
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-3 sm:px-4">
            <div className="relative">
              <div className="absolute inset-0 border-4 border-industrial-accent/30 rounded-full w-16 h-16 sm:w-20 sm:h-20 animate-spin"></div>
              <div className="p-2.5 sm:p-3 lg:p-4 bg-industrial-gunmetal-100 rounded-full border-2 border-industrial-accent/50">
                <IndustrialIcon
                  icon="gear"
                  size="lg"
                  className="text-industrial-accent w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
            </div>
          </div>
        </IndustrialContainer>
      </IndustrialLayout>
    );
  }

  return (
    <IndustrialLayout>
      <IndustrialContainer>
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Enhanced Header - Responsive */}
          <div className="relative">
            <div className="absolute top-0 left-0 h-1 bg-industrial-accent rounded-full w-full"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 pt-3 sm:pt-4">
              <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-industrial-accent/20 to-industrial-accent/10 rounded-xl border border-industrial-accent/30 shrink-0">
                <IndustrialIcon
                  icon="hardhat"
                  size="lg"
                  className="text-industrial-safety-600 sm:w-8 sm:h-8"
                />
              </div>
              <div className="min-w-0 flex-1">
                <IndustrialHeader
                  level={1}
                  className="text-industrial-gunmetal-800 font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl"
                >
                  Worker Profile
                </IndustrialHeader>
                <p className="text-sm sm:text-base lg:text-lg text-industrial-gunmetal-600 mt-1 sm:mt-2">
                  Manage your personal information and professional details
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Profile Overview */}
          {currentProfile && (
            <div>
              <IndustrialCard
                variant="industrial"
                className="relative overflow-hidden bg-industrial-gunmetal-50 border-l-4 border-l-industrial-accent"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_#2C3E50_1px,_transparent_0)] bg-[length:24px_24px]" />
                </div>

                <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                  <IndustrialCardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <div className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20 shrink-0">
                      <IndustrialIcon
                        icon="hardhat"
                        size="sm"
                        className="text-industrial-accent"
                      />
                    </div>
                    <span className="text-industrial-gunmetal-800 font-semibold">
                      Profile Overview
                    </span>
                  </IndustrialCardTitle>
                </IndustrialCardHeader>
                <IndustrialCardContent className="relative p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-3">
                        <IndustrialBadge
                          variant="success"
                          className="shadow-md text-xs sm:text-sm"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Active Professional
                        </IndustrialBadge>
                        <IndustrialBadge
                          variant="secondary"
                          className="shadow-md text-xs sm:text-sm"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </IndustrialBadge>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group">
                          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shrink-0">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-industrial-gunmetal-600 uppercase tracking-wide">
                              Location
                            </p>
                            <p className="text-sm font-medium text-industrial-gunmetal-800 group-hover:text-industrial-accent transition-colors truncate">
                              {(() => {
                                const location = (currentProfile as any)
                                  .location;
                                if (!location) return 'Not specified';
                                if (typeof location === 'string')
                                  return location;
                                if (typeof location === 'object') {
                                  const { city, state } = location;
                                  return (
                                    [city, state].filter(Boolean).join(', ') ||
                                    'Not specified'
                                  );
                                }
                                return 'Not specified';
                              })()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group">
                          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shrink-0">
                            <Briefcase className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-industrial-gunmetal-600 uppercase tracking-wide">
                              Experience
                            </p>
                            <p className="text-sm font-medium text-industrial-gunmetal-800 group-hover:text-industrial-accent transition-colors truncate">
                              {(currentProfile as any).experience ||
                                'Not specified'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group">
                          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0">
                            <Calendar className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-industrial-gunmetal-600 uppercase tracking-wide">
                              Member Since
                            </p>
                            <p className="text-sm font-medium text-industrial-gunmetal-800 group-hover:text-industrial-accent transition-colors truncate">
                              {new Date(
                                (currentProfile as any).createdAt || Date.now()
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group">
                          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 shrink-0">
                            <IndustrialIcon
                              icon="wrench"
                              size="sm"
                              className="text-purple-600"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </IndustrialCardContent>
              </IndustrialCard>
            </div>
          )}

          {/* Enhanced Profile Form */}
          <div>
            <IndustrialCard
              variant="industrial"
              className="relative overflow-hidden bg-industrial-gunmetal-50"
            >
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[linear-gradient(90deg,_#34495E_1px,_transparent_1px),_linear-gradient(#34495E_1px,_transparent_1px)] bg-[length:20px_20px]" />
              </div>

              <IndustrialCardHeader className="relative border-b border-industrial-accent/20">
                <IndustrialCardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                  <div className="p-2 bg-industrial-accent/10 rounded-lg border border-industrial-accent/20 shrink-0">
                    <IndustrialIcon
                      icon="gear"
                      size="sm"
                      className="text-industrial-accent"
                    />
                  </div>
                  <span className="text-industrial-gunmetal-800 font-semibold">
                    Profile Information
                  </span>
                </IndustrialCardTitle>
              </IndustrialCardHeader>
              <IndustrialCardContent className="relative p-3 sm:p-4 lg:p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6 lg:space-y-8"
                  >
                    {/* Basic Information - Responsive Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <IndustrialInput
                                {...field}
                                placeholder="Enter your full name"
                                className="h-10 sm:h-11 lg:h-12"
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
                            <FormLabel className="text-sm sm:text-base">
                              Email
                            </FormLabel>
                            <FormControl>
                              <IndustrialInput
                                {...field}
                                type="email"
                                placeholder="your.email@example.com"
                                className="h-10 sm:h-11 lg:h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Phone
                            </FormLabel>
                            <FormControl>
                              <IndustrialInput
                                {...field}
                                placeholder="Your phone number"
                                className="h-10 sm:h-11 lg:h-12"
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
                            <FormLabel className="text-sm sm:text-base">
                              Location
                            </FormLabel>
                            <FormControl>
                              <IndustrialInput
                                {...field}
                                placeholder="e.g. Mumbai, Maharashtra"
                                className="h-10 sm:h-11 lg:h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Professional Information - Responsive Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Skills (comma-separated)
                            </FormLabel>
                            <FormControl>
                              <IndustrialTextarea
                                {...field}
                                placeholder="e.g., Welding, CNC Operation, Quality Control"
                                rows={3}
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Experience Level
                            </FormLabel>
                            <FormControl>
                              <IndustrialTextarea
                                {...field}
                                placeholder="Describe your experience and background"
                                rows={3}
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Bio - Full Width */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            Bio
                          </FormLabel>
                          <FormControl>
                            <IndustrialTextarea
                              {...field}
                              placeholder="Tell us about yourself and your professional background"
                              rows={4}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Portfolio - Full Width */}
                    <FormField
                      control={form.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            Portfolio URL (Optional)
                          </FormLabel>
                          <FormControl>
                            <IndustrialInput
                              {...field}
                              placeholder="https://your-portfolio.com"
                              className="h-10 sm:h-11 lg:h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Enhanced Save Button - Responsive */}
                    <div className="flex flex-col sm:flex-row justify-end pt-3 sm:pt-4 gap-3 sm:gap-0">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        variant="industrial-accent"
                        size="lg"
                        className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] sm:min-h-[48px]"
                      >
                        {isUpdating ? (
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            <span className="text-sm sm:text-base">
                              Updating Profile...
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="w-5 h-5 mr-2" />
                            <span className="text-sm sm:text-base">
                              Update Profile
                            </span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </IndustrialCardContent>
            </IndustrialCard>
          </div>
        </div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

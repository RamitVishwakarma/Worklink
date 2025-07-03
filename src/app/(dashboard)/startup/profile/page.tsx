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
  DollarSign,
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
      const updatedProfile = (await updateCurrentUserProfile(
        UserType.STARTUP,
        formData
      )) as StartupProfile;
      setEditing(false);

      // Update auth store with new profile data
      updateUser({
        ...user,
        companyName: updatedProfile.companyName,
        email: updatedProfile.email,
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
      setFormData(profile);
    }
  }, [profile]);

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

              <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-6">
                  {/* Enhanced 3D Factory Icon */}
                  <motion.div
                    whileHover={{
                      rotateY: 180,
                      scale: 1.15,
                      rotateX: 10,
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="relative"
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

                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-industrial-foreground via-industrial-accent to-industrial-foreground bg-clip-text text-transparent mb-2">
                        Company Profile
                      </h1>
                      <p className="text-industrial-muted-foreground text-lg">
                        Manage your industrial company information and
                        manufacturing capabilities
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3"
                >
                  {editing ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="industrial-outline"
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="hover:bg-industrial-muted/50 transition-all duration-300"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSave}
                          disabled={isUpdating}
                          variant="industrial-accent"
                          className="shadow-xl hover:shadow-2xl transition-all duration-300"
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
                                <Loader2 className="h-4 w-4" />
                              </motion.div>
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => setEditing(true)}
                        variant="industrial-accent"
                        className="shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Main Content with Industrial Grid System */}
            <IndustrialGrid
              columns={{ default: 1, lg: 3 }}
              gap={designTokens.spacing['8']}
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
                          <span className="bg-gradient-to-r from-industrial-foreground to-industrial-gunmetal-700 bg-clip-text text-transparent">
                            Company Overview
                          </span>
                        </IndustrialCardTitle>
                      </IndustrialCardHeader>

                      <IndustrialCardContent className="relative p-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Company Stats */}
                          <div className="flex-1 space-y-6">
                            {/* Status Badges */}
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
                                Active Company
                              </IndustrialBadge>
                              <IndustrialBadge
                                variant="secondary"
                                className="shadow-md"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </IndustrialBadge>
                            </motion.div>

                            {/* Company Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div
                                className="flex items-center gap-3 p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                  <Building2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-industrial-muted uppercase tracking-wide">
                                    Company Name
                                  </p>
                                  <p className="text-sm font-medium text-industrial-foreground group-hover:text-industrial-accent transition-colors">
                                    {profile.companyName || 'Not specified'}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-3 p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                  <Factory className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-industrial-muted uppercase tracking-wide">
                                    Industry
                                  </p>
                                  <p className="text-sm font-medium text-industrial-foreground group-hover:text-industrial-accent transition-colors">
                                    {profile.industry || 'Not specified'}
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
                                  <p className="text-xs text-industrial-muted uppercase tracking-wide">
                                    Founded Year
                                  </p>
                                  <p className="text-sm font-medium text-industrial-foreground group-hover:text-industrial-accent transition-colors">
                                    {profile.foundedYear || 'Not specified'}
                                  </p>
                                </div>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-3 p-4 bg-industrial-gunmetal-50/50 rounded-lg border border-industrial-border/50 hover:border-industrial-accent/30 transition-colors group"
                                whileHover={{ scale: 1.02, x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                  <Mail className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-industrial-muted uppercase tracking-wide">
                                    Contact Email
                                  </p>
                                  <p className="text-sm font-medium text-industrial-foreground group-hover:text-industrial-accent transition-colors">
                                    {profile.email || 'Not specified'}
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
                        <span className="bg-gradient-to-r from-industrial-foreground to-industrial-gunmetal-700 bg-clip-text text-transparent">
                          Company Information
                        </span>
                      </IndustrialCardTitle>
                      <IndustrialCardDescription className="mt-2">
                        Essential business information and contact details
                      </IndustrialCardDescription>
                    </IndustrialCardHeader>

                    <IndustrialCardContent className="relative p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="companyName"
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
                          >
                            <IndustrialIcon
                              icon="factory"
                              size="sm"
                              className="text-industrial-accent"
                            />
                            Company Name *
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="companyName"
                              value={formData.companyName || ''}
                              onChange={(e) =>
                                handleInputChange('companyName', e.target.value)
                              }
                              placeholder="Enter your company name"
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
                              {profile?.companyName || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="industry"
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
                          >
                            <IndustrialIcon
                              icon="gear"
                              size="sm"
                              className="text-industrial-accent"
                            />
                            Industry *
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="industry"
                              value={formData.industry || ''}
                              onChange={(e) =>
                                handleInputChange('industry', e.target.value)
                              }
                              placeholder="e.g., Manufacturing, Technology"
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
                              {profile?.industry || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4 text-industrial-accent" />
                            Email Address *
                          </Label>
                          {editing ? (
                            <IndustrialInput
                              id="email"
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) =>
                                handleInputChange('email', e.target.value)
                              }
                              placeholder="company@example.com"
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
                              {profile?.email || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
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
                              placeholder="+1 (555) 123-4567"
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
                              {profile?.phone || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label
                            htmlFor="address"
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
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
                              placeholder="123 Industrial Ave, Manufacturing City, State 12345"
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
                              {profile?.address || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="website"
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
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
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
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
                            className="text-industrial-foreground font-semibold flex items-center gap-2"
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
                              className="bg-white/80 focus:bg-white transition-colors"
                            />
                          ) : (
                            <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 text-industrial-foreground">
                              {profile?.foundedYear || 'Not specified'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Company Description */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-industrial-foreground font-semibold flex items-center gap-2"
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
                            className="bg-white/80 focus:bg-white transition-colors"
                          />
                        ) : (
                          <p className="p-3 border border-industrial-border rounded-md bg-industrial-muted/50 min-h-[100px] text-industrial-foreground">
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
                        <span className="bg-gradient-to-r from-industrial-foreground to-industrial-gunmetal-700 bg-clip-text text-transparent">
                          Profile Statistics
                        </span>
                      </IndustrialCardTitle>
                      <IndustrialCardDescription className="mt-2">
                        Your company metrics
                      </IndustrialCardDescription>
                    </IndustrialCardHeader>

                    <IndustrialCardContent className="relative p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-industrial-muted-foreground">
                          Profile Complete
                        </span>
                        <span className="font-semibold text-industrial-accent">
                          85%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-industrial-muted-foreground">
                          Active Since
                        </span>
                        <span className="font-semibold text-industrial-foreground">
                          2024
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-industrial-muted-foreground">
                          Last Updated
                        </span>
                        <span className="font-semibold text-industrial-foreground">
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

                    <IndustrialCardContent className="relative p-6">
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50"
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          View Public Profile
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Create New Gig
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Manage Applications
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

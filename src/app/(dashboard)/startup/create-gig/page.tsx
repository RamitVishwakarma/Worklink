'use client';

import React, { useState } from 'react';
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
import { useAuthStore, useGigsStore } from '@/lib/store';
import { useGigOperations } from '@/hooks/useApiIntegration';
import withAuth from '@/components/auth/withAuth';
import { UserType, Gig } from '@/lib/types';
import {
  Plus,
  X,
  Factory,
  Clock,
  Users,
  MapPin,
  IndianRupee,
  Calendar,
  Briefcase,
  Building2,
  Save,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateGigSubmitData {
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  jobType: string;
  salary?: number;
  duration: string;
  benefits: string[];
  applicationDeadline?: string;
  company: string;
}

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

// Form interface with location as object for form handling
interface CreateGigForm {
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  jobType: string;
  salary: number | '';
  duration: string;
  skillsRequired: string[];
  benefits: string[];
  applicationDeadline: string;
}

function CreateGigPage() {
  const [formData, setFormData] = useState<CreateGigForm>({
    title: '',
    description: '',
    location: {
      city: '',
      state: '',
    },
    jobType: '',
    salary: '',
    duration: '',
    skillsRequired: [],
    benefits: [],
    applicationDeadline: '',
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const { toast } = useToast();
  const { user } = useAuthStore();
  const { createGig, isCreating } = useGigsStore();
  const router = useRouter();

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Remote',
  ];

  // Indian states array for select dropdown
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  // Major Indian cities array for select dropdown
  const indianCities = [
    'Ahmedabad',
    'Bangalore',
    'Bhopal',
    'Chennai',
    'Coimbatore',
    'Delhi',
    'Faridabad',
    'Ghaziabad',
    'Gurgaon',
    'Hyderabad',
    'Indore',
    'Jaipur',
    'Kanpur',
    'Kochi',
    'Kolkata',
    'Lucknow',
    'Mumbai',
    'Mysore',
    'Nagpur',
    'Noida',
    'Pune',
    'Surat',
    'Vadodara',
    'Visakhapatnam',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !formData.skillsRequired.includes(newRequirement.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newRequirement.trim()],
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(
        (req: string) => req !== requirement
      ),
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((ben: string) => ben !== benefit),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location.city ||
      !formData.location.state ||
      !formData.jobType ||
      !formData.duration
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Convert location object to string format: "City, State"
      const locationString = `${formData.location.city}, ${formData.location.state}`;

      const gigData: CreateGigSubmitData = {
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.skillsRequired,
        location: locationString,
        jobType: formData.jobType,
        salary: formData.salary ? Number(formData.salary) : undefined,
        duration: formData.duration,
        benefits: formData.benefits,
        applicationDeadline: formData.applicationDeadline || undefined,
        company: user?.companyName || 'A Startup',
      };

      const response = await createGig(gigData);

      if (response) {
        toast({
          title: 'Success',
          description: 'Gig created successfully!',
        });
        router.push('/startup/gigs');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create gig. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create gig',
        variant: 'destructive',
      });
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <Factory className="h-8 w-8 text-industrial-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create New Gig</h1>
            <p className="text-gray-600 text-lg">
              Post a new job opportunity and find the perfect industrial talent
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Column */}
            <div className="lg:col-span-2">
              <motion.div variants={itemVariants}>
                <IndustrialCard className="bg-white shadow-lg border-gray-200">
                  <IndustrialCardHeader>
                    <IndustrialCardTitle className="text-gray-800 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-industrial-accent" />
                      Job Details
                    </IndustrialCardTitle>
                    <IndustrialCardDescription className="text-gray-600">
                      Enter the basic information about your job posting
                    </IndustrialCardDescription>
                  </IndustrialCardHeader>
                  <IndustrialCardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Job Title */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-gray-700 font-semibold flex items-center gap-2"
                        >
                          <Briefcase className="h-4 w-4 text-industrial-accent" />
                          Job Title *
                        </Label>
                        <IndustrialInput
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange('title', e.target.value)
                          }
                          placeholder="e.g. Senior Manufacturing Engineer"
                          className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                          required
                        />
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="city"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4 text-industrial-accent" />
                            City *
                          </Label>
                          <Select
                            value={formData.location.city}
                            onValueChange={(value) =>
                              handleInputChange('location', {
                                ...formData.location,
                                city: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              {indianCities.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className="text-gray-900 hover:bg-gray-50"
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="state"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4 text-industrial-accent" />
                            State *
                          </Label>
                          <Select
                            value={formData.location.state}
                            onValueChange={(value) =>
                              handleInputChange('location', {
                                ...formData.location,
                                state: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              {indianStates.map((state) => (
                                <SelectItem
                                  key={state}
                                  value={state}
                                  className="text-gray-900 hover:bg-gray-50"
                                >
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Job Type */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="jobType"
                          className="text-gray-700 font-semibold flex items-center gap-2"
                        >
                          <Briefcase className="h-4 w-4 text-industrial-accent" />
                          Job Type *
                        </Label>
                        <Select
                          value={formData.jobType}
                          onValueChange={(value) =>
                            handleInputChange('jobType', value)
                          }
                        >
                          <SelectTrigger className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            {jobTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Salary and Duration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="salary"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <IndianRupee className="h-4 w-4 text-industrial-accent" />
                            Salary (Annual in ₹)
                          </Label>
                          <IndustrialInput
                            id="salary"
                            type="number"
                            min="0"
                            value={formData.salary}
                            onChange={(e) =>
                              handleInputChange('salary', e.target.value)
                            }
                            placeholder="e.g. 80000"
                            className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="duration"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4 text-industrial-accent" />
                            Duration *
                          </Label>
                          <Select
                            value={formData.duration}
                            onValueChange={(value) =>
                              handleInputChange('duration', value)
                            }
                          >
                            <SelectTrigger className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem
                                value="1-3 months"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                1-3 months
                              </SelectItem>
                              <SelectItem
                                value="3-6 months"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                3-6 months
                              </SelectItem>
                              <SelectItem
                                value="6-12 months"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                6-12 months
                              </SelectItem>
                              <SelectItem
                                value="1+ years"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                1+ years
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Application Deadline */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="deadline"
                          className="text-gray-700 font-semibold flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4 text-industrial-accent" />
                          Application Deadline
                        </Label>
                        <IndustrialInput
                          id="deadline"
                          type="date"
                          min={getTomorrowDate()}
                          value={formData.applicationDeadline}
                          onChange={(e) =>
                            handleInputChange(
                              'applicationDeadline',
                              e.target.value
                            )
                          }
                          className="bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                        />
                      </div>

                      {/* Job Description */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-gray-700 font-semibold flex items-center gap-2"
                        >
                          <Users className="h-4 w-4 text-industrial-accent" />
                          Job Description *
                        </Label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange('description', e.target.value)
                          }
                          placeholder="Describe the job responsibilities, requirements, and what makes this role exciting..."
                          className="w-full px-4 py-3 bg-gray-50 focus:bg-white transition-colors border border-gray-200 focus:border-industrial-accent rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-industrial-accent/20"
                          rows={6}
                          required
                        />
                      </div>

                      {/* Skills Required */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="requirements"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <IndustrialIcon
                              icon="gear"
                              size="sm"
                              className="text-industrial-accent"
                            />
                            Skills Required
                          </Label>
                          <div className="flex gap-2">
                            <IndustrialInput
                              id="requirements"
                              value={newRequirement}
                              onChange={(e) =>
                                setNewRequirement(e.target.value)
                              }
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addRequirement();
                                }
                              }}
                              placeholder="Add a skill requirement..."
                              className="flex-1 bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                            <Button
                              type="button"
                              onClick={addRequirement}
                              variant="industrial-accent"
                              className="shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {formData.skillsRequired.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {formData.skillsRequired.map(
                                (requirement: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="industrial-secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {requirement}
                                    <X
                                      className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                                      onClick={() =>
                                        removeRequirement(requirement)
                                      }
                                    />
                                  </Badge>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="benefits"
                            className="text-gray-700 font-semibold flex items-center gap-2"
                          >
                            <IndustrialIcon
                              icon="cog"
                              size="sm"
                              className="text-industrial-accent"
                            />
                            Benefits
                          </Label>
                          <div className="flex gap-2">
                            <IndustrialInput
                              id="benefits"
                              value={newBenefit}
                              onChange={(e) => setNewBenefit(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addBenefit();
                                }
                              }}
                              placeholder="Add a benefit..."
                              className="flex-1 bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-industrial-accent"
                            />
                            <Button
                              type="button"
                              onClick={addBenefit}
                              variant="industrial-accent"
                              className="shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {formData.benefits.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {formData.benefits.map(
                                (benefit: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="industrial-secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {benefit}
                                    <X
                                      className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                                      onClick={() => removeBenefit(benefit)}
                                    />
                                  </Badge>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex gap-4 pt-6">
                        <Button
                          type="submit"
                          disabled={isCreating}
                          className="flex-1 bg-industrial-accent hover:bg-industrial-accent/90 text-white"
                        >
                          {isCreating ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Create Gig
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push('/dashboard/startup/gigs')}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-1">
              <motion.div variants={itemVariants}>
                <IndustrialCard className="bg-white shadow-lg border-gray-200 sticky top-6">
                  <IndustrialCardHeader>
                    <IndustrialCardTitle className="text-gray-800 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-industrial-accent" />
                      Live Preview
                    </IndustrialCardTitle>
                  </IndustrialCardHeader>
                  <IndustrialCardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">
                          {formData.title || 'Job Title Preview'}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Building2 className="h-4 w-4 text-industrial-accent" />
                          {user?.companyName || user?.name || 'Your Company'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {(formData.location.city ||
                          formData.location.state) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-industrial-accent" />
                            {[formData.location.city, formData.location.state]
                              .filter(Boolean)
                              .join(', ')}
                          </div>
                        )}

                        {formData.jobType && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 text-industrial-accent" />
                            {formData.jobType}
                          </div>
                        )}

                        {formData.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-industrial-accent" />
                            {formData.duration}
                          </div>
                        )}

                        {formData.salary && (
                          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                            <IndianRupee className="h-4 w-4 text-emerald-500" />
                            ₹{Number(formData.salary).toLocaleString()}/year
                          </div>
                        )}
                      </div>

                      {formData.description && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {formData.description}
                          </p>
                        </div>
                      )}

                      {formData.skillsRequired.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Skills Required
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {formData.skillsRequired
                              .slice(0, 3)
                              .map((skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="industrial-secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {formData.skillsRequired.length > 3 && (
                              <Badge
                                variant="industrial-secondary"
                                className="text-xs"
                              >
                                +{formData.skillsRequired.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {formData.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Benefits
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {formData.benefits
                              .slice(0, 3)
                              .map((benefit: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-gray-300 text-gray-600"
                                >
                                  {benefit}
                                </Badge>
                              ))}
                            {formData.benefits.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600"
                              >
                                +{formData.benefits.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </IndustrialCardContent>
                </IndustrialCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

export default withAuth(CreateGigPage, {
  allowedUserTypes: [UserType.STARTUP],
});

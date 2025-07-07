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
import withAuth from '@/components/auth/withAuth';
import { UserType } from '@/lib/types';
import {
  Plus,
  X,
  DollarSign,
  MapPin,
  Calendar,
  Building2,
  Users,
  Briefcase,
  Clock,
  Save,
  Factory,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      const gigData = {
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.skillsRequired,
        location: formData.location,
        salary: formData.salary ? Number(formData.salary) : undefined,
        duration: formData.duration,
      };

      await createGig(gigData);

      toast({
        title: 'Success',
        description: 'Gig created successfully!',
      });

      router.push('/dashboard/startup/gigs');
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
                              <SelectItem
                                value="Delhi"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Delhi
                              </SelectItem>
                              <SelectItem
                                value="Mumbai"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Mumbai
                              </SelectItem>
                              <SelectItem
                                value="Bangalore"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Bangalore
                              </SelectItem>
                              <SelectItem
                                value="Hyderabad"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Hyderabad
                              </SelectItem>
                              <SelectItem
                                value="Chennai"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Chennai
                              </SelectItem>
                              <SelectItem
                                value="Kolkata"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Kolkata
                              </SelectItem>
                              <SelectItem
                                value="Pune"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Pune
                              </SelectItem>
                              <SelectItem
                                value="Ahmedabad"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Ahmedabad
                              </SelectItem>
                              <SelectItem
                                value="Jaipur"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Jaipur
                              </SelectItem>
                              <SelectItem
                                value="Surat"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Surat
                              </SelectItem>
                              <SelectItem
                                value="Lucknow"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Lucknow
                              </SelectItem>
                              <SelectItem
                                value="Kanpur"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Kanpur
                              </SelectItem>
                              <SelectItem
                                value="Nagpur"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Nagpur
                              </SelectItem>
                              <SelectItem
                                value="Indore"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Indore
                              </SelectItem>
                              <SelectItem
                                value="Bhopal"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Bhopal
                              </SelectItem>
                              <SelectItem
                                value="Visakhapatnam"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Visakhapatnam
                              </SelectItem>
                              <SelectItem
                                value="Vadodara"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Vadodara
                              </SelectItem>
                              <SelectItem
                                value="Ghaziabad"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Ghaziabad
                              </SelectItem>
                              <SelectItem
                                value="Noida"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Noida
                              </SelectItem>
                              <SelectItem
                                value="Faridabad"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Faridabad
                              </SelectItem>
                              <SelectItem
                                value="Gurgaon"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Gurgaon
                              </SelectItem>
                              <SelectItem
                                value="Coimbatore"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Coimbatore
                              </SelectItem>
                              <SelectItem
                                value="Kochi"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Kochi
                              </SelectItem>
                              <SelectItem
                                value="Mysore"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Mysore
                              </SelectItem>
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
                              <SelectItem
                                value="Andhra Pradesh"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Andhra Pradesh
                              </SelectItem>
                              <SelectItem
                                value="Arunachal Pradesh"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Arunachal Pradesh
                              </SelectItem>
                              <SelectItem
                                value="Assam"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Assam
                              </SelectItem>
                              <SelectItem
                                value="Bihar"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Bihar
                              </SelectItem>
                              <SelectItem
                                value="Chhattisgarh"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Chhattisgarh
                              </SelectItem>
                              <SelectItem
                                value="Delhi"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Delhi
                              </SelectItem>
                              <SelectItem
                                value="Goa"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Goa
                              </SelectItem>
                              <SelectItem
                                value="Gujarat"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Gujarat
                              </SelectItem>
                              <SelectItem
                                value="Haryana"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Haryana
                              </SelectItem>
                              <SelectItem
                                value="Himachal Pradesh"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Himachal Pradesh
                              </SelectItem>
                              <SelectItem
                                value="Jharkhand"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Jharkhand
                              </SelectItem>
                              <SelectItem
                                value="Karnataka"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Karnataka
                              </SelectItem>
                              <SelectItem
                                value="Kerala"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Kerala
                              </SelectItem>
                              <SelectItem
                                value="Madhya Pradesh"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Madhya Pradesh
                              </SelectItem>
                              <SelectItem
                                value="Maharashtra"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Maharashtra
                              </SelectItem>
                              <SelectItem
                                value="Manipur"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Manipur
                              </SelectItem>
                              <SelectItem
                                value="Meghalaya"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Meghalaya
                              </SelectItem>
                              <SelectItem
                                value="Mizoram"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Mizoram
                              </SelectItem>
                              <SelectItem
                                value="Nagaland"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Nagaland
                              </SelectItem>
                              <SelectItem
                                value="Odisha"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Odisha
                              </SelectItem>
                              <SelectItem
                                value="Punjab"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Punjab
                              </SelectItem>
                              <SelectItem
                                value="Rajasthan"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Rajasthan
                              </SelectItem>
                              <SelectItem
                                value="Sikkim"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Sikkim
                              </SelectItem>
                              <SelectItem
                                value="Tamil Nadu"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Tamil Nadu
                              </SelectItem>
                              <SelectItem
                                value="Telangana"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Telangana
                              </SelectItem>
                              <SelectItem
                                value="Tripura"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Tripura
                              </SelectItem>
                              <SelectItem
                                value="Uttar Pradesh"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Uttar Pradesh
                              </SelectItem>
                              <SelectItem
                                value="Uttarakhand"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                Uttarakhand
                              </SelectItem>
                              <SelectItem
                                value="West Bengal"
                                className="text-gray-900 hover:bg-gray-50"
                              >
                                West Bengal
                              </SelectItem>
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
                            <DollarSign className="h-4 w-4 text-industrial-accent" />
                            Salary (Annual)
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
                            <DollarSign className="h-4 w-4 text-emerald-500" />$
                            {Number(formData.salary).toLocaleString()}/year
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

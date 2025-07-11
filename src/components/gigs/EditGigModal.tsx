'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IndustrialButton as Button } from '@/components/ui/industrial-button';
import { IndustrialInput as Input } from '@/components/ui/industrial-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, X, Plus, Factory, Loader } from 'lucide-react';
import { Gig } from '@/lib/types';

interface EditGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
  onSave: (gigId: string, gigData: any) => Promise<boolean>;
  isLoading?: boolean;
}

interface EditGigForm {
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  jobType: string;
  salary: string;
}

const skillSuggestions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Machine Learning',
  'Data Analysis',
  'Project Management',
  'UI/UX Design',
  'Manufacturing',
  'Quality Control',
  'Welding',
  'CNC Operation',
  'Assembly',
  'Logistics',
];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export function EditGigModal({
  isOpen,
  onClose,
  gig,
  onSave,
  isLoading = false,
}: EditGigModalProps) {
  const [formData, setFormData] = useState<EditGigForm>({
    title: '',
    description: '',
    skillsRequired: [],
    location: '',
    jobType: '',
    salary: '',
  });

  const [newSkill, setNewSkill] = useState('');

  // Populate form when gig changes
  useEffect(() => {
    if (gig && isOpen) {
      // Map duration to jobType for the form
      const getJobTypeFromDuration = (
        duration: string,
        fallbackJobType?: string
      ) => {
        // First check duration field
        if (duration) {
          const lowerDuration = duration.toLowerCase();
          if (lowerDuration.includes('full')) return 'full-time';
          if (lowerDuration.includes('part')) return 'part-time';
          if (lowerDuration.includes('contract')) return 'contract';
          return duration; // Return original if no mapping found
        }
        // Fallback to jobType field if duration is not available
        return fallbackJobType || '';
      };

      setFormData({
        title: gig.title || '',
        description: gig.description || '',
        skillsRequired: Array.isArray(gig.skillsRequired)
          ? gig.skillsRequired
          : Array.isArray(gig.requiredSkills)
            ? gig.requiredSkills
            : [],
        location: gig.location || '',
        jobType: getJobTypeFromDuration(
          gig.duration || '',
          (gig as any).jobType
        ),
        salary: gig.salary?.toString() || '',
      });
    }
  }, [gig, isOpen]);

  const handleInputChange = (field: keyof EditGigForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skillsRequired.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, trimmedSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gig) return;

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    // Map jobType back to duration
    const getDurationFromJobType = (jobType: string) => {
      switch (jobType) {
        case 'full-time':
          return 'Full-time';
        case 'part-time':
          return 'Part-time';
        case 'contract':
          return 'Contract';
        default:
          return jobType || 'Full-time'; // Default to Full-time if empty
      }
    };

    const gigData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      skillsRequired: formData.skillsRequired, // Use skillsRequired to match the model
      location: formData.location.trim(),
      jobType: formData.jobType, // Keep jobType for backward compatibility
      duration: getDurationFromJobType(formData.jobType), // Map jobType to duration
      salary: formData.salary ? Number(formData.salary) : undefined,
    };

    const success = await onSave(gig._id, gigData);
    if (success) {
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      skillsRequired: [],
      location: '',
      jobType: '',
      salary: '',
    });
    setNewSkill('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!gig) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-industrial-text-primary">
              <Factory className="h-5 w-5 text-industrial-accent" />
              Edit Gig
            </DialogTitle>
            <DialogDescription>
              Update your gig information and requirements.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Gig Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter gig title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) =>
                      handleInputChange('jobType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <Label htmlFor="salary">Salary in ₹ (Optional)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      handleInputChange('salary', e.target.value)
                    }
                    placeholder="Enter salary amount in ₹"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Describe the gig requirements and responsibilities"
                    rows={8}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <Label>Skills Required</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skillsRequired.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(newSkill);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="industrial-outline"
                  size="icon"
                  onClick={() => addSkill(newSkill)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {skillSuggestions.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer text-xs"
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="industrial-outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="industrial-accent"
                disabled={
                  isLoading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Gig
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

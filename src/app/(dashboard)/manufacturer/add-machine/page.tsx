'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { IndustrialInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardDescription,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/card';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { addMachine } from '@/lib/api';
import { UserType } from '@/lib/types';
import withAuth from '@/components/auth/withAuth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const machineSchema = z.object({
  name: z.string().min(1, 'Machine name is required'),
  type: z.string().min(1, 'Machine type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  pricePerHour: z.number().min(0, 'Price must be a positive number'),
  specifications: z.string().optional(),
  availability: z.boolean(),
});

type MachineFormData = z.infer<typeof machineSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function AddMachinePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      location: '',
      pricePerHour: 0,
      specifications: '',
      availability: true,
    },
  });

  const onSubmit = async (data: MachineFormData) => {
    // Check if user is authenticated
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addMachine({
        ...data,
        // manufacturerId not needed - extracted from JWT in backend
      });

      toast({
        title: 'Success',
        description: 'Machine added successfully!',
      });

      router.push('/dashboard/manufacturer/machines');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add machine',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IndustrialLayout background="grid" padding="md">
      <IndustrialContainer>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-4 mb-8">
              <IndustrialIcon icon="wrench" size="lg" />
              <div>
                <IndustrialHeader level={1}>Add New Machine</IndustrialHeader>
                <p className="text-industrial-gunmetal-600 mt-2">
                  Add a new machine to your manufacturing fleet
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <IndustrialCard>
              <IndustrialCardHeader>
                <div className="flex items-center space-x-3">
                  <IndustrialIcon
                    icon="gear"
                    className="text-industrial-primary"
                  />
                  <div>
                    <IndustrialCardTitle>Machine Details</IndustrialCardTitle>
                    <IndustrialCardDescription>
                      Enter the details for your new machine
                    </IndustrialCardDescription>
                  </div>
                </div>
              </IndustrialCardHeader>

              <IndustrialCardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Machine Name</FormLabel>
                            <FormControl>
                              <IndustrialInput
                                placeholder="e.g., CNC Milling Machine"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Machine Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select machine type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CNC">CNC Machine</SelectItem>
                                <SelectItem value="Lathe">Lathe</SelectItem>
                                <SelectItem value="Mill">
                                  Milling Machine
                                </SelectItem>
                                <SelectItem value="Drill">
                                  Drilling Machine
                                </SelectItem>
                                <SelectItem value="Press">
                                  Press Machine
                                </SelectItem>
                                <SelectItem value="Grinder">
                                  Grinding Machine
                                </SelectItem>
                                <SelectItem value="Welder">
                                  Welding Machine
                                </SelectItem>
                                <SelectItem value="Cutter">
                                  Cutting Machine
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the machine, its capabilities, and any special features..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of the machine
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <IndustrialInput
                                placeholder="e.g., Mumbai, Maharashtra"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pricePerHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Hour ($)</FormLabel>
                            <FormControl>
                              <IndustrialInput
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="specifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Specifications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter technical specifications, dimensions, power requirements, etc..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Add technical details and specifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-industrial-accent hover:bg-industrial-accent/90"
                      >
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Add Machine
                      </Button>
                    </div>
                  </form>
                </Form>
              </IndustrialCardContent>
            </IndustrialCard>
          </motion.div>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

export default withAuth(AddMachinePage, {
  allowedUserTypes: [UserType.MANUFACTURER],
});

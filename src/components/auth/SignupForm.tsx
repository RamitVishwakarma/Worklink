'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IndustrialInput } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
  IndustrialCardDescription,
} from '@/components/ui/card';
import {
  IndustrialLayout,
  IndustrialContainer,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { UserType } from '@/lib/types';

const baseSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
});

const workerSchema = baseSchema.extend({
  userType: z.literal('worker'),
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  skills: z
    .string()
    .min(1, { message: 'Skills are required (comma-separated).' }),
  city: z.string().optional(),
  state: z.string().optional(),
});

const startupSchema = baseSchema.extend({
  userType: z.literal('startup'),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  workSector: z.string().min(1, { message: 'Work sector is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
});

const manufacturerSchema = baseSchema.extend({
  userType: z.literal('manufacturer'),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  industry: z.string().min(1, { message: 'Industry is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
});

const formSchema = z
  .discriminatedUnion('userType', [
    workerSchema,
    startupSchema,
    manufacturerSchema,
  ])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

export function SignupForm() {
  const signup = useAuthStore((state) => state.signup);
  const router = useRouter();
  const { toast } = useToast(); // Initialize useToast

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      userType: undefined, // Will be set when user selects
      // Worker fields
      fullName: '',
      skills: '',
      city: '',
      state: '',
      // Startup/Manufacturer fields
      companyName: '',
      workSector: '',
      industry: '',
    } as any, // Cast to any due to discriminated union complexities
  });

  const userType = form.watch('userType');

  async function onSubmit(values: FormValues) {
    try {
      let response;

      // Call the appropriate signup API based on user type
      if (values.userType === 'worker') {
        const workerData = {
          name: values.fullName,
          email: values.email,
          password: values.password,
          skills: values.skills.split(',').map((skill) => skill.trim()),
          ...(values.city &&
            values.state && {
              location: {
                city: values.city,
                state: values.state,
              },
            }),
        };
        response = await authAPI.workerSignup(workerData);
      } else if (values.userType === 'startup') {
        const startupData = {
          companyName: values.companyName,
          companyEmail: values.email,
          password: values.password,
          workSector: values.workSector,
          location: {
            city: values.city,
            state: values.state,
          },
        };
        response = await authAPI.startupSignup(startupData);
      } else if (values.userType === 'manufacturer') {
        const manufacturerData = {
          companyName: values.companyName,
          companyEmail: values.email,
          password: values.password,
          workSector: values.industry,
          location: {
            city: values.city,
            state: values.state,
          },
        };
        response = await authAPI.manufacturerSignup(manufacturerData);
      }

      if (response) {
        // Clean token by removing 'Bearer ' prefix if it exists
        const cleanToken = response.token.replace('Bearer ', '');

        // Store the token and user data
        localStorage.setItem('token', cleanToken);
        localStorage.setItem('userType', values.userType);

        // Extract user data from response (ensure userType is included)
        const userTypeEnum =
          values.userType === 'worker'
            ? UserType.WORKER
            : values.userType === 'startup'
              ? UserType.STARTUP
              : UserType.MANUFACTURER;

        const userData = {
          ...response.user,
          id: (response.user as any)._id || response.user.id, // Normalize _id to id
          userType: userTypeEnum, // Ensure userType is properly typed
        };

        localStorage.setItem('user', JSON.stringify(userData));

        // Update auth store with the clean token and user data
        await signup(cleanToken, userData);

        toast({
          title: 'Account Created Successfully!',
          description: `Welcome! Redirecting to your dashboard...`,
        });

        router.push(`/${values.userType}/dashboard`);
      }
    } catch (error: unknown) {
      console.error('Signup failed:', error);
      let errorMessage =
        'An unexpected error occurred during signup. Please try again.';

      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const responseData = error.response.data;

        // Handle validation errors
        if (responseData.errors && Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join(', ');
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData.error === 'string') {
          errorMessage = responseData.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: errorMessage,
      });
      form.setError('root', { type: 'manual', message: errorMessage });
    }
  }

  // Animation variants for industrial theme
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const gearVariants = {
    hidden: { rotate: -180, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const formFieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <IndustrialLayout>
      <IndustrialContainer className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-lg"
        >
          <IndustrialCard
            variant="industrial"
            className="shadow-2xl shadow-industrial-gunmetal-800/20 border-2 border-industrial-gunmetal-300 overflow-hidden"
          >
            <IndustrialCardHeader className="text-center space-y-4">
              <motion.div
                className="flex justify-center"
                variants={gearVariants}
              >
                <IndustrialIcon
                  icon="gear"
                  size="xl"
                  animated
                  className="text-industrial-safety-300"
                />
              </motion.div>
              <motion.div variants={headerVariants}>
                <IndustrialCardTitle className="text-3xl font-bold font-industrial-heading">
                  Join the Network
                </IndustrialCardTitle>
              </motion.div>
              <motion.div variants={headerVariants}>
                <IndustrialCardDescription className="font-industrial-body">
                  Create your WorkLink industrial account to access
                  opportunities.
                </IndustrialCardDescription>
              </motion.div>
            </IndustrialCardHeader>
            <IndustrialCardContent>
              <Form {...form}>
                <motion.form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  <motion.div variants={formFieldVariants}>
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-industrial-body font-semibold">
                            I am a...
                          </FormLabel>
                          <Select
                            value={field.value || ''}
                            onValueChange={(
                              value: 'worker' | 'startup' | 'manufacturer'
                            ) => {
                              field.onChange(value);
                              // Reset form with proper default values to maintain controlled inputs
                              const baseValues = {
                                email: form.getValues('email') || '',
                                password: form.getValues('password') || '',
                                confirmPassword:
                                  form.getValues('confirmPassword') || '',
                                userType: value,
                                // Always include all possible fields with empty string defaults
                                fullName: '',
                                skills: '',
                                city: '',
                                state: '',
                                companyName: '',
                                workSector: '',
                                industry: '',
                              };

                              // Cast to any to avoid TypeScript discriminated union issues during reset
                              form.reset(baseValues as any);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white border-industrial-gunmetal-300 text-industrial-gunmetal-800 focus:ring-industrial-safety-300 focus:border-industrial-safety-300 h-12 transition-all duration-200">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-industrial-gunmetal-300">
                              <SelectItem
                                value="worker"
                                className="text-industrial-gunmetal-800 hover:bg-industrial-gunmetal-50 focus:bg-industrial-gunmetal-50"
                              >
                                <div className="flex items-center gap-2">
                                  <IndustrialIcon icon="wrench" size="sm" />
                                  Worker
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="startup"
                                className="text-industrial-gunmetal-800 hover:bg-industrial-gunmetal-50 focus:bg-industrial-gunmetal-50"
                              >
                                <div className="flex items-center gap-2">
                                  <IndustrialIcon icon="circuit" size="sm" />
                                  Startup
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="manufacturer"
                                className="text-industrial-gunmetal-800 hover:bg-industrial-gunmetal-50 focus:bg-industrial-gunmetal-50"
                              >
                                <div className="flex items-center gap-2">
                                  <IndustrialIcon icon="factory" size="sm" />
                                  Manufacturer
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {userType && (
                    <>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                Email
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="you@example.com"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                Password
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  type="password"
                                  placeholder="••••••••"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  type="password"
                                  placeholder="••••••••"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </>
                  )}

                  {userType === 'worker' && (
                    <>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="John Doe"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                Skills
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="e.g., React, Node.js, Welding"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Optional location fields for workers */}
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                City (Optional)
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="Mumbai"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                State (Optional)
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="Maharashtra"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </>
                  )}

                  {(userType === 'startup' || userType === 'manufacturer') && (
                    <>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                Company Name
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="Acme Corp"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                City
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="Delhi"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={formFieldVariants}>
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-industrial-body font-semibold">
                                State
                              </FormLabel>
                              <FormControl>
                                <IndustrialInput
                                  placeholder="Delhi"
                                  variant="industrial"
                                  {...field}
                                  value={field.value || ''}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </>
                  )}

                  {userType === 'startup' && (
                    <motion.div variants={formFieldVariants}>
                      <FormField
                        control={form.control}
                        name="workSector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-industrial-body font-semibold">
                              Work Sector
                            </FormLabel>
                            <FormControl>
                              <IndustrialInput
                                placeholder="e.g., Technology, Healthcare"
                                variant="industrial"
                                {...field}
                                value={field.value || ''}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {userType === 'manufacturer' && (
                    <motion.div variants={formFieldVariants}>
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-industrial-body font-semibold">
                              Industry
                            </FormLabel>
                            <FormControl>
                              <IndustrialInput
                                placeholder="e.g., Automotive, Aerospace"
                                variant="industrial"
                                {...field}
                                value={field.value || ''}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {form.formState.errors.root && (
                    <motion.div
                      variants={formFieldVariants}
                      className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                    >
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.root.message}
                      </p>
                    </motion.div>
                  )}

                  <motion.div variants={formFieldVariants}>
                    <Button
                      type="submit"
                      variant="industrial-primary"
                      size="lg"
                      className="w-full h-12 font-industrial-body font-semibold"
                      disabled={form.formState.isSubmitting}
                      asChild
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <IndustrialIcon
                              icon="gear"
                              size="sm"
                              animated
                              className="mr-2"
                            />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <IndustrialIcon
                              icon="gear"
                              size="sm"
                              className="mr-2"
                            />
                            Join WorkLink
                          </>
                        )}
                      </motion.button>
                    </Button>
                  </motion.div>
                </motion.form>
              </Form>
            </IndustrialCardContent>
            <div className="flex flex-col items-center space-y-2 mt-4 p-6 pt-0">
              <p className="text-sm text-industrial-secondary">
                Already have an account?{' '}
                <Link
                  href="/signin"
                  className="font-medium text-industrial-accent hover:text-industrial-primary"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </IndustrialCard>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

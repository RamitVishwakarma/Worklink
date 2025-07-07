'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api';
import { UserType } from '@/lib/types';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { IndustrialInput } from '@/components/ui/input';
import {
  IndustrialLayout,
  IndustrialContainer,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  userType: z.enum(['worker', 'startup', 'manufacturer'], {
    required_error: 'You need to select a user type.',
  }),
});

type SigninFormValues = z.infer<typeof formSchema>;

export function SigninForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'worker', // Set a default value instead of undefined
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Enhanced animation variants for industrial theme
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const gearVariants = {
    hidden: { rotate: -180, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
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
  async function onSubmit(data: SigninFormValues) {
    try {
      let response;

      // Call the appropriate signin API based on user type
      if (data.userType === 'worker') {
        response = await authAPI.workerSignin({
          email: data.email,
          password: data.password,
        });
      } else if (data.userType === 'startup') {
        response = await authAPI.startupSignin({
          companyEmail: data.email,
          password: data.password,
        });
      } else if (data.userType === 'manufacturer') {
        response = await authAPI.manufacturerSignin({
          companyEmail: data.email,
          password: data.password,
        });
      }

      if (response) {
        // Clean token by removing 'Bearer ' prefix if it exists
        const cleanToken = response.token.replace('Bearer ', '');

        // Extract user data from response (ensure userType is included)
        const userTypeEnum =
          data.userType === 'worker'
            ? UserType.WORKER
            : data.userType === 'startup'
              ? UserType.STARTUP
              : UserType.MANUFACTURER;

        const userData = {
          ...response.user,
          id: (response.user as any)._id || response.user.id, // Normalize _id to id
          userType: userTypeEnum, // Ensure userType is properly typed
        };

        // Store the token and user data
        localStorage.setItem('token', cleanToken);
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update auth store with the clean token and user data
        await login(cleanToken, userData);

        toast({
          title: 'Signed In Successfully',
          description: `Welcome back! Redirecting...`,
        });

        router.push(`/${data.userType}/dashboard`);
      }
    } catch (error: unknown) {
      console.error('Signin failed:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data &&
        typeof error.response.data.error === 'string'
      ) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: errorMessage,
      });
      form.setError('root', { type: 'manual', message: errorMessage });
    }
  }
  return (
    <IndustrialLayout>
      <IndustrialContainer className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4"
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
                  System Access
                </IndustrialCardTitle>
              </motion.div>
              <motion.div variants={headerVariants}>
                <IndustrialCardDescription className="font-industrial-body">
                  Enter your credentials to access the WorkLink industrial
                  network.
                </IndustrialCardDescription>
              </motion.div>
            </IndustrialCardHeader>{' '}
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
                            Account Type
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
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
                  <motion.div variants={formFieldVariants}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-industrial-body font-semibold">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <IndustrialInput
                              type="email"
                              placeholder="you@company.com"
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
                  </motion.div>{' '}
                  {form.formState.errors.root && (
                    <motion.div
                      variants={formFieldVariants}
                      className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg backdrop-blur-sm"
                    >
                      <p className="text-sm font-medium text-destructive flex items-center gap-2">
                        <IndustrialIcon icon="bolt" size="sm" />
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
                      disabled={isLoading}
                      asChild
                    >
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: '0 8px 32px rgba(234, 179, 8, 0.3)',
                        }}
                        whileTap={{
                          scale: 0.98,
                          y: 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <IndustrialIcon icon="gear" size="sm" animated />
                            Authenticating...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <IndustrialIcon icon="bolt" size="sm" />
                            Access System
                          </div>
                        )}
                      </motion.button>
                    </Button>
                  </motion.div>
                </motion.form>
              </Form>
            </IndustrialCardContent>{' '}
            <div className="flex flex-col items-center space-y-2 mt-4 p-6 pt-0">
              <motion.div className="text-center" variants={headerVariants}>
                <p className="text-sm text-industrial-secondary">
                  Need access credentials?{' '}
                  <Link
                    href="/signup"
                    className="font-medium text-industrial-accent hover:text-industrial-primary transition-colors duration-200"
                  >
                    Register Here
                  </Link>
                </p>
              </motion.div>
            </div>
          </IndustrialCard>
        </motion.div>
      </IndustrialContainer>
    </IndustrialLayout>
  );
}

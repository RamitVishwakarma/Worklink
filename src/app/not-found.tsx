'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import {
  IndustrialLayout,
  IndustrialContainer,
  IndustrialHeader,
} from '@/components/ui/industrial-layout';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/authStore';
import { UserType } from '@/lib/types';

export default function NotFound() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give a moment for the auth store to hydrate
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getDashboardLink = () => {
    if (!user || !token) return '/signin';

    switch (user.userType) {
      case UserType.WORKER:
        return '/worker/dashboard';
      case UserType.STARTUP:
        return '/startup/dashboard';
      case UserType.MANUFACTURER:
        return '/manufacturer/dashboard';
      default:
        return '/signin';
    }
  };

  const getPrimaryButtonText = () => {
    if (!user || !token) return 'Sign In';
    return 'Go to Dashboard';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <IndustrialLayout>
          <IndustrialContainer>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </IndustrialContainer>
        </IndustrialLayout>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <IndustrialLayout>
        <IndustrialContainer>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-8">
              <IndustrialIcon
                icon="wrench"
                size="xl"
                className="text-gray-500 mb-4"
              />
              <IndustrialHeader level={1} className="mb-4 text-gray-800">
                404 - Page Not Found
              </IndustrialHeader>
              <p className="text-gray-600 text-lg mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href={getDashboardLink()}>{getPrimaryButtonText()}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </IndustrialContainer>
      </IndustrialLayout>
      <Footer />
    </>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if the current path is a dashboard route
  const isDashboardRoute =
    pathname?.startsWith('/worker/') ||
    pathname?.startsWith('/startup/') ||
    pathname?.startsWith('/manufacturer/');

  if (isDashboardRoute) {
    // Dashboard routes don't get header/footer
    return <>{children}</>;
  }

  // All other routes get header and footer
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

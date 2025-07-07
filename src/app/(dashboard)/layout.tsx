import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { NotificationToast } from '@/components/ui/notifications';

export const metadata: Metadata = {
  title: 'Dashboard - WorkLink',
  description: 'Manage your WorkLink account, applications, and opportunities.',
  robots: 'noindex,nofollow', // Dashboard pages should not be indexed
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dashboard layout excludes header and footer from root layout
  // The individual user type layouts (worker/startup/manufacturer) handle their own structure
  return (
    <>
      {children}
      <Toaster />
      <NotificationToast />
    </>
  );
}

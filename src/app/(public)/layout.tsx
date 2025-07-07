import type { Metadata } from 'next';
import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'WorkLink - Connecting Industrial Talent with Opportunity',
  description:
    'Connect skilled workers with manufacturing jobs and industrial opportunities. Find gigs, showcase skills, and build your industrial career.',
  keywords:
    'industrial jobs, manufacturing careers, skilled workers, factory jobs, trade jobs',
  openGraph: {
    title: 'WorkLink - Industrial Job Platform',
    description:
      'Connecting skilled workers with manufacturing and industrial opportunities',
    type: 'website',
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

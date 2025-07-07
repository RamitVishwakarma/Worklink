import type { Metadata } from 'next';
import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'Sign In - WorkLink',
  description:
    'Access your WorkLink account to find industrial jobs, manage applications, and connect with opportunities.',
  robots: 'noindex,nofollow', // Prevent indexing of auth pages
};

export default function AuthLayout({
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

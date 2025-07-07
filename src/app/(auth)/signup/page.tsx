'use client';

import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <SignupForm />
      </div>
      <Footer />
    </>
  );
}

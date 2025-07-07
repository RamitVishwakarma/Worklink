'use client';

import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { SigninForm } from '@/components/auth';

export default function SigninPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <SigninForm />
      </div>
      <Footer />
    </>
  );
}

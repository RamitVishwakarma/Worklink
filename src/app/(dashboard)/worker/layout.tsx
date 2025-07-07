'use client';

import React from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

// Note: metadata export doesn't work in client components,
// so we'll handle titles through the DashboardLayout component

export default function WorkerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout userType="worker">{children}</DashboardLayout>;
}

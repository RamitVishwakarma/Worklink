'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function WorkerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout userType="worker">{children}</DashboardLayout>;
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { NotificationBell } from '@/components/ui/notifications';
import { useAuthStore } from '@/lib/store/authStore';

interface DashboardHeaderProps {
  userType: 'worker' | 'startup' | 'manufacturer';
}

export function DashboardHeader({ userType }: DashboardHeaderProps) {
  const { user } = useAuthStore();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <header className="bg-white border-b border-industrial-border shadow-sm h-[80px] fixed top-0 left-0 right-0 z-40">
      <div className="h-full flex items-center">
        <div className="w-64 px-4 border-r border-industrial-border flex items-center gap-3 h-full">
          <Image
            src="/logo.png"
            alt="WorkLink Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <h1 className="text-sm font-bold text-industrial-gunmetal-900">
              WorkLink
            </h1>
            <p className="text-xs text-industrial-gunmetal-600">
              {capitalize(userType)} Portal
            </p>
          </div>
        </div>

        {/* Right section - User Info */}
        <div className="flex-1 flex items-center justify-end px-6 gap-4">
          {/* Notifications */}
          <NotificationBell iconClassName="text-industrial-gunmetal-600 hover:text-industrial-navy-600" />

          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-industrial-border">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-industrial-gunmetal-900">
                {user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-industrial-gunmetal-600">
                {capitalize(userType)}
              </div>
            </div>
            <div className="p-2 flex items-center bg-industrial-navy-100 rounded-full">
              <IndustrialIcon
                icon="hardhat"
                size="md"
                className="text-industrial-navy-600 size-5"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

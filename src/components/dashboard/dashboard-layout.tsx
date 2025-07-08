'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from './dashboard-header';
import {
  LogOut,
  Menu,
  X,
  User,
  LayoutDashboard,
  Briefcase,
  FileText,
  Factory,
  Settings,
  Plus,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'worker' | 'startup' | 'manufacturer';
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation links based on user type
  const getNavLinks = () => {
    const commonLinks = [
      {
        href: `/${userType}/dashboard`,
        icon: LayoutDashboard,
        title: 'Dashboard',
        description: 'Overview & stats',
      },
      {
        href: `/${userType}/profile`,
        icon: User,
        title: 'Profile',
        description: 'Edit your profile',
      },
    ];

    const userSpecificLinks = {
      worker: [
        {
          href: '/worker/browse-gigs',
          icon: Briefcase,
          title: 'Browse Gigs',
          description: 'Find new opportunities',
        },
        {
          href: '/worker/applied-gigs',
          icon: FileText,
          title: 'Applied Gigs',
          description: 'Track your applications',
        },
        {
          href: '/worker/applications',
          icon: ClipboardList,
          title: 'Applications',
          description: 'View application status',
        },
      ],
      startup: [
        {
          href: '/startup/create-gig',
          icon: Plus,
          title: 'Create Gig',
          description: 'Post new opportunities',
        },
        {
          href: '/startup/gigs',
          icon: Briefcase,
          title: 'Your Gigs',
          description: 'Manage your postings',
        },
        {
          href: '/startup/machines',
          icon: Factory,
          title: 'Machines',
          description: 'Available equipment',
        },
      ],
      manufacturer: [
        {
          href: '/manufacturer/add-machine',
          icon: Plus,
          title: 'Add Machine',
          description: 'List new equipment',
        },
        {
          href: '/manufacturer/machines',
          icon: Factory,
          title: 'Your Machines',
          description: 'Manage your equipment',
        },
        {
          href: '/manufacturer/applications',
          icon: FileText,
          title: 'Applications',
          description: 'Review requests',
        },
      ],
    };

    return [...commonLinks, ...userSpecificLinks[userType]];
  };

  const navigationItems = getNavLinks();

  // Capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPortalName = () => {
    switch (userType) {
      case 'worker':
        return 'Worker Portal';
      case 'startup':
        return 'Startup Portal';
      case 'manufacturer':
        return 'Manufacturer Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <div className="min-h-screen bg-industrial-muted">
      {/* Dashboard Header */}
      <DashboardHeader userType={userType} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Always visible above 786px */}
      <div className="hidden md:fixed md:top-20 md:left-0 md:bottom-0 md:w-64 md:bg-white md:border-r md:border-gray-200 md:flex md:flex-col md:z-30">
        {/* Desktop Navigation Items */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group',
                pathname === item.href
                  ? 'text-industrial-navy-600 bg-industrial-navy-50 border-l-2 border-industrial-navy-600'
                  : 'text-industrial-gunmetal-600 hover:text-industrial-navy-600 hover:bg-industrial-navy-50'
              )}
            >
              <item.icon className="h-5 w-5 text-industrial-navy-800 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-industrial-gunmetal-500">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}

          {/* Additional Navigation */}
          <div className="pt-4 mt-4 border-t border-industrial-border">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg text-industrial-gunmetal-600 hover:text-industrial-navy-600 hover:bg-industrial-navy-50 transition-all duration-200 group"
            >
              <Settings className="h-5 w-5 text-industrial-navy-800 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="text-sm font-medium">Home</div>
                <div className="text-xs text-industrial-gunmetal-500">
                  Back to main site
                </div>
              </div>
            </Link>
            <Link
              href="/signin"
              className="flex items-center gap-3 p-3 rounded-lg text-industrial-gunmetal-600 hover:text-industrial-destructive hover:bg-red-50 transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 text-industrial-destructive group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-industrial-gunmetal-500">
                  End your session
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Collapsed Sidebar - Icons only */}
      <div className="md:hidden fixed top-20 left-0 bottom-0 w-16 bg-white border-r border-industrial-border flex flex-col z-30">
        {/* Mobile hamburger button */}
        <div className="p-2 border-b border-industrial-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="w-12 h-12 p-0 text-industrial-gunmetal-600 hover:text-industrial-navy-600 hover:bg-industrial-navy-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation Icons */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200',
                pathname === item.href
                  ? 'text-industrial-navy-600 bg-industrial-navy-50'
                  : 'text-industrial-gunmetal-600 hover:text-industrial-navy-600 hover:bg-industrial-navy-50'
              )}
              title={item.title}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Full Sidebar Overlay */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="md:hidden fixed top-20 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 overflow-y-auto"
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-industrial-navy-50 rounded-md border border-industrial-navy-200 flex items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="WorkLink Logo"
                width={20}
                height={20}
                className="object-contain"
              />
            </motion.div>
            <div>
              <h2 className="text-sm font-bold text-industrial-gunmetal-900">
                WorkLink
              </h2>
              <p className="text-xs text-industrial-gunmetal-600">
                {getPortalName()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
            className="text-industrial-gunmetal-600 hover:text-industrial-gunmetal-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation Items */}
        <div className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group',
                  pathname === item.href
                    ? 'text-industrial-navy-600 bg-industrial-navy-50 border-l-2 border-industrial-navy-600'
                    : 'text-industrial-gunmetal-600 hover:text-industrial-navy-600 hover:bg-industrial-navy-50'
                )}
              >
                <item.icon className="h-5 w-5 text-industrial-navy-800 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-industrial-gunmetal-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Additional Mobile Navigation */}
          <div className="pt-4 mt-4 border-t border-industrial-border">
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-industrial-gunmetal-600 hover:text-industrial-navy-600 hover:bg-industrial-navy-50 transition-all duration-200 group"
            >
              <Settings className="h-5 w-5 text-industrial-navy-800 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="text-sm font-medium">Home</div>
                <div className="text-xs text-industrial-gunmetal-500">
                  Back to main site
                </div>
              </div>
            </Link>
            <Link
              href="/signin"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-industrial-gunmetal-600 hover:text-industrial-destructive hover:bg-red-50 transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 text-industrial-destructive group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-industrial-gunmetal-500">
                  End your session
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="md:ml-64 ml-16 pt-20">
        <div className="p-0 sm:p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

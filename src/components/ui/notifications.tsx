'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useNotificationsStore,
  useUnreadNotifications,
  useRecentNotifications,
} from '@/lib/store/notificationsStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
}

export function NotificationBell({
  className,
  iconClassName,
}: NotificationBellProps) {
  const { unreadCount } = useNotificationsStore();
  const recentNotifications = useRecentNotifications(10);
  const { markAsRead, markAllAsRead, removeNotification } =
    useNotificationsStore();

  const handleNotificationClick = (
    notificationId: string,
    actionUrl?: string
  ) => {
    markAsRead(notificationId);
    if (actionUrl) {
      window.open(actionUrl, '_blank');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative hover:bg-industrial-muted/10 transition-colors',
            className
          )}
        >
          <Bell
            className={cn(
              'h-5 w-5',
              iconClassName || 'text-industrial-gunmetal-600'
            )}
          />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-industrial-accent text-industrial-background text-xs font-bold"
              variant="default"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-white border-industrial-border shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-industrial-gunmetal-900">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-industrial-gunmetal-600 hover:text-industrial-gunmetal-900"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-industrial-border" />

        <ScrollArea className="h-96">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-industrial-gunmetal-600">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentNotifications.map((notification) => {
                const Icon = iconMap[notification.type];
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors',
                      !notification.read && 'bg-gray-50'
                    )}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.actionUrl
                      )
                    }
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 mt-0.5 flex-shrink-0',
                        colorMap[notification.type]
                      )}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p
                          className={cn(
                            'text-sm font-medium text-gray-900',
                            !notification.read && 'font-semibold'
                          )}
                        >
                          {notification.title}
                        </p>

                        <div className="flex items-center space-x-1">
                          {notification.actionUrl && (
                            <ExternalLink className="h-3 w-3 text-gray-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-auto w-auto p-0.5 text-gray-500 hover:text-gray-900"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>

                        {notification.category && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0 border-gray-300 text-gray-600"
                          >
                            {notification.category}
                          </Badge>
                        )}
                      </div>

                      {notification.actionLabel && notification.actionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-6 text-xs border-industrial-accent text-industrial-accent hover:bg-industrial-accent hover:text-industrial-background"
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Toast-style notification component for immediate feedback
export function NotificationToast() {
  const [isClient, setIsClient] = useState(false);
  const unreadNotifications = useUnreadNotifications();
  const { markAsRead } = useNotificationsStore();

  // Ensure this only runs on the client to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR or before client hydration
  if (!isClient) return null;

  // Show only the most recent unread notification as a toast
  const latestNotification = unreadNotifications[0];

  if (!latestNotification) return null;

  const Icon = iconMap[latestNotification.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <div
          className={cn(
            'bg-industrial-background border border-industrial-muted/20 rounded-lg shadow-xl p-4',
            'backdrop-blur-sm bg-opacity-95'
          )}
        >
          <div className="flex items-start space-x-3">
            <Icon
              className={cn(
                'h-5 w-5 mt-0.5 flex-shrink-0',
                colorMap[latestNotification.type]
              )}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-industrial-foreground">
                {latestNotification.title}
              </p>
              <p className="text-xs text-industrial-muted mt-1">
                {latestNotification.message}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsRead(latestNotification.id)}
              className="h-auto w-auto p-1 text-industrial-muted hover:text-industrial-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

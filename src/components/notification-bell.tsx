'use client';

import { useState, useEffect } from 'react';
import { Bell, CircleNotch } from 'phosphor-react';
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserLastCheckedNotifications } from '@/lib/data';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';


export function NotificationBell() {
  const { user, userProfile } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Effect for the unread indicator dot
  useEffect(() => {
    if (!user || !userProfile?.lastCheckedNotifications) {
      setHasUnread(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', 'all'),
      where('createdAt', '>', userProfile.lastCheckedNotifications)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setHasUnread(!querySnapshot.empty);
    }, (error) => {
        console.error("Error with notification snapshot:", error);
        setHasUnread(false);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Fetch notifications when dropdown opens
      setIsLoading(true);
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef,
          where('userId', '==', 'all'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }

      // Mark as read by updating the user's last checked timestamp
      if (user) {
        await updateUserLastCheckedNotifications(user.uid);
        setHasUnread(false);
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
            <Bell className={cn("h-5 w-5", hasUnread && "animate-jiggle")} />
            <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <CircleNotch className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 whitespace-normal cursor-default">
              <p className="font-semibold">{notif.title}</p>
              <p className="text-sm text-muted-foreground">{notif.message}</p>
              <p className="text-xs text-muted-foreground/80">
                {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : ''}
              </p>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">No new notifications.</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

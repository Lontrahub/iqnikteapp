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
      where('createdAt', '>', userProfile.lastCheckedNotifications)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const hasUnreadBroadcasts = querySnapshot.docs.some(doc => doc.data().userId === 'all');
        setHasUnread(hasUnreadBroadcasts);
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
          orderBy('createdAt', 'desc'),
          limit(30) // Fetch more and filter in-app
        );
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification))
            .filter(notif => notif.userId === 'all')
            .slice(0, 6);
            
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }

      // Mark as read by updating the user's last checked timestamp
      if (user && hasUnread) {
        await updateUserLastCheckedNotifications(user.uid);
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {hasUnread && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                </span>
            )}
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
                {formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
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

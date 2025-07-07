'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'phosphor-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { Button } from './ui/button';

export function NotificationBell() {
  const { user, userProfile } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user || !userProfile?.lastCheckedNotifications) {
      setNotificationCount(0);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    
    const q = query(
      notificationsRef,
      where('userId', '==', 'all'),
      where('createdAt', '>', userProfile.lastCheckedNotifications)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setNotificationCount(querySnapshot.size);
    }, (error) => {
        console.error("Error with notification snapshot:", error);
        setNotificationCount(0);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  );
}

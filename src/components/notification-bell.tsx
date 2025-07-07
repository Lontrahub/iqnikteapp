'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';

export function NotificationBell() {
  const { user, userProfile } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // We need both the user and their profile with the timestamp to proceed.
    if (!user || !userProfile?.lastCheckedNotifications) {
      setNotificationCount(0);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    
    // Query for broadcast notifications created after the user last checked.
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
    <div className="relative inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-accent/50 transition-colors" role="button">
      <Bell className="h-5 w-5" />
      {notificationCount > 0 && (
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
        </span>
      )}
    </div>
  );
}

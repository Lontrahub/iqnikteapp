'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';

export function NotificationBell() {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      return;
    }

    try {
        // This query currently looks for user-specific notifications which are not yet implemented.
        // The bell count will remain at 0 for broadcast messages.
        const notificationsRef = collection(db, 'notifications');
        const q = query(
        notificationsRef,
        where('userId', '==', user.uid),
        where('read', '==', false)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setNotificationCount(querySnapshot.size);
        }, (error) => {
            console.error("Error with notification snapshot:", error);
        });

        return () => unsubscribe();
    } catch(error) {
        console.error("Error setting up notification listener:", error);
    }
  }, [user]);

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

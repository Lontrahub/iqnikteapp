
'use client';

import { useEffect, useState } from 'react';
import type { Notification as NotificationWithTimestamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { updateUserLastCheckedNotifications } from '@/lib/data';


// Client-safe type
type Notification = Omit<NotificationWithTimestamp, 'createdAt'> & {
  createdAt: string; 
};

interface NotificationListClientProps {
  notifications: Notification[];
}

export default function NotificationListClient({ notifications }: NotificationListClientProps) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      updateUserLastCheckedNotifications(user.uid);
    }
  }, [user]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
          <CardTitle className="font-serif text-3xl">{t('notificationsPage.title')}</CardTitle>
          <CardDescription>{t('notificationsPage.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <Card key={notif.id} className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">{notif.title}</CardTitle>
                  <CardDescription>
                    {isMounted ? new Date(notif.createdAt).toLocaleString() : '...'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{notif.message}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {t('notificationsPage.noNotifications')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


'use client';

import type { Notification as NotificationWithTimestamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Client-safe type
type Notification = Omit<NotificationWithTimestamp, 'createdAt'> & {
  createdAt: string; 
};

interface NotificationListClientProps {
  notifications: Notification[];
}

export default function NotificationListClient({ notifications }: NotificationListClientProps) {
  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <Card key={notif.id} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{notif.title}</CardTitle>
              <CardDescription>
                {new Date(notif.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notif.message}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">
          You have no new notifications.
        </p>
      )}
    </div>
  );
}

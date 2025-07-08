
import { getNotifications } from "@/lib/data";
import NotificationListClient from "./notification-list-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications | Mayan Medicine Guide",
    description: "View recent announcements and notifications.",
};

export default async function NotificationsPage() {
    const notificationsRaw = await getNotifications();
    // We only want to show broadcast notifications here
    const notifications = notificationsRaw
        .filter(notif => notif.userId === 'all')
        .map(notif => ({
            ...notif,
            createdAt: notif.createdAt.toDate().toISOString(),
        }));
    
    return (
        <main className="flex-1">
            <div className="container mx-auto py-10 px-4">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="font-serif text-3xl">Notifications</CardTitle>
                        <CardDescription>Recent announcements and updates from the community.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NotificationListClient initialNotifications={notifications} />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

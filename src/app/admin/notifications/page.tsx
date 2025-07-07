import { getNotifications } from "@/lib/data";
import NotificationClient from "./notification-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notification Management | Admin",
    description: "Send and review broadcast notifications.",
};

export default async function AdminNotificationsPage() {
    const notificationsRaw = await getNotifications();
    const notifications = notificationsRaw.map(notif => ({
        ...notif,
        createdAt: notif.createdAt.toDate().toISOString(),
    }));
    
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Notification Management</CardTitle>
                    <CardDescription>Send broadcast notifications to all users and review past announcements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <NotificationClient initialNotifications={notifications} />
                </CardContent>
            </Card>
        </div>
    );
}

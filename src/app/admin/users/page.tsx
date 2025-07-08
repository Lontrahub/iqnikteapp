import { getAllUsers } from "@/lib/data";
import UserListClient from "./user-list-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUsersPage() {
    const usersRaw = await getAllUsers();
    const users = usersRaw.map(user => ({
        ...user,
        createdAt: user.createdAt.toDate().toISOString(),
        lastCheckedNotifications: user.lastCheckedNotifications?.toDate().toISOString(),
    }));
    
    return (
        <div className="container py-10">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-serif text-3xl">User Management</CardTitle>
                    <CardDescription>View and manage all registered users in the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserListClient users={users} />
                </CardContent>
            </Card>
        </div>
    );
}

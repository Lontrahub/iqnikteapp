import { getAllUsers } from "@/lib/data";
import UserListClient from "./user-list-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUsersPage() {
    const users = await getAllUsers();
    
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">User Management</CardTitle>
                    <CardDescription>View and manage all registered users in the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserListClient users={users} />
                </CardContent>
            </Card>
        </div>
    );
}

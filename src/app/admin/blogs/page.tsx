import { getAllBlogs } from "@/lib/data";
import BlogListAdminClient from "./blog-list-admin-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminBlogsPage() {
    const blogs = await getAllBlogs();
    
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Article Management</CardTitle>
                    <CardDescription>Create, edit, and delete articles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogListAdminClient blogs={blogs} />
                </CardContent>
            </Card>
        </div>
    );
}

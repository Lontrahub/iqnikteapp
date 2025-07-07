
import BlogForm from "../../blog-form";
import { getBlogById, getAllPlantTitlesAndIds } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
    const [blog, plants] = await Promise.all([
        getBlogById(params.id),
        getAllPlantTitlesAndIds()
    ]);

    if (!blog) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Edit Article</CardTitle>
                    <CardDescription>Update the details for "{blog.title.en}" below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogForm blog={blog} plants={plants} />
                </CardContent>
            </Card>
        </div>
    );
}

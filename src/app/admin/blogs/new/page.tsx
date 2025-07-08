
import BlogForm from "../blog-form";
import { getAllPlantTitlesAndIds, getAllBlogTagsBilingual } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewBlogPage() {
    const [plants, tags] = await Promise.all([
        getAllPlantTitlesAndIds(),
        getAllBlogTagsBilingual(),
    ]);

    return (
        <div className="container py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-serif text-3xl">Create New Article</CardTitle>
                    <CardDescription>Fill out the form below to add a new article to the database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogForm plants={plants} existingTags={tags} />
                </CardContent>
            </Card>
        </div>
    );
}

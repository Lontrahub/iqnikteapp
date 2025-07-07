
import BlogForm from "../blog-form";
import { getAllPlantTitlesAndIds } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewBlogPage() {
    const plants = await getAllPlantTitlesAndIds();

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Create New Article</CardTitle>
                    <CardDescription>Fill out the form below to add a new article to the database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogForm plants={plants} />
                </CardContent>
            </Card>
        </div>
    );
}


import PlantForm from "../plant-form";
import { getAllBlogTitlesAndIds, getAllPlantTags } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewPlantPage() {
    const [blogs, tags] = await Promise.all([
        getAllBlogTitlesAndIds(),
        getAllPlantTags()
    ]);

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Create New Plant</CardTitle>
                    <CardDescription>Fill out the form below to add a new medicinal plant to the database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PlantForm blogs={blogs} existingTags={tags} />
                </CardContent>
            </Card>
        </div>
    );
}

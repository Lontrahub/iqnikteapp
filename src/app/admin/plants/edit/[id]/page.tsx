
import PlantForm from "../../plant-form";
import { getPlantById, getAllBlogTitlesAndIds, getAllPlantTags } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditPlantPage({ params }: { params: { id: string } }) {
    const [plantData, blogs, tags] = await Promise.all([
        getPlantById(params.id),
        getAllBlogTitlesAndIds(),
        getAllPlantTags()
    ]);

    if (!plantData) {
        notFound();
    }

    const plant = {
        ...plantData,
        createdAt: plantData.createdAt.toDate().toISOString(),
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Edit Plant</CardTitle>
                    <CardDescription>Update the details for "{plant.name.en}" below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PlantForm plant={plant} blogs={blogs} existingTags={tags} />
                </CardContent>
            </Card>
        </div>
    );
}

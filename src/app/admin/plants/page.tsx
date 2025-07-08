import { getAllPlants } from "@/lib/data";
import PlantListAdminClient from "./plant-list-admin-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPlantsPage() {
    const plantsRaw = await getAllPlants();
    const plants = plantsRaw.map(plant => ({
        ...plant,
        createdAt: plant.createdAt.toDate().toISOString(),
    }));
    
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-serif text-3xl">Plant Management</CardTitle>
                    <CardDescription>Create, edit, and delete medicinal plants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PlantListAdminClient plants={plants} />
                </CardContent>
            </Card>
        </div>
    );
}

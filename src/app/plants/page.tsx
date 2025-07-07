import { getAllPlants } from '@/lib/data';
import PlantListClient from './plant-list-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plant Database | Mayan Medicine Guide',
    description: 'Explore our collection of traditional medicinal plants.',
};

export default async function PlantsPage() {
    const allPlants = await getAllPlants();
    const allTags = [...new Set(allPlants.flatMap(plant => plant.tags || []))].sort();

    return (
        <main className="flex-1">
            <div className="container mx-auto py-8 px-4">
                <PlantListClient plants={allPlants} tags={allTags} />
            </div>
        </main>
    )
}

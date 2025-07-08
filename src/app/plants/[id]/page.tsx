import { getPlantById, getBlogsByIds } from '@/lib/data';
import PlantDetailClient from './plant-detail-client';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const plant = await getPlantById(id)
 
  if (!plant) {
    return {
      title: 'Plant Not Found',
      description: 'The requested plant could not be found.',
    }
  }

  // Using English for metadata for simplicity. This could be enhanced.
  const name = plant.name?.en || 'Plant';
  const description = plant.description?.en || 'Learn more about this Mayan medicinal plant.';
 
  return {
    title: `${name} | Mayan Medicine Guide`,
    description: description.substring(0, 160),
  }
}

export default async function PlantDetailPage({ params }: Props) {
    const plantData = await getPlantById(params.id);
    
    if (!plantData) {
        notFound();
    }

    const relatedBlogsData = await getBlogsByIds(plantData.relatedBlogs || []);

    const plant = {
        ...plantData,
        createdAt: plantData.createdAt.toDate().toISOString(),
    };

    const relatedBlogs = relatedBlogsData.map(blog => ({
        ...blog,
        createdAt: blog.createdAt.toDate().toISOString(),
    }));
    
    return (
        <main className="flex-1">
            <div className="container py-8">
                <PlantDetailClient plant={plant} relatedBlogs={relatedBlogs} />
            </div>
        </main>
    )
}

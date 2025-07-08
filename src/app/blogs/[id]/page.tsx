import { getBlogById, getPlantsByIds } from '@/lib/data';
import BlogDetailClient from './blog-detail-client';
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
  const blog = await getBlogById(id)
 
  if (!blog) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  // Using English for metadata for simplicity.
  const title = blog.title?.en || 'Article';
  const description = blog.content?.en.substring(0, 160) || 'Read more about this topic.';
 
  return {
    title: `${title} | Mayan Medicine Guide`,
    description: description.replace(/<[^>]*>?/gm, ''), // Strip HTML for description
  }
}

export default async function BlogDetailPage({ params }: Props) {
    const blogData = await getBlogById(params.id);
    
    if (!blogData) {
        notFound();
    }

    const relatedPlantsData = await getPlantsByIds(blogData.relatedPlants || []);

    const blog = {
        ...blogData,
        createdAt: blogData.createdAt.toDate().toISOString(),
    };

    const relatedPlants = relatedPlantsData.map(plant => ({
        ...plant,
        createdAt: plant.createdAt.toDate().toISOString(),
    }));
    
    return (
        <main className="flex-1">
            <div className="container py-8">
                <BlogDetailClient blog={blog} relatedPlants={relatedPlants} />
            </div>
        </main>
    )
}

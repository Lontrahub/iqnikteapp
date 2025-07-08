import { getProjectById } from '@/lib/data';
import ProjectDetailClient from './project-detail-client';
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
  const project = await getProjectById(id)
 
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    }
  }

  const title = project.title?.en || 'Project';
  const description = project.description?.en.substring(0, 160) || 'Learn more about this community project.';
 
  return {
    title: `${title} | Mayan Medicine Guide`,
    description: description.replace(/<[^>]*>?/gm, ''), // Strip HTML
  }
}

export default async function ProjectDetailPage({ params }: Props) {
    const projectData = await getProjectById(params.id);
    
    if (!projectData) {
        notFound();
    }

    const project = {
        ...projectData,
        createdAt: projectData.createdAt.toDate().toISOString(),
    };
    
    return (
        <main className="flex-1">
            <div className="container py-8">
                <ProjectDetailClient project={project} />
            </div>
        </main>
    )
}

import { getAllProjects } from '@/lib/data';
import ProjectListClient from './project-list-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Community Projects | Mayan Medicine Guide',
    description: 'Explore community-driven projects and initiatives.',
};

export default async function ProjectsPage() {
    const allProjectsRaw = await getAllProjects();
    const allProjects = allProjectsRaw.map(project => ({
        ...project,
        createdAt: project.createdAt.toDate().toISOString(),
    }));

    return (
        <main className="flex-1">
            <div className="container py-8">
                <ProjectListClient projects={allProjects} />
            </div>
        </main>
    )
}

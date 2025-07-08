'use client';

import { ProjectCard } from '@/components/project-card';
import type { Project as ProjectWithTimestamp } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';

// Client-safe type
type Project = Omit<ProjectWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface ProjectListClientProps {
    projects: Project[];
}

export default function ProjectListClient({ projects }: ProjectListClientProps) {
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="text-4xl font-serif text-primary mb-2">{t('projectListPage.title')}</h1>
            <p className="text-muted-foreground mb-6">{t('projectListPage.description')}</p>
            
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">{t('projectListPage.noProjectsFound')}</p>
                </div>
            )}
        </div>
    )
}

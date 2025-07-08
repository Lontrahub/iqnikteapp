'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project as ProjectWithTimestamp } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

// Client-safe type
type Project = Omit<ProjectWithTimestamp, 'createdAt'> & {
    createdAt: string;
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const language = useLanguage();
  const title = project.title?.[language] || project.title?.en || 'Untitled Project';
  const mainImage = project.imageUrls?.[0] || 'https://placehold.co/400x300.png';
  
  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
        <CardContent className="p-0 flex-grow">
          <div className="relative h-48 w-full">
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover"
              data-ai-hint="community project"
            />
          </div>
          <div className="p-4 bg-card">
            <h3 className="font-serif text-lg text-foreground truncate">{title}</h3>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
             <Badge variant={
                project.status === 'Completed' ? 'default' : 
                project.status === 'Ongoing' ? 'secondary' : 'outline'
            }>
                {project.status}
            </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}

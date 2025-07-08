'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Project as ProjectWithTimestamp, BilingualString } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Handshake, Target } from 'phosphor-react';

// Client-safe type
type Project = Omit<ProjectWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const language = useLanguage();
  const { t } = useTranslation();

  const getBilingualText = (text?: BilingualString) => {
    if (!text) return '';
    return text[language] || text.en;
  };

  const title = getBilingualText(project.title);
  const description = getBilingualText(project.description);
  const sanitizedDescription = description.replace(/style="[^"]*"/g, '');
  const goals = getBilingualText(project.goals);
  const team = getBilingualText(project.team);

  const ctaTitle = getBilingualText(project.cta.title);
  const ctaDescription = getBilingualText(project.cta.description);
  const ctaButtonText = getBilingualText(project.cta.buttonText);


  return (
    <article className="max-w-5xl mx-auto">
        {project.imageUrls && project.imageUrls.length > 0 && (
             <Carousel className="w-full shadow-lg rounded-lg overflow-hidden mb-8">
                <CarouselContent>
                    {project.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full aspect-[16/9]">
                             <Image
                                src={url}
                                alt={`${title} - image ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                                data-ai-hint="community project"
                            />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        )}

        <header className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-2">{title}</h1>
            <Badge variant={
                project.status === 'Completed' ? 'default' : 
                project.status === 'Ongoing' ? 'secondary' : 'outline'
            } className="text-lg py-1 px-4">
                {project.status}
            </Badge>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-10">
                <section>
                    <h2 className="text-3xl font-serif text-primary mb-4">{t('projectDetailPage.about')}</h2>
                    <div 
                        className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 
                                    prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }} 
                    />
                </section>
                
                {goals && (
                     <section>
                        <h2 className="text-3xl font-serif text-primary mb-4 flex items-center gap-3">
                            <Target weight="bold" className="h-8 w-8 text-accent"/>
                            {t('projectDetailPage.goals')}
                        </h2>
                        <p className="text-lg text-foreground/80 whitespace-pre-line">{goals}</p>
                    </section>
                )}

                 {team && (
                     <section>
                        <h2 className="text-3xl font-serif text-primary mb-4 flex items-center gap-3">
                            <Handshake weight="bold" className="h-8 w-8 text-accent" />
                            {t('projectDetailPage.team')}
                        </h2>
                        <p className="text-lg text-foreground/80 whitespace-pre-line">{team}</p>
                    </section>
                )}
            </div>

            <aside className="md:col-span-1">
                 <Card className="bg-muted/30 shadow-md sticky top-24">
                     <div className="relative h-40 w-full">
                        <Image
                            src={project.cta.imageUrl}
                            alt={ctaTitle}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint="support community"
                        />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-2xl font-serif font-bold text-accent mb-2">{ctaTitle}</h3>
                        {ctaDescription && <p className="text-muted-foreground mb-4">{ctaDescription}</p>}
                        <Button asChild size="lg" className="w-full">
                            <Link href={project.cta.buttonUrl} target="_blank" rel="noopener noreferrer">
                                {ctaButtonText}
                            </Link>
                        </Button>
                    </div>
                 </Card>
            </aside>
        </div>
    </article>
  );
}

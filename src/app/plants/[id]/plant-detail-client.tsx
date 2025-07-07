'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { Plant as PlantWithTimestamp, Blog as BlogWithTimestamp, BilingualString } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import LockedContentPrompt from '@/components/locked-content-prompt';
import { BookOpen, Leaf, FirstAidKit, Globe, CircleNotch } from 'phosphor-react';

// Client-safe types
type Plant = Omit<PlantWithTimestamp, 'createdAt'> & {
  createdAt: string;
};
type Blog = Omit<BlogWithTimestamp, 'createdAt'> & {
  createdAt: string;
};


interface PlantDetailClientProps {
  plant: Plant;
  relatedBlogs: Blog[];
}

export default function PlantDetailClient({ plant, relatedBlogs }: PlantDetailClientProps) {
  const { user, loading } = useAuth();
  const language = useLanguage();

  const getBilingualText = (text?: BilingualString) => {
    if (!text) return '';
    return text[language] || text.en;
  };

  const name = getBilingualText(plant.name);
  const description = getBilingualText(plant.description);
  const properties = getBilingualText(plant.properties);
  const uses = getBilingualText(plant.uses);
  const culturalSignificance = getBilingualText(plant.culturalSignificance);

  if (loading) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <CircleNotch className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Checking access...</p>
        </div>
    );
  }
  
  if (plant.isLocked && !user) {
    return <LockedContentPrompt />;
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
                src={plant.imageUrl || 'https://placehold.co/800x600.png'}
                alt={name}
                fill
                className="object-cover"
                priority
                data-ai-hint="medicinal plant"
            />
        </div>
        
        <h1 className="font-headline text-4xl md:text-5xl text-primary mt-6">{name}</h1>
        
        {plant.tags && plant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
                {plant.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
        )}

        <div className="mt-8">
            <Accordion type="multiple" defaultValue={['description']} className="w-full">
                <AccordionItem value="description">
                    <AccordionTrigger className="text-2xl font-headline hover:no-underline">
                        <BookOpen className="mr-3 h-6 w-6 text-accent" /> Description
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-foreground/80 pl-12">
                        <p>{description}</p>
                    </AccordionContent>
                </AccordionItem>

                {properties && (
                    <AccordionItem value="properties">
                        <AccordionTrigger className="text-2xl font-headline hover:no-underline">
                           <Leaf className="mr-3 h-6 w-6 text-accent" /> Key Properties
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-12">
                           <p>{properties}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {uses && (
                     <AccordionItem value="uses">
                        <AccordionTrigger className="text-2xl font-headline hover:no-underline">
                           <FirstAidKit className="mr-3 h-6 w-6 text-accent" /> Basic Uses
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-12">
                            <p>{uses}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {culturalSignificance && (
                    <AccordionItem value="culturalSignificance">
                        <AccordionTrigger className="text-2xl font-headline hover:no-underline">
                           <Globe className="mr-3 h-6 w-6 text-accent" /> Cultural Significance
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-12">
                            <p>{culturalSignificance}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
        
        {relatedBlogs.length > 0 && (
            <div className="mt-12">
                <h2 className="text-3xl font-headline text-primary mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedBlogs.map(blog => {
                        const blogTitle = getBilingualText(blog.title);
                        return (
                            <Link key={blog.id} href={`/blogs/${blog.id}`} className="block p-4 border rounded-lg hover:bg-card transition-colors">
                                <h3 className="font-semibold text-accent">{blogTitle}</h3>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )}

    </div>
  );
}

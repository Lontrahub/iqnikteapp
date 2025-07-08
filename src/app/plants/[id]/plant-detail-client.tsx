
'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { Plant as PlantWithTimestamp, Blog as BlogWithTimestamp, BilingualString } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/hooks/use-translation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import LockedContentPrompt from '@/components/locked-content-prompt';
import { BookOpen, FirstAidKit, Globe, CircleNotch, Flask, Heartbeat, Handshake, WarningCircle, YoutubeLogo } from 'phosphor-react';

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
  const { t } = useTranslation();

  const getBilingualText = (text?: BilingualString) => {
    if (!text) return '';
    return text[language] || text.en;
  };

  const name = getBilingualText(plant.name);
  const family = getBilingualText(plant.family);
  const description = getBilingualText(plant.description);
  const properties = getBilingualText(plant.properties);
  const uses = getBilingualText(plant.uses);
  const culturalSignificance = getBilingualText(plant.culturalSignificance);
  const preparationMethods = getBilingualText(plant.preparationMethods);
  const dosage = getBilingualText(plant.dosage);
  const precautions = getBilingualText(plant.precautions);
  const ethicalHarvesting = getBilingualText(plant.ethicalHarvesting);

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId: string | null = null;
    
    // Standard URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('watch?v=')) {
        videoId = url.split('v=')[1];
    } 
    // Shortened URL: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
    }

    if (videoId) {
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(plant.videoUrl);
  const sanitizedPreparationMethods = preparationMethods.replace(/style="[^"]*"/g, '');


  if (loading) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <CircleNotch className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">{t('plantDetailPage.checkingAccess')}</p>
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
        
        <h1 className="font-serif text-4xl md:text-5xl text-primary mt-6 tracking-wide">{name}</h1>
        {(plant.scientificName || family) && (
            <p className="text-lg text-muted-foreground mt-1">
                <em>{plant.scientificName}</em> {family && `(${family})`}
            </p>
        )}
        
        {plant.tags && plant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
                {plant.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
        )}

        {precautions && (
          <Accordion type="single" collapsible className="w-full mt-8">
            <AccordionItem value="precautions" className="border-none">
              <div className="bg-destructive/5 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-lg font-serif hover:no-underline">
                   <div className="flex items-center gap-3">
                      <WarningCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                      <span className="text-destructive dark:text-primary">{t('plantDetailPage.precautions')}</span>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-base text-foreground/90">
                  {precautions}
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        )}

        <div className="mt-8">
            <Accordion type="multiple" defaultValue={['description']} className="w-full space-y-2">
                <AccordionItem value="description" className="bg-foreground/5 rounded-lg border-none">
                    <AccordionTrigger className="text-2xl font-serif hover:no-underline px-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent p-1.5 text-accent-foreground">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span>{t('plantDetailPage.description')}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-foreground/80 pl-16 pr-4">
                        <p>{description}</p>
                    </AccordionContent>
                </AccordionItem>

                {properties && (
                    <AccordionItem value="properties" className="bg-foreground/5 rounded-lg border-none">
                        <AccordionTrigger className="text-2xl font-serif hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent p-1 text-accent-foreground">
                                    <Image src="/logo.png" alt="Property Icon" width={24} height={24} className="rounded-full" />
                                </div>
                                <span>{t('plantDetailPage.keyProperties')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-16 pr-4">
                           <p>{properties}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {uses && (
                     <AccordionItem value="uses" className="bg-foreground/5 rounded-lg border-none">
                        <AccordionTrigger className="text-2xl font-serif hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent p-1.5 text-accent-foreground">
                                    <FirstAidKit className="h-5 w-5" />
                                </div>
                                <span>{t('plantDetailPage.basicUses')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-16 pr-4">
                            <p>{uses}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}
                
                {(preparationMethods || dosage) && (
                    <AccordionItem value="preparation" className="bg-foreground/5 rounded-lg border-none">
                        <AccordionTrigger className="text-2xl font-serif hover:no-underline px-4">
                             <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent p-1.5 text-accent-foreground">
                                    <Flask className="h-5 w-5" />
                                </div>
                                <span>{t('plantDetailPage.preparationAndDosage')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-16 pr-4 space-y-4">
                            {preparationMethods && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">{t('plantDetailPage.preparationMethods')}</h4>
                                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedPreparationMethods }} />
                                </div>
                            )}
                             {dosage && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent p-1 text-accent-foreground">
                                            <Heartbeat className="h-4 w-4" />
                                        </div>
                                        <span>{t('plantDetailPage.dosage')}</span>
                                    </h4>
                                    <p>{dosage}</p>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {culturalSignificance && (
                    <AccordionItem value="culturalSignificance" className="bg-foreground/5 rounded-lg border-none">
                        <AccordionTrigger className="text-2xl font-serif hover:no-underline px-4">
                           <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent p-1.5 text-accent-foreground">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <span>{t('plantDetailPage.culturalSignificance')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-16 pr-4">
                            <p>{culturalSignificance}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}

                 {ethicalHarvesting && (
                    <AccordionItem value="harvesting" className="bg-foreground/5 rounded-lg border-none">
                        <AccordionTrigger className="text-2xl font-serif hover:no-underline px-4">
                           <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent p-1.5 text-accent-foreground">
                                    <Handshake className="h-5 w-5" />
                                </div>
                                <span>{t('plantDetailPage.ethicalHarvesting')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80 pl-16 pr-4">
                            <p>{ethicalHarvesting}</p>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>

        {embedUrl && (
            <div className="mt-12">
                <h2 className="text-3xl font-serif text-primary mb-4 flex items-center gap-3 tracking-wide">
                    <YoutubeLogo className="h-8 w-8 text-[#FF0000]" />
                    {t('plantDetailPage.relatedVideo')}
                </h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                    <iframe 
                        width="100%" 
                        height="100%"
                        src={embedUrl}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        )}
        
        {relatedBlogs.length > 0 && (
            <div className="mt-12">
                <h2 className="text-3xl font-serif text-primary mb-4 tracking-wide">{t('plantDetailPage.relatedArticles')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedBlogs.map(blog => {
                        const blogTitle = getBilingualText(blog.title);
                        return (
                            <Link key={blog.id} href={`/blogs/${blog.id}`} className="block p-4 rounded-lg hover:bg-card transition-colors">
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


'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { Blog as BlogWithTimestamp, Plant as PlantWithTimestamp, BilingualString, BilingualTag } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/hooks/use-translation';
import LockedContentPrompt from '@/components/locked-content-prompt';
import { CircleNotch } from 'phosphor-react';
import { Badge } from '@/components/ui/badge';

// Client-safe types
type Blog = Omit<BlogWithTimestamp, 'createdAt'> & {
  createdAt: string;
};
type Plant = Omit<PlantWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface BlogDetailClientProps {
  blog: Blog;
  relatedPlants: Plant[];
}

export default function BlogDetailClient({ blog, relatedPlants }: BlogDetailClientProps) {
  const { user, loading } = useAuth();
  const language = useLanguage();
  const { t } = useTranslation();

  const getBilingualText = (text?: BilingualString | BilingualTag) => {
    if (!text) return '';
    return text[language] || text.en;
  };

  const title = getBilingualText(blog.title);
  const content = getBilingualText(blog.content);
  const sanitizedContent = content.replace(/style="[^"]*"/g, '');


  if (loading) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <CircleNotch className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">{t('blogDetailPage.checkingAccess')}</p>
        </div>
    );
  }
  
  if (blog.isLocked && !user) {
    return <LockedContentPrompt />;
  }

  return (
    <article className="max-w-4xl mx-auto">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
            <Image
                src={blog.imageUrl || 'https://placehold.co/800x600.png'}
                alt={title}
                fill
                className="object-cover"
                priority
                data-ai-hint="article illustration"
            />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl text-primary mt-6">{title}</h1>

        {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, index) => (
                    <Badge key={`${tag.id}-${index}`} variant="secondary">{getBilingualText(tag)}</Badge>
                ))}
            </div>
        )}
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mt-8 text-foreground/90 
                     prose-headings:font-serif prose-headings:text-primary 
                     prose-p:leading-relaxed
                     prose-a:text-accent hover:prose-a:text-accent/80"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
        />
        
        {relatedPlants.length > 0 && (
            <div className="mt-12">
                <h2 className="text-3xl font-serif text-primary mb-4 flex items-center">
                    <Image src="/logo.png" alt="Related Plants Icon" width={32} height={32} className="mr-3 rounded-lg" />
                    {t('blogDetailPage.relatedPlants')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedPlants.map(plant => {
                        const plantName = getBilingualText(plant.name);
                        return (
                            <Link key={plant.id} href={`/plants/${plant.id}`} className="block p-4 rounded-lg border bg-card hover:bg-muted transition-all shadow-md hover:shadow-lg">
                                <h3 className="font-semibold text-accent dark:text-foreground">{plantName}</h3>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )}

    </article>
  );
}

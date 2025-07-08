'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { Plant as PlantWithTimestamp, Blog as BlogWithTimestamp, Banner } from '@/lib/types';
import { PlantCard } from '@/components/plant-card';
import { BlogCard } from '@/components/blog-card';
import { useTranslation } from '@/hooks/use-translation';

// Client-safe types
type Plant = Omit<PlantWithTimestamp, 'createdAt'> & {
  createdAt: string;
};
type Blog = Omit<BlogWithTimestamp, 'createdAt'> & {
  createdAt: string;
};
interface HomeClientProps {
  banner: Banner | null;
  recentPlants: Plant[];
  recentBlogs: Blog[];
}

export default function HomeClient({ banner, recentPlants, recentBlogs }: HomeClientProps) {
  const { t } = useTranslation();

  return (
    <>
      {banner && banner.imageUrl && (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12 shadow-lg">
              <Image
                  src={banner.imageUrl}
                  alt="Welcome Banner"
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="mayan temple"
              />
          </div>
      )}
      
      <div className="space-y-12">
          {recentPlants.length > 0 && (
              <section>
                  <h2 className="text-3xl font-serif text-primary mb-6">{t('homePage.newPlants')}</h2>
                  <Carousel
                      opts={{
                          align: "start",
                          loop: false,
                      }}
                      className="w-full"
                  >
                      <CarouselContent>
                          {recentPlants.map((plant) => (
                              <CarouselItem key={plant.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                  <div className="p-1">
                                      <PlantCard plant={plant} />
                                  </div>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex" />
                      <CarouselNext className="hidden md:flex" />
                  </Carousel>
              </section>
          )}

          {recentBlogs.length > 0 && (
              <section>
                  <h2 className="text-3xl font-serif text-primary mb-6">{t('homePage.recentArticles')}</h2>
                  <Carousel
                      opts={{
                          align: "start",
                          loop: false,
                      }}
                      className="w-full"
                  >
                      <CarouselContent>
                          {recentBlogs.map((blog) => (
                              <CarouselItem key={blog.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                  <div className="p-1">
                                      <BlogCard blog={blog} />
                                  </div>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex" />
                      <CarouselNext className="hidden md:flex" />
                  </Carousel>
              </section>
          )}
          
          {(recentPlants.length === 0 && recentBlogs.length === 0 && !banner) && (
            <div className="text-center py-16">
              <h1 className="text-5xl md:text-7xl font-serif text-primary drop-shadow-sm">Mayan Medicine Guide</h1>
              <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
                {t('homePage.welcomeMessage')}
              </p>
            </div>
          )}
      </div>
    </>
  );
}

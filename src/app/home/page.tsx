import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getMainBanner, getRecentPlants, getRecentBlogs } from '@/lib/data';
import { PlantCard } from '@/components/plant-card';
import { BlogCard } from '@/components/blog-card';

export default async function HomePage() {
  const banner = await getMainBanner();
  const recentPlants = await getRecentPlants();
  const recentBlogs = await getRecentBlogs();

  return (
    <main className="flex-1 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto py-8 px-4">
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
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                        <h1 className="text-4xl md:text-6xl font-headline text-white drop-shadow-md text-center">
                            Welcome to IQ Nikte'
                        </h1>
                    </div>
                </div>
            )}
            
            <div className="space-y-12">
                {recentPlants.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-headline text-primary mb-6">New Plants</h2>
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
                        <h2 className="text-3xl font-headline text-primary mb-6">Popular Articles</h2>
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
                    <h1 className="text-5xl md:text-7xl font-headline text-primary drop-shadow-sm">Mayan Medicine Guide</h1>
                    <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto font-body">
                      Content is coming soon! Please check back later for new plants and articles.
                    </p>
                  </div>
                )}
            </div>
        </div>
    </main>
  );
}

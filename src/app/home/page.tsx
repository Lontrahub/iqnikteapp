import { getMainBanner, getRecentPlants, getRecentBlogs } from '@/lib/data';
import HomeClient from './home-client';

export default async function HomePage() {
  const banner = await getMainBanner();
  const recentPlantsRaw = await getRecentPlants();
  const recentBlogsRaw = await getRecentBlogs();

  const recentPlants = recentPlantsRaw.map(plant => ({
      ...plant,
      createdAt: plant.createdAt.toDate().toISOString(),
  }));

  const recentBlogs = recentBlogsRaw.map(blog => ({
      ...blog,
      createdAt: blog.createdAt.toDate().toISOString(),
  }));

  return (
    <main className="flex-1 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto py-8 px-4">
            <HomeClient banner={banner} recentPlants={recentPlants} recentBlogs={recentBlogs} />
        </div>
    </main>
  );
}

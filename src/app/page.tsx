import RecommendationClient from './recommendation-client';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-secondary/30">
        <div className="text-center my-12">
            <h1 className="text-5xl md:text-7xl font-headline text-primary drop-shadow-sm">Mayan Medicine Guide</h1>
            <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto font-body">
                Rediscover ancient wisdom. Find traditional Mayan medicinal plants for your wellness needs.
            </p>
        </div>
        <RecommendationClient />
    </main>
  );
}

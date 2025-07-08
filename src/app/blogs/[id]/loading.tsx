import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailLoading() {
  return (
    <main className="flex-1">
        <div className="container py-10">
            <div className="max-w-4xl mx-auto">
                {/* Image */}
                <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
                
                {/* Title */}
                <Skeleton className="h-10 w-2/3 mt-6" />

                {/* Content */}
                <div className="space-y-4 mt-8">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>

                {/* Related Plants */}
                <Skeleton className="h-8 w-48 mt-12 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        </div>
    </main>
  );
}

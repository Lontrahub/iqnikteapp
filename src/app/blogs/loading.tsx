import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogsLoading() {
  return (
    <div className="flex-1">
        <div className="container mx-auto py-8 px-4">
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-6" />

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Skeleton className="h-10 flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-0">
                            <Skeleton className="h-40 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );
}

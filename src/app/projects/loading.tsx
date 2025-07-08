import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ProjectsLoading() {
  return (
    <div className="flex-1">
        <div className="container py-8">
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-0">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Skeleton className="h-6 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );
}

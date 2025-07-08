import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <main className="flex-1">
        <div className="container py-10">
            <div className="max-w-5xl mx-auto">
                <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
                <Skeleton className="h-10 w-2/3 mt-6 mb-2 mx-auto" />
                <Skeleton className="h-8 w-28 mx-auto" />
                
                <div className="grid md:grid-cols-3 gap-12 mt-12">
                    <div className="md:col-span-2 space-y-10">
                        <div>
                            <Skeleton className="h-8 w-48 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                         <div>
                            <Skeleton className="h-8 w-40 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                         <div>
                            <Skeleton className="h-8 w-40 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    </div>
                     <div className="md:col-span-1">
                        <Skeleton className="h-80 w-full" />
                    </div>
                </div>

            </div>
        </div>
    </main>
  );
}

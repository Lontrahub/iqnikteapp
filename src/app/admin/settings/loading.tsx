import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-64 w-full" />
                <div className="flex gap-4 mt-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
             <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function PlantDetailLoading() {
  return (
    <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Image */}
                <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
                
                {/* Title */}
                <Skeleton className="h-10 w-2/3 mt-6" />
                <Skeleton className="h-5 w-1/3 mt-2" />

                <div className="mt-8">
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger><Skeleton className="h-7 w-48" /></AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-4/5" />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger><Skeleton className="h-7 w-40" /></AccordionTrigger>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger><Skeleton className="h-7 w-32" /></AccordionTrigger>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger><Skeleton className="h-7 w-52" /></AccordionTrigger>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Related Blogs */}
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

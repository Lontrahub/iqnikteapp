'use client';

import { useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recommendMedicinalPlants, RecommendMedicinalPlantsOutput } from '@/ai/flows/recommend-medicinal-plants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Robot, CircleNotch } from 'phosphor-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecommendationClient() {
  const [recommendations, setRecommendations] = useState<RecommendMedicinalPlantsOutput['recommendations'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await recommendMedicinalPlants({ symptoms: data.symptoms });
      if (result && result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      } else {
        toast({
            variant: "destructive",
            title: "No recommendations found",
            description: "We couldn't find any recommendations for your symptoms. Please try again with different keywords.",
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get recommendations. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 mb-12">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Robot className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <CardTitle className="font-headline text-2xl">AI Plant Recommendation</CardTitle>
              <CardDescription className="font-body">Describe your symptoms and our AI will suggest traditional Mayan plants that may help.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a headache and an upset stomach...'"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    <Image src="/logo.png" alt="Find Plants Icon" width={20} height={20} className="mr-2 rounded-lg" />
                    Find Plants
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {recommendations && (
        <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h2 className="text-2xl font-headline text-center">Recommended Plants</h2>
            {recommendations.map((plant, index) => (
                <Card key={index} className="bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline text-primary">
                        <Image src="/logo.png" alt="Plant Icon" width={20} height={20} className="rounded-lg"/>
                        {plant.plantName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-body text-foreground/80">{plant.description}</p>
                </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}

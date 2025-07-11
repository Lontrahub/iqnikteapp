'use client';

import { useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { answerUserQuery } from '@/ai/flows/recommend-medicinal-plants';
import type { UserQueryOutput } from '@/ai/flows/recommend-medicinal-plants.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Robot, CircleNotch } from 'phosphor-react';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from '@/hooks/use-translation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your query in at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecommendationClient() {
  const [response, setResponse] = useState<UserQueryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await answerUserQuery({ query: data.symptoms });
      if (result && result.answer) {
        setResponse(result);
      } else {
        toast({
            variant: "destructive",
            title: t('aiRecommender.noRecommendationsToast'),
            description: t('aiRecommender.noRecommendationsToastDescription'),
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get an answer. Please try again later.",
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
              <CardTitle className="font-serif text-2xl">{t('aiRecommender.title')}</CardTitle>
              <CardDescription>{t('aiRecommender.description')}</CardDescription>
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
                    <FormLabel className="font-semibold">{t('aiRecommender.symptomsLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('aiRecommender.symptomsPlaceholder')}
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
                    {t('aiRecommender.gettingRecommendations')}
                  </>
                ) : (
                  <>
                    <Image src="/logo.png" alt="Find Plants Icon" width={20} height={20} className="mr-2 rounded-lg" />
                    {t('aiRecommender.findPlantsButton')}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {response && (
        <Card className="animate-in fade-in-50 duration-500 bg-card/80">
            <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">{t('aiRecommender.recommendationsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>{response.answer}</Markdown>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

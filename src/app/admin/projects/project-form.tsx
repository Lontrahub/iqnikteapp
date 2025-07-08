'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdateProject } from '@/lib/data';
import type { Project as ProjectWithTimestamp } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CircleNotch } from 'phosphor-react';
import ImageUploader from '@/components/image-uploader';
import MultiImageUploader from '@/components/multi-image-uploader';
import { RichTextEditor } from '@/components/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    es: z.string().min(1, 'Spanish title is required'),
  }),
  status: z.enum(['Ongoing', 'Completed', 'Upcoming']),
  description: z.object({
    en: z.string().min(1, 'English description is required'),
    es: z.string().min(1, 'Spanish description is required'),
  }),
  imageUrls: z.array(z.string().url()).min(1, 'At least one image is required').max(5, 'You can upload a maximum of 5 images.'),
  goals: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  team: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  cta: z.object({
    title: z.object({
      en: z.string().min(1, 'CTA English title is required'),
      es: z.string().min(1, 'CTA Spanish title is required'),
    }),
    description: z.object({
      en: z.string().optional(),
      es: z.string().optional(),
    }),
    imageUrl: z.string().url('A valid CTA image URL is required.'),
    buttonText: z.object({
      en: z.string().min(1, 'CTA English button text is required'),
      es: z.string().min(1, 'CTA Spanish button text is required'),
    }),
    buttonUrl: z.string().url('A valid CTA button URL is required.'),
  }),
});

type ProjectFormValues = z.infer<typeof formSchema>;

type Project = Omit<ProjectWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isEditMode = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: { en: project?.title.en || '', es: project?.title.es || '' },
      status: project?.status || 'Upcoming',
      description: { en: project?.description.en || '', es: project?.description.es || '' },
      imageUrls: project?.imageUrls || [],
      goals: { en: project?.goals?.en || '', es: project?.goals?.es || '' },
      team: { en: project?.team?.en || '', es: project?.team?.es || '' },
      cta: {
        title: { en: project?.cta?.title.en || '', es: project?.cta?.title.es || '' },
        description: { en: project?.cta?.description?.en || '', es: project?.cta?.description?.es || '' },
        imageUrl: project?.cta?.imageUrl || '',
        buttonText: { en: project?.cta?.buttonText.en || '', es: project?.cta?.buttonText.es || '' },
        buttonUrl: project?.cta?.buttonUrl || '',
      },
    },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (data: ProjectFormValues) => {
    const result = await createOrUpdateProject({
      id: project?.id,
      ...data,
    });

    if (result.success) {
      toast({
        title: `Project ${isEditMode ? 'Updated' : 'Created'}`,
        description: `The project "${data.title.en}" has been saved.`,
      });
      router.push('/admin/projects');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <FormField
            control={control}
            name="title.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (English)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="title.es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Spanish)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Images (Max 5)</h3>
          <FormField
            control={control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiImageUploader 
                    initialUrls={field.value}
                    onUrlsChange={field.onChange}
                    maxImages={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            control={control}
            name="description.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <RichTextEditor {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description.es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Spanish)</FormLabel>
                <RichTextEditor {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            control={control}
            name="goals.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goals (English)</FormLabel>
                <FormControl><Textarea {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="goals.es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goals (Spanish)</FormLabel>
                <FormControl><Textarea {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            control={control}
            name="team.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team (English)</FormLabel>
                <FormControl><Textarea {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="team.es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team (Spanish)</FormLabel>
                <FormControl><Textarea {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-6 rounded-lg border p-6">
            <h3 className="text-xl font-serif">Call to Action Section</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                    control={control}
                    name="cta.title.en"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Title (EN)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="cta.title.es"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Title (ES)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                    control={control}
                    name="cta.description.en"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Description (EN)</FormLabel>
                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="cta.description.es"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Description (ES)</FormLabel>
                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <FormField
                control={control}
                name="cta.imageUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Image</FormLabel>
                        <FormControl>
                            <ImageUploader 
                                initialImageUrl={field.value} 
                                onUploadComplete={(url) => field.onChange(url)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                    control={control}
                    name="cta.buttonText.en"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Button Text (EN)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="cta.buttonText.es"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CTA Button Text (ES)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name="cta.buttonUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>CTA Button URL</FormLabel>
                    <FormControl><Input {...field} placeholder="https://example.com" /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update' : 'Create'} Project
          </Button>
        </div>
      </form>
    </Form>
  );
}

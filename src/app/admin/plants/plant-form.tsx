'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdatePlant } from '@/lib/data';
import type { Plant } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CircleNotch } from 'phosphor-react';
import ImageUploader from '@/components/image-uploader';
import { MultiSelect } from '@/components/ui/multi-select';
import { RichTextEditor } from '@/components/rich-text-editor';
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
  name: z.object({
    en: z.string().min(1, 'English name is required'),
    es: z.string().min(1, 'Spanish name is required'),
  }),
  scientificName: z.string().optional(),
  family: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  description: z.object({
    en: z.string().min(1, 'English description is required'),
    es: z.string().min(1, 'Spanish description is required'),
  }),
  properties: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  uses: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  culturalSignificance: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  preparationMethods: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  dosage: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  precautions: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  ethicalHarvesting: z.object({
    en: z.string().optional(),
    es: z.string().optional(),
  }),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isLocked: z.boolean(),
  tags: z.array(z.string()).optional(),
  relatedBlogs: z.array(z.string()).optional(),
});

type PlantFormValues = z.infer<typeof formSchema>;

interface PlantFormProps {
  plant?: Plant;
  blogs: { id: string; title: string }[];
  existingTags: string[];
}

const FormInput = ({ control, name, label, description, component: Component, ...props }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Component {...field} {...props} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function PlantForm({ plant, blogs, existingTags }: PlantFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!plant;

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: { en: plant?.name.en || '', es: plant?.name.es || '' },
      scientificName: plant?.scientificName || '',
      family: { en: plant?.family?.en || '', es: plant?.family?.es || '' },
      description: { en: plant?.description.en || '', es: plant?.description.es || '' },
      properties: { en: plant?.properties?.en || '', es: plant?.properties?.es || '' },
      uses: { en: plant?.uses?.en || '', es: plant?.uses?.es || '' },
      culturalSignificance: { en: plant?.culturalSignificance?.en || '', es: plant?.culturalSignificance?.es || '' },
      preparationMethods: { en: plant?.preparationMethods?.en || '', es: plant?.preparationMethods?.es || '' },
      dosage: { en: plant?.dosage?.en || '', es: plant?.dosage?.es || '' },
      precautions: { en: plant?.precautions?.en || '', es: plant?.precautions?.es || '' },
      ethicalHarvesting: { en: plant?.ethicalHarvesting?.en || '', es: plant?.ethicalHarvesting?.es || '' },
      imageUrl: plant?.imageUrl || '',
      videoUrl: plant?.videoUrl || '',
      isLocked: plant?.isLocked || false,
      tags: plant?.tags || [],
      relatedBlogs: plant?.relatedBlogs || [],
    },
  });

  const { handleSubmit, control, formState, setValue } = form;

  const onSubmit = async (data: PlantFormValues) => {
    const result = await createOrUpdatePlant({
      id: plant?.id,
      ...data,
    });

    if (result.success) {
      toast({
        title: `Plant ${isEditMode ? 'Updated' : 'Created'}`,
        description: `The plant "${data.name.en}" has been saved successfully.`,
      });
      router.push('/admin/plants');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  const blogOptions = blogs.map(b => ({ value: b.id, label: b.title }));
  const tagOptions = existingTags.map(t => ({ value: t, label: t }));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormInput control={control} name="name.en" label="Name (English)" component={Input} />
          <FormInput control={control} name="name.es" label="Name (Spanish)" component={Input} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormInput control={control} name="scientificName" label="Scientific Name" component={Input} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput control={control} name="family.en" label="Plant Family (EN)" component={Input} />
            <FormInput control={control} name="family.es" label="Plant Family (ES)" component={Input} />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormInput control={control} name="description.en" label="Description (English)" component={Textarea} rows={5} />
          <FormInput control={control} name="description.es" label="Description (Spanish)" component={Textarea} rows={5} />
        </div>
        
        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Image</h3>
          <FormField
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader initialImageUrl={field.value} onUploadComplete={(url) => field.onChange(url)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
            <h3 className="text-lg font-medium">YouTube Video (Optional)</h3>
            <FormInput 
                control={control} 
                name="videoUrl" 
                label="YouTube Video URL" 
                component={Input} 
                placeholder="e.g., https://www.youtube.com/watch?v=..."
            />
        </div>

        <Separator />

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Content Details (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormInput control={control} name="properties.en" label="Key Properties (English)" component={Textarea} />
            <FormInput control={control} name="properties.es" label="Key Properties (Spanish)" component={Textarea} />
            <FormInput control={control} name="uses.en" label="Basic Uses (English)" component={Textarea} />
            <FormInput control={control} name="uses.es" label="Basic Uses (Spanish)" component={Textarea} />
            <FormInput control={control} name="culturalSignificance.en" label="Cultural Significance (English)" component={Textarea} />
            <FormInput control={control} name="culturalSignificance.es" label="Cultural Significance (Spanish)" component={Textarea} />
            <FormInput control={control} name="ethicalHarvesting.en" label="Ethical Harvesting (English)" component={Textarea} />
            <FormInput control={control} name="ethicalHarvesting.es" label="Ethical Harvesting (Spanish)" component={Textarea} />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Usage & Safety Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Controller
              control={control}
              name="preparationMethods.en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Preparation Methods (English)</FormLabel>
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={control}
              name="preparationMethods.es"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Preparation Methods (Spanish)</FormLabel>
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormInput control={control} name="dosage.en" label="Dosage Guidelines (English)" component={Textarea} />
            <FormInput control={control} name="dosage.es" label="Dosage Guidelines (Spanish)" component={Textarea} />
          </div>
          <div className="border-2 border-destructive/30 bg-destructive/5 rounded-lg p-4 space-y-6">
            <h4 className="font-medium text-destructive">Precautions & Contraindications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormInput control={control} name="precautions.en" label="Precautions (English)" component={Textarea} />
              <FormInput control={control} name="precautions.es" label="Precautions (Spanish)" component={Textarea} />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect placeholder="Select or create tags..." options={tagOptions} selected={field.value || []} onChange={field.onChange} creatable />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={control}
              name="relatedBlogs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Blogs</FormLabel>
                  <FormControl>
                    <MultiSelect placeholder="Select related blogs..." options={blogOptions} selected={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />

        <FormField
          control={control}
          name="isLocked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Content is locked</FormLabel>
                <FormDescription>Requires user login to view.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update' : 'Create'} Plant
          </Button>
        </div>
      </form>
    </Form>
  );
}

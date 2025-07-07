
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LoaderCircle } from 'lucide-react';
import ImageUploader from '@/components/image-uploader';
import { MultiSelect } from '@/components/ui/multi-select';

const formSchema = z.object({
  name: z.object({
    en: z.string().min(1, 'English name is required'),
    es: z.string().min(1, 'Spanish name is required'),
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
  imageUrl: z.string().url('Must be a valid URL').optional(),
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

export default function PlantForm({ plant, blogs, existingTags }: PlantFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!plant;

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: { en: plant?.name.en || '', es: plant?.name.es || '' },
      description: { en: plant?.description.en || '', es: plant?.description.es || '' },
      properties: { en: plant?.properties?.en || '', es: plant?.properties?.es || '' },
      uses: { en: plant?.uses?.en || '', es: plant?.uses?.es || '' },
      culturalSignificance: { en: plant?.culturalSignificance?.en || '', es: plant?.culturalSignificance?.es || '' },
      imageUrl: plant?.imageUrl || '',
      isLocked: plant?.isLocked || false,
      tags: plant?.tags || [],
      relatedBlogs: plant?.relatedBlogs || [],
    },
  });

  const { formState, register, handleSubmit, control, setValue } = form;

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <Label htmlFor="name.en">Name (English)</Label>
            <Input id="name.en" {...register('name.en')} />
            {formState.errors.name?.en && <p className="text-sm text-destructive mt-1">{formState.errors.name.en.message}</p>}
          </div>
          <div>
            <Label htmlFor="name.es">Name (Spanish)</Label>
            <Input id="name.es" {...register('name.es')} />
            {formState.errors.name?.es && <p className="text-sm text-destructive mt-1">{formState.errors.name.es.message}</p>}
          </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
              <Label htmlFor="description.en">Description (English)</Label>
              <Textarea id="description.en" {...register('description.en')} rows={5} />
              {formState.errors.description?.en && <p className="text-sm text-destructive mt-1">{formState.errors.description.en.message}</p>}
          </div>
          <div>
              <Label htmlFor="description.es">Description (Spanish)</Label>
              <Textarea id="description.es" {...register('description.es')} rows={5} />
              {formState.errors.description?.es && <p className="text-sm text-destructive mt-1">{formState.errors.description.es.message}</p>}
          </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Image</h3>
         <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
                <ImageUploader 
                    initialImageUrl={field.value} 
                    onUploadComplete={(url) => field.onChange(url)}
                />
            )}
        />
        {formState.errors.imageUrl && <p className="text-sm text-destructive mt-1">{formState.errors.imageUrl.message}</p>}
      </div>

      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <Label htmlFor="properties.en">Key Properties (English)</Label>
              <Textarea id="properties.en" {...register('properties.en')} />
            </div>
            <div>
              <Label htmlFor="properties.es">Key Properties (Spanish)</Label>
              <Textarea id="properties.es" {...register('properties.es')} />
            </div>

            <div>
              <Label htmlFor="uses.en">Basic Uses (English)</Label>
              <Textarea id="uses.en" {...register('uses.en')} />
            </div>
            <div>
              <Label htmlFor="uses.es">Basic Uses (Spanish)</Label>
              <Textarea id="uses.es" {...register('uses.es')} />
            </div>

            <div>
              <Label htmlFor="culturalSignificance.en">Cultural Significance (English)</Label>
              <Textarea id="culturalSignificance.en" {...register('culturalSignificance.en')} />
            </div>
            <div>
              <Label htmlFor="culturalSignificance.es">Cultural Significance (Spanish)</Label>
              <Textarea id="culturalSignificance.es" {...register('culturalSignificance.es')} />
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
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <MultiSelect
                            placeholder="Select or create tags..."
                            options={tagOptions}
                            selected={field.value || []}
                            onChange={field.onChange}
                            creatable
                        />
                    </div>
                )}
            />

            <Controller
                control={control}
                name="relatedBlogs"
                render={({ field }) => (
                     <div className="space-y-2">
                        <Label>Related Blogs</Label>
                        <MultiSelect
                            placeholder="Select related blogs..."
                            options={blogOptions}
                            selected={field.value || []}
                            onChange={field.onChange}
                        />
                     </div>
                )}
            />
        </div>
      </div>
      
      <Separator />

      <div className="flex items-center space-x-2">
        <Controller
            control={control}
            name="isLocked"
            render={({ field }) => (
                <Switch
                    id="isLocked"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
        />
        <Label htmlFor="isLocked">Content is locked (requires user login to view)</Label>
      </div>


      <div className="flex justify-end gap-4 mt-8">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Update' : 'Create'} Plant
        </Button>
      </div>
    </form>
  );
}

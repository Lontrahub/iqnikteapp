'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdateBlog } from '@/lib/data';
import type { Blog } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LoaderCircle } from 'lucide-react';
import ImageUploader from '@/components/image-uploader';
import { MultiSelect } from '@/components/ui/multi-select';
import { RichTextEditor } from '@/components/rich-text-editor';

const formSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    es: z.string().min(1, 'Spanish title is required'),
  }),
  content: z.object({
    en: z.string().min(1, 'English content is required'),
    es: z.string().min(1, 'Spanish content is required'),
  }),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  isLocked: z.boolean(),
  relatedPlants: z.array(z.string()).optional(),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  blog?: Blog;
  plants: { id: string; title: string }[];
}

export default function BlogForm({ blog, plants }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!blog;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: { en: blog?.title.en || '', es: blog?.title.es || '' },
      content: { en: blog?.content.en || '', es: blog?.content.es || '' },
      imageUrl: blog?.imageUrl || '',
      isLocked: blog?.isLocked || false,
      relatedPlants: blog?.relatedPlants || [],
    },
  });

  const { formState, register, handleSubmit, control } = form;

  const onSubmit = async (data: BlogFormValues) => {
    const result = await createOrUpdateBlog({
      id: blog?.id,
      ...data,
    });

    if (result.success) {
      toast({
        title: `Article ${isEditMode ? 'Updated' : 'Created'}`,
        description: `The article "${data.title.en}" has been saved successfully.`,
      });
      router.push('/admin/blogs');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  const plantOptions = plants.map(p => ({ value: p.id, label: p.title }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <Label htmlFor="title.en">Title (English)</Label>
            <Input id="title.en" {...register('title.en')} />
            {formState.errors.title?.en && <p className="text-sm text-destructive mt-1">{formState.errors.title.en.message}</p>}
          </div>
          <div>
            <Label htmlFor="title.es">Title (Spanish)</Label>
            <Input id="title.es" {...register('title.es')} />
            {formState.errors.title?.es && <p className="text-sm text-destructive mt-1">{formState.errors.title.es.message}</p>}
          </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Controller
          control={control}
          name="content.en"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="content.en">Content (English)</Label>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
              {formState.errors.content?.en && <p className="text-sm text-destructive mt-1">{formState.errors.content.en.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="content.es"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="content.es">Content (Spanish)</Label>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
              {formState.errors.content?.es && <p className="text-sm text-destructive mt-1">{formState.errors.content.es.message}</p>}
            </div>
          )}
        />
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
        <h3 className="text-lg font-medium">Metadata</h3>
        <Controller
            control={control}
            name="relatedPlants"
            render={({ field }) => (
                 <div className="space-y-2">
                    <Label>Related Plants</Label>
                    <MultiSelect
                        placeholder="Select related plants..."
                        options={plantOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                    />
                 </div>
            )}
        />
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
          {isEditMode ? 'Update' : 'Create'} Article
        </Button>
      </div>
    </form>
  );
}

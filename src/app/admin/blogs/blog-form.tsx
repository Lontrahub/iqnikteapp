'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdateBlog } from '@/lib/data';
import type { Blog } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    es: z.string().min(1, 'Spanish title is required'),
  }),
  content: z.object({
    en: z.string().min(1, 'English content is required'),
    es: z.string().min(1, 'Spanish content is required'),
  }),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
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

  const { handleSubmit, control, formState } = form;

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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              control={control}
              name="title.en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (English)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input {...field} />
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
            name="content.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (English)</FormLabel>
                <FormControl>
                  <div>
                    <RichTextEditor
                      ref={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="content.es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (Spanish)</FormLabel>
                <FormControl>
                  <div>
                    <RichTextEditor
                      ref={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                          <ImageUploader 
                              initialImageUrl={field.value} 
                              onUploadComplete={(url) => field.onChange(url)}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Metadata</h3>
          <FormField
              control={control}
              name="relatedPlants"
              render={({ field }) => (
                   <FormItem>
                      <FormLabel>Related Plants</FormLabel>
                      <FormControl>
                          <MultiSelect
                              placeholder="Select related plants..."
                              options={plantOptions}
                              selected={field.value || []}
                              onChange={field.onChange}
                          />
                      </FormControl>
                      <FormMessage />
                   </FormItem>
              )}
          />
        </div>
        
        <Separator />

        <FormField
          control={control}
          name="isLocked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Content is locked
                </FormLabel>
                <FormDescription>
                  Requires user login to view.
                </FormDescription>
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
            {isEditMode ? 'Update' : 'Create'} Article
          </Button>
        </div>
      </form>
    </Form>
  );
}

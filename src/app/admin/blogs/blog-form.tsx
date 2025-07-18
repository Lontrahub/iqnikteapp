'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdateBlog } from '@/lib/data';
import type { Blog as BlogWithTimestamp, BilingualTag } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

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
import { BilingualTagCreateDialog } from '@/components/bilingual-tag-dialog';


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
  tags: z.array(z.object({
    id: z.string(),
    en: z.string(),
    es: z.string(),
  })).optional(),
});

type BlogFormValues = z.infer<typeof formSchema>;

// Create a client-safe version of the Blog type for props
type Blog = Omit<BlogWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface BlogFormProps {
  blog?: Blog;
  plants: { id: string; title: string }[];
  existingTags: BilingualTag[];
}

export default function BlogForm({ blog, plants, existingTags }: BlogFormProps) {
  const router = useRouter();
  const language = useLanguage();
  const { toast } = useToast();
  const isEditMode = !!blog;

  const [isCreatingTag, setIsCreatingTag] = React.useState(false);
  const [newTagValue, setNewTagValue] = React.useState('');

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: { en: blog?.title.en || '', es: blog?.title.es || '' },
      content: { en: blog?.content.en || '', es: blog?.content.es || '' },
      imageUrl: blog?.imageUrl || '',
      isLocked: blog?.isLocked || false,
      relatedPlants: blog?.relatedPlants || [],
      tags: blog?.tags || [],
    },
  });

  const { handleSubmit, control, formState, watch } = form;

  const allAvailableTags = React.useMemo(() => {
    const formTags = watch('tags') || [];
    const combined = [...existingTags, ...formTags];
    return Array.from(new Map(combined.map(tag => [tag.id, tag])).values());
  }, [existingTags, watch('tags')]);

  const tagOptions = allAvailableTags.map(t => ({
      value: t.id,
      label: t[language] || t.en
  }));

  const plantOptions = plants.map(p => ({ value: p.id, label: p.title }));

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
                <RichTextEditor {...field} />
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
                <RichTextEditor {...field} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      creatable
                      placeholder="Select or create tags..."
                      options={tagOptions}
                      selected={(field.value || []).map(t => t.id)}
                      onChange={(selectedIds) => {
                          const selectedTagObjects = selectedIds
                              .map(id => allAvailableTags.find(t => t.id === id))
                              .filter((t): t is BilingualTag => !!t);
                          field.onChange(selectedTagObjects);
                      }}
                      onNewItemCreate={(value) => {
                          setNewTagValue(value);
                          setIsCreatingTag(true);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <BilingualTagCreateDialog
                      isOpen={isCreatingTag}
                      onOpenChange={setIsCreatingTag}
                      initialEnValue={newTagValue}
                      onSave={(newTagData) => {
                          const newTag: BilingualTag = {
                              id: `tag_${Date.now()}_${newTagData.en.toLowerCase().replace(/\s+/g, '_')}`,
                              en: newTagData.en,
                              es: newTagData.es,
                          };
                          field.onChange([...(field.value || []), newTag]);
                      }}
                  />
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
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md bg-muted/50 p-4">
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

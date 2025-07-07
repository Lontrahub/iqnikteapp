'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateGlobalSettings } from '@/lib/data';
import type { Banner } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CircleNotch } from 'phosphor-react';
import ImageUploader from '@/components/image-uploader';

const formSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  enabled: z.boolean(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  settings: Banner | null;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: settings?.imageUrl || '',
      enabled: settings?.enabled || false,
    },
  });

  const { formState, handleSubmit, control } = form;

  const onSubmit = async (data: SettingsFormValues) => {
    if (!data.imageUrl && data.enabled) {
        form.setError('imageUrl', { type: 'manual', message: 'An image URL is required if the banner is enabled.' });
        return;
    }
    const result = await updateGlobalSettings({ 
        imageUrl: data.imageUrl || '', 
        enabled: data.enabled 
    });

    if (result.success) {
      toast({
        title: `Settings Updated`,
        description: `The global settings have been saved successfully.`,
      });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Home Screen Banner</h3>
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

      <div className="flex items-center space-x-2">
        <Controller
            control={control}
            name="enabled"
            render={({ field }) => (
                <Switch
                    id="enabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
        />
        <Label htmlFor="enabled">Enable banner on home screen</Label>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </form>
  );
}

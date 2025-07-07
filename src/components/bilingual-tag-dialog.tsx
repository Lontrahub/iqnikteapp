'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';

const tagSchema = z.object({
  en: z.string().min(1, 'English name is required.'),
  es: z.string().min(1, 'Spanish name is required.'),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface BilingualTagCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (tag: TagFormValues) => void;
  initialEnValue?: string;
}

export function BilingualTagCreateDialog({
  isOpen,
  onOpenChange,
  onSave,
  initialEnValue = '',
}: BilingualTagCreateDialogProps) {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      en: initialEnValue,
      es: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ en: initialEnValue, es: '' });
    }
  }, [isOpen, initialEnValue, form]);

  const onSubmit = (data: TagFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Provide the English and Spanish names for the new tag.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="en"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="en">English Name</Label>
                  <FormControl>
                    <Input id="en" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="es"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="es">Spanish Name</Label>
                  <FormControl>
                    <Input id="es" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Tag</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

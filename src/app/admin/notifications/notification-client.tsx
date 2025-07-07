'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import type { Notification as NotificationWithTimestamp } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sendNotification } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { LoaderCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Client-safe type
type Notification = Omit<NotificationWithTimestamp, 'createdAt'> & {
  createdAt: string; 
};

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
});

type NotificationFormValues = z.infer<typeof formSchema>;

interface NotificationClientProps {
  initialNotifications: Notification[];
}

export default function NotificationClient({ initialNotifications }: NotificationClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', message: '' },
  });

  const { handleSubmit, control, formState, reset } = form;

  const onSubmit: SubmitHandler<NotificationFormValues> = async (data) => {
    const result = await sendNotification(data);

    if (result.success) {
      toast({
        title: 'Notification Sent',
        description: 'The notification has been broadcast to all users.',
      });
      reset();
      router.refresh(); // This will re-fetch notifications on the server page and update the list
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-8">
        {/* Create Notification Form */}
        <section>
            <h2 className="text-2xl font-headline mb-4">Create New Notification</h2>
            <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., New Plant Added!" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the notification..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={formState.isSubmitting}>
                    {formState.isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Send Notification
                </Button>
            </form>
            </Form>
        </section>

        <Separator />

        {/* Previously Sent Notifications List */}
        <section>
            <h2 className="text-2xl font-headline mb-4">Previously Sent Notifications</h2>
            {initialNotifications.length > 0 ? (
                <div className="space-y-4">
                    {initialNotifications.map((notif) => (
                        <Card key={notif.id} className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg">{notif.title}</CardTitle>
                                <CardDescription>
                                    Sent on {new Date(notif.createdAt).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{notif.message}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No notifications have been sent yet.</p>
            )}
        </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { CircleNotch } from 'phosphor-react';

import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handlePasswordReset = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setIsSubmitted(true);
      toast({
          title: t('forgotPasswordPage.checkEmailToastTitle'),
          description: t('forgotPasswordPage.checkEmailToastDescription'),
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send password reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-serif tracking-wide">{t('forgotPasswordPage.title')}</CardTitle>
        <CardDescription>
          {isSubmitted 
            ? t('forgotPasswordPage.descriptionSubmitted')
            : t('forgotPasswordPage.description')
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
            <form onSubmit={form.handleSubmit(handlePasswordReset)} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">{t('loginPage.emailLabel')}</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
                {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
                {t('forgotPasswordPage.sendResetLink')}
            </Button>
            </form>
        ) : (
            <div className="text-center">
                <p>{t('forgotPasswordPage.checkInbox')}</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
          <Link href="/login" className={cn(buttonVariants({variant: 'link'}), 'p-0 w-full')}>
            {t('forgotPasswordPage.backToLogin')}
          </Link>
      </CardFooter>
    </Card>
  );
}

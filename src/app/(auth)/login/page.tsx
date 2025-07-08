'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
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

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleEmailLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.replace('/home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsProviderLoading(true);
    const provider = new GoogleAuthProvider();
      
    try {
      await signInWithPopup(auth, provider);
      router.replace('/home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.message || `Could not sign in with Google. Please try again.`,
      });
    } finally {
      setIsProviderLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-serif tracking-wide">{t('loginPage.title')}</CardTitle>
        <CardDescription>
          {t('loginPage.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={form.handleSubmit(handleEmailLogin)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('loginPage.emailLabel')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{t('loginPage.passwordLabel')}</Label>
              <Link href="/forgot-password" className={cn(buttonVariants({variant: 'link'}), 'p-0 h-auto ml-auto text-sm')}>
                {t('loginPage.forgotPassword')}
              </Link>
            </div>
            <Input id="password" type="password" {...form.register('password')} />
             {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isProviderLoading}>
            {isLoading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
            {t('loginPage.signInButton')}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('loginPage.orContinueWith')}
            </span>
          </div>
        </div>
        <Button variant="secondary" className="w-full" onClick={handleGoogleLogin} disabled={isProviderLoading || isLoading}>
            {isProviderLoading ? 'Signing in...' : t('loginPage.googleSignIn')}
        </Button>
      </CardContent>
      <CardFooter className="text-sm">
        <span>
          {t('loginPage.noAccount')}{' '}
          <Link href="/register" className={cn(buttonVariants({variant: 'link'}), 'p-0')}>
            {t('loginPage.signUpLink')}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}

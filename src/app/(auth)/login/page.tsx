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
  OAuthProvider,
} from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';

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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.84-5.18 1.84-4.59 0-8.34-3.77-8.34-8.34s3.75-8.34 8.34-8.34c2.61 0 4.21 1.04 5.18 1.95l2.72-2.72C19.01 1.48 16.25 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.34 0 12.03-4.83 12.03-12.03 0-.78-.08-1.56-.21-2.31H12.48z"
    />
  </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M12.072 10.461C10.966 10.461 10.02 9.535 10.02 8.429c0-1.103.946-2.03 2.052-2.03.18 0 .36.02.535.053.946-.677 1.637-1.803 1.8-3.136-1.528-.32-3.135.213-3.96.958-.878.78-1.527 1.987-1.527 3.239 0 1.987-1.294 3.292-3.21 3.292-1.803 0-3.32-.958-4.32-2.085C.967 9.875.56 12.28.56 14.846c0 5.908 4.012 8.59 7.74 8.59 1.422 0 2.768-.532 4.012-.532s2.59.532 4.012.532c3.728 0 7.74-2.683 7.74-8.59 0-2.25-1.11-4.446-2.92-5.461-1.86-1.02-3.728-.85-4.374.904-.645.959-.36 2.303.588 3.024a2.03 2.03 0 0 1-2.286 1.293zM12.072.043C11.912 0 11.555 0 11.251 0c-1.92 0-3.617 1.163-4.533 2.897C7.41 2.316 8.654.904 10.13.904c1.163 0 2.408.85 3.292 1.86.825-.958 1.92-1.807 3.238-1.807a.23.23 0 0 1 .157.053c-.053-.106-.105-.213-.157-.32-.825-1.346-2.536-2.25-4.533-2.63a.23.23 0 0 1-.105 0z" />
    </svg>
);

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState<string | null>(null);

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

  const handleProviderLogin = async (providerName: 'google' | 'apple') => {
    setIsProviderLoading(providerName);
    const provider = providerName === 'google' 
      ? new GoogleAuthProvider() 
      : new OAuthProvider('apple.com');
      
    try {
      await signInWithPopup(auth, provider);
      router.replace('/home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.message || `Could not sign in with ${providerName}. Please try again.`,
      });
    } finally {
      setIsProviderLoading(null);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={form.handleSubmit(handleEmailLogin)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className={cn(buttonVariants({variant: 'link'}), 'p-0 h-auto ml-auto text-sm')}>
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" {...form.register('password')} />
             {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handleProviderLogin('google')} disabled={!!isProviderLoading}>
                {isProviderLoading === 'google' ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Google
            </Button>
            <Button variant="outline" onClick={() => handleProviderLogin('apple')} disabled={!!isProviderLoading}>
                {isProviderLoading === 'apple' ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <AppleIcon className="mr-2 h-4 w-4" />}
                Apple
            </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={cn(buttonVariants({variant: 'link'}), 'p-0')}>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

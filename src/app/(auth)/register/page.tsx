'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { CircleNotch } from 'phosphor-react';

import { auth, db } from '@/lib/firebase';
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
import type { UserProfile } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';

const registerSchema = z.object({
  displayName: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const handleEmailRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: data.displayName });

      // Create user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: data.displayName,
        role: 'user',
        createdAt: Timestamp.now(),
      };
      await setDoc(userRef, newUserProfile);

      router.replace('/home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsProviderLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.replace('/home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: error.message || `Could not sign up with Google. Please try again.`,
      });
    } finally {
      setIsProviderLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-serif tracking-wide">{t('registerPage.title')}</CardTitle>
        <CardDescription>{t('registerPage.description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={form.handleSubmit(handleEmailRegister)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">{t('registerPage.nameLabel')}</Label>
            <Input id="displayName" placeholder={t('registerPage.namePlaceholder')} {...form.register('displayName')} />
            {form.formState.errors.displayName && (
              <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('loginPage.emailLabel')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('registerPage.passwordLabel')}</Label>
            <Input id="password" type="password" {...form.register('password')} />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isProviderLoading}>
            {isLoading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
            {t('registerPage.createAccountButton')}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('loginPage.orContinueWith')}</span>
          </div>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isProviderLoading || isLoading}
        >
          {isProviderLoading ? 'Signing up...' : t('registerPage.googleSignUp')}
        </Button>
      </CardContent>
      <CardFooter className="text-sm">
        <span>
          {t('registerPage.hasAccount')}{' '}
          <Link href="/login" className={cn(buttonVariants({ variant: 'link' }), 'p-0')}>
            {t('registerPage.signInLink')}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}

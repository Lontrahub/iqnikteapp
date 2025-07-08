
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage, type Language } from '@/hooks/use-language';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const language = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    if (lang && (lang === 'en' || lang === 'es')) {
      localStorage.setItem('app_language', lang);
      window.location.reload();
    }
  };

  if (loading || !user) {
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  const translations = {
      en: {
          profileTitle: "User Profile",
          profileDescription: "View and manage your account information and preferences.",
          displayName: "Display Name:",
          email: "Email:",
          role: "User Role:",
          joined: "Joined:",
          adminButton: "Go to Admin Panel",
          language: "Language",
          notSet: "Not set"
      },
      es: {
          profileTitle: "Perfil de Usuario",
          profileDescription: "Ver y gestionar la información y preferencias de tu cuenta.",
          displayName: "Nombre:",
          email: "Correo Electrónico:",
          role: "Rol de Usuario:",
          joined: "Miembro desde:",
          adminButton: "Ir al Panel de Administrador",
          language: "Idioma",
          notSet: "No establecido"
      }
  };

  const t = translations[language];

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-serif text-3xl">{t.profileTitle}</CardTitle>
          <CardDescription>{t.profileDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t.displayName}</span>
                    <span className="text-foreground">{userProfile?.displayName || t.notSet}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t.email}</span>
                    <span className="text-foreground">{userProfile?.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t.role}</span>
                    <span className="text-foreground capitalize">{userProfile?.role}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{t.joined}</span>
                    <span className="text-foreground">{userProfile?.createdAt.toDate().toLocaleDateString()}</span>
                </div>
            </div>
            
            <div className="space-y-3 border-t pt-6">
                <Label className="text-base font-semibold">{t.language}</Label>
                <ToggleGroup
                    type="single"
                    value={currentLanguage}
                    onValueChange={handleLanguageChange}
                    className="grid grid-cols-2 gap-2"
                >
                    <ToggleGroupItem value="en" aria-label="Set language to English" className="w-full">
                        English
                    </ToggleGroupItem>
                    <ToggleGroupItem value="es" aria-label="Establecer idioma a Español" className="w-full">
                        Español
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {userProfile?.role === 'admin' && (
              <div className="mt-6 border-t pt-6">
                <Button asChild>
                  <Link href="/admin">{t.adminButton}</Link>
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

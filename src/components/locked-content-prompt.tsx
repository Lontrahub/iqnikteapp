'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Lock } from "phosphor-react";
import Link from "next/link";

export default function LockedContentPrompt() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-10 px-4 flex justify-center">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4">{t('lockedContent.title')}</CardTitle>
                    <CardDescription>
                        {t('lockedContent.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button asChild className="flex-1">
                        <Link href="/login">{t('lockedContent.loginButton')}</Link>
                    </Button>
                    <Button asChild variant="secondary" className="flex-1">
                        <Link href="/register">{t('lockedContent.registerButton')}</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

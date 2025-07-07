'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "phosphor-react";
import Link from "next/link";

export default function LockedContentPrompt() {
    return (
        <div className="container mx-auto py-10 px-4 flex justify-center">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4">Content Locked</CardTitle>
                    <CardDescription>
                        This content is available to registered members. Please log in or create an account to view it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button asChild className="flex-1">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild variant="secondary" className="flex-1">
                        <Link href="/register">Register</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

import { getMainBanner } from "@/lib/data";
import SettingsForm from "./settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSettingsPage() {
    const settings = await getMainBanner();
    
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Global Settings</CardTitle>
                    <CardDescription>Manage application-wide features like the home screen banner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm settings={settings} />
                </CardContent>
            </Card>
        </div>
    );
}

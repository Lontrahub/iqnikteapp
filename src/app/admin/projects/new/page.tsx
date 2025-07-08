
import ProjectForm from "../project-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProjectPage() {
    return (
        <div className="container py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-serif text-3xl">Create New Project</CardTitle>
                    <CardDescription>Fill out the form below to add a new project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProjectForm />
                </CardContent>
            </Card>
        </div>
    );
}

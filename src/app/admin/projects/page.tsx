import { getAllProjects } from "@/lib/data";
import ProjectListAdminClient from "./project-list-admin-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default async function AdminProjectsPage() {
    const projectsRaw = await getAllProjects();
    const projects = projectsRaw.map(project => ({
        ...project,
        createdAt: project.createdAt.toDate().toISOString(),
    }));
    
    return (
        <div className="container py-10">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-serif text-3xl">Project Management</CardTitle>
                    <CardDescription>Create, edit, and delete community projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProjectListAdminClient projects={projects} />
                </CardContent>
            </Card>
        </div>
    );
}

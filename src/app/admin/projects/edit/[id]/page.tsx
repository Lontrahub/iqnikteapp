
import ProjectForm from "../../project-form";
import { getProjectById } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
    const projectData = await getProjectById(params.id);

    if (!projectData) {
        notFound();
    }

    const project = {
        ...projectData,
        createdAt: projectData.createdAt.toDate().toISOString(),
    };

    return (
        <div className="container py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-serif text-3xl">Edit Project</CardTitle>
                    <CardDescription>Update the details for "{project.title.en}" below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProjectForm project={project} />
                </CardContent>
            </Card>
        </div>
    );
}

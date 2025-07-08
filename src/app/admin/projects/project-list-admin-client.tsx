'use client';

import { useState, useTransition } from 'react';
import type { Project as ProjectWithTimestamp } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { deleteProject } from '@/lib/data';
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Trash, PencilSimple } from 'phosphor-react';

type Project = Omit<ProjectWithTimestamp, 'createdAt'> & {
  createdAt: string; 
};

export default function ProjectListAdminClient({ projects: initialProjects }: { projects: Project[] }) {
  const language = useLanguage();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [projects, setProjects] = useState(initialProjects);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    startTransition(async () => {
      const result = await deleteProject(projectToDelete.id);
      if (result.success) {
        setProjects(prev => prev.filter(b => b.id !== projectToDelete.id));
        toast({
          title: "Project Deleted",
          description: `The project "${projectToDelete.title[language] || projectToDelete.title.en}" has been deleted.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error Deleting Project",
          description: result.error || "An unexpected error occurred.",
        });
      }
      setProjectToDelete(null);
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>
      <div className="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title[language] || project.title.en}</TableCell>
                   <TableCell>
                    <Badge variant={
                      project.status === 'Completed' ? 'default' : 
                      project.status === 'Ongoing' ? 'secondary' : 'outline'
                    }>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/projects/edit/${project.id}`}>
                        <PencilSimple className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setProjectToDelete(project)}>
                      <Trash className="h-4 w-4" />
                       <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project
                "{projectToDelete?.title[language] || projectToDelete?.title.en}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Yes, delete it"}
              </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

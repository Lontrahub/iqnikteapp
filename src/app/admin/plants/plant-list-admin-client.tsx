
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { Plant } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { deletePlant } from '@/lib/data';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { PlusCircle, Trash2, Edit } from 'lucide-react';

export default function PlantListAdminClient({ plants: initialPlants }: { plants: Plant[] }) {
  const language = useLanguage();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [plants, setPlants] = useState(initialPlants);
  const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);

  const handleDeleteConfirm = async () => {
    if (!plantToDelete) return;

    startTransition(async () => {
      const result = await deletePlant(plantToDelete.id);
      if (result.success) {
        setPlants(prev => prev.filter(p => p.id !== plantToDelete.id));
        toast({
          title: "Plant Deleted",
          description: `The plant "${plantToDelete.name[language] || plantToDelete.name.en}" has been successfully deleted.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error Deleting Plant",
          description: result.error || "An unexpected error occurred.",
        });
      }
      setPlantToDelete(null);
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/plants/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Plant
          </Link>
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.length > 0 ? (
              plants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell className="font-medium">{plant.name[language] || plant.name.en}</TableCell>
                  <TableCell>{plant.createdAt.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/plants/edit/${plant.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setPlantToDelete(plant)}>
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No plants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!plantToDelete} onOpenChange={(open) => !open && setPlantToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the plant
                "{plantToDelete?.name[language] || plantToDelete?.name.en}".
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

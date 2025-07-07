'use client';

import { useState, useTransition } from 'react';
import type { Blog } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { deleteBlog } from '@/lib/data';
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

export default function BlogListAdminClient({ blogs: initialBlogs }: { blogs: Blog[] }) {
  const language = useLanguage();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [blogs, setBlogs] = useState(initialBlogs);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    startTransition(async () => {
      const result = await deleteBlog(blogToDelete.id);
      if (result.success) {
        setBlogs(prev => prev.filter(b => b.id !== blogToDelete.id));
        toast({
          title: "Article Deleted",
          description: `The article "${blogToDelete.title[language] || blogToDelete.title.en}" has been successfully deleted.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error Deleting Article",
          description: result.error || "An unexpected error occurred.",
        });
      }
      setBlogToDelete(null);
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/blogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Article
          </Link>
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title[language] || blog.title.en}</TableCell>
                  <TableCell>{blog.createdAt.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blogs/edit/${blog.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setBlogToDelete(blog)}>
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the article
                "{blogToDelete?.title[language] || blogToDelete?.title.en}".
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

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import type { Blog } from '@/lib/types';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={blog.imageUrl || 'https://placehold.co/400x400.png'}
              alt={blog.title}
              fill
              className="object-cover"
              data-ai-hint="article illustration"
            />
            {blog.isLocked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <div className="p-4 bg-card">
            <h3 className="font-headline text-lg text-primary truncate">{blog.title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

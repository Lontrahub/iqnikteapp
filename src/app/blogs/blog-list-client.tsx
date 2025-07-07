'use client';

import { BlogCard } from '@/components/blog-card';
import type { Blog as BlogWithTimestamp } from '@/lib/types';

// Client-safe type
type Blog = Omit<BlogWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface BlogListClientProps {
    blogs: Blog[];
}

export default function BlogListClient({ blogs }: BlogListClientProps) {
    return (
        <div>
            <h1 className="text-4xl font-headline text-primary mb-2">Educational Resources</h1>
            <p className="text-muted-foreground mb-6">Browse our collection of articles and educational content.</p>
            
            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                    {blogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">No articles found.</p>
                </div>
            )}
        </div>
    )
}

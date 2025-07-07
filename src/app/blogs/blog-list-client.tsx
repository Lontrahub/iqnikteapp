'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { BlogCard } from '@/components/blog-card';
import type { Blog } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Search } from 'lucide-react';

interface BlogListClientProps {
    blogs: Blog[];
}

export default function BlogListClient({ blogs }: BlogListClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const language = useLanguage();

    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const title = blog.title?.[language] || blog.title?.en || '';
            return title.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [blogs, searchTerm, language]);

    return (
        <div>
            <h1 className="text-4xl font-headline text-primary mb-2">Educational Resources</h1>
            <p className="text-muted-foreground mb-6">Browse our collection of articles and educational content.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for an article..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBlogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">No articles found matching your criteria.</p>
                </div>
            )}
        </div>
    )
}

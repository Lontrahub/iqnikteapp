'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog-card';
import type { Blog as BlogWithTimestamp } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { MagnifyingGlass, FadersHorizontal, X } from 'phosphor-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';

// Client-safe type
type Blog = Omit<BlogWithTimestamp, 'createdAt'> & {
  createdAt: string;
};

interface BlogListClientProps {
    blogs: Blog[];
    tags: string[];
}

export default function BlogListClient({ blogs, tags }: BlogListClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const language = useLanguage();

    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const title = blog.title?.[language] || blog.title?.en || '';
            const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => blog.tags?.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [blogs, searchTerm, selectedTags, language]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-headline text-primary mb-2">Educational Resources</h1>
            <p className="text-muted-foreground mb-6">Browse our collection of articles and educational content.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for an article..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <FadersHorizontal className="mr-2 h-4 w-4" />
                            Filter by Tag ({selectedTags.length})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {tags.map(tag => (
                             <DropdownMenuCheckboxItem
                                key={tag}
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => handleTagToggle(tag)}
                             >
                                {tag}
                             </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {selectedTags.length > 0 && (
                <div className="mb-4 flex gap-2 items-center flex-wrap">
                    <span className="text-sm font-medium">Active Filters:</span>
                    {selectedTags.map(tag => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                            <button onClick={() => handleTagToggle(tag)} className="ml-1 rounded-full hover:bg-background/50 p-0.5">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="h-auto py-1 px-2">Clear all</Button>
                </div>
            )}

            {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
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

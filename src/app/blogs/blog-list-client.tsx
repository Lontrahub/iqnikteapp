'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog-card';
import type { Blog as BlogWithTimestamp, BilingualTag } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/hooks/use-translation';
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
    tags: BilingualTag[];
}

export default function BlogListClient({ blogs, tags }: BlogListClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const language = useLanguage();
    const { t } = useTranslation();

    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const title = blog.title?.[language] || blog.title?.en || '';
            const content = blog.content?.[language] || blog.content?.en || '';
            const searchLower = searchTerm.toLowerCase();

            const matchesSearch = searchTerm === '' ||
                title.toLowerCase().includes(searchLower) ||
                content.toLowerCase().includes(searchLower) ||
                (blog.tags || []).some(tag => 
                    tag.en.toLowerCase().includes(searchLower) || 
                    tag.es.toLowerCase().includes(searchLower)
                );
            
            const matchesTags = selectedTags.length === 0 || 
                selectedTags.every(selectedTagId => 
                    blog.tags?.some(blogTag => blogTag.id === selectedTagId)
                );

            return matchesSearch && matchesTags;
        });
    }, [blogs, searchTerm, selectedTags, language]);

    const handleTagToggle = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-serif text-primary mb-2">{t('blogListPage.title')}</h1>
            <p className="text-muted-foreground mb-6">{t('blogListPage.description')}</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder={t('blogListPage.searchPlaceholder')}
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary">
                            <FadersHorizontal className="mr-2 h-4 w-4" />
                            {t('plantListPage.filterByTag')} ({selectedTags.length})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>{t('plantListPage.filterByTags')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {tags.map(tag => (
                             <DropdownMenuCheckboxItem
                                key={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onCheckedChange={() => handleTagToggle(tag.id)}
                             >
                                {tag[language] || tag.en}
                             </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {selectedTags.length > 0 && (
                <div className="mb-4 flex gap-2 items-center flex-wrap">
                    <span className="text-sm font-medium">{t('plantListPage.activeFilters')}</span>
                    {selectedTags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        if (!tag) return null;
                        return (
                            <Badge key={tag.id} variant="secondary">
                                {tag[language] || tag.en}
                                <button onClick={() => handleTagToggle(tagId)} className="ml-1 rounded-full hover:bg-background/50 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        );
                    })}
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="h-auto py-1 px-2">{t('plantListPage.clearAll')}</Button>
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
                    <p className="text-lg text-muted-foreground">{t('blogListPage.noArticlesFound')}</p>
                </div>
            )}
        </div>
    )
}

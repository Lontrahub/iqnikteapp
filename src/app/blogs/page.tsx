import { getAllBlogs, getAllBlogTagsBilingual } from '@/lib/data';
import BlogListClient from './blog-list-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Educational Resources | Mayan Medicine Guide',
    description: 'Browse our collection of articles and educational content on traditional Mayan medicine.',
};

export default async function BlogsPage() {
    const allBlogsRaw = await getAllBlogs();
    const allBlogs = allBlogsRaw.map(blog => ({
        ...blog,
        createdAt: blog.createdAt.toDate().toISOString(),
    }));
    const allTags = await getAllBlogTagsBilingual();

    return (
        <main className="flex-1">
            <div className="container py-8">
                <BlogListClient blogs={allBlogs} tags={allTags} />
            </div>
        </main>
    )
}

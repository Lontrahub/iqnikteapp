import { getAllBlogs } from '@/lib/data';
import BlogListClient from './blog-list-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Educational Resources | Mayan Medicine Guide',
    description: 'Browse our collection of articles and educational content on traditional Mayan medicine.',
};

export default async function BlogsPage() {
    const allBlogs = await getAllBlogs();

    return (
        <main className="flex-1">
            <div className="container mx-auto py-8 px-4">
                <BlogListClient blogs={allBlogs} />
            </div>
        </main>
    )
}

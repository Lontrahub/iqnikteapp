'use server';

import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, documentId } from 'firebase/firestore';
import { db } from './firebase';
import type { Plant, Blog, Banner } from './types';

export async function getMainBanner(): Promise<Banner | null> {
    try {
        const bannerDocRef = doc(db, 'appConfig', 'mainBanner');
        const bannerSnap = await getDoc(bannerDocRef);
        if (bannerSnap.exists() && bannerSnap.data()?.enabled) {
            const data = bannerSnap.data();
            return {
                imageUrl: data.imageUrl,
                enabled: data.enabled
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching banner:", error);
        return null;
    }
}

export async function getRecentPlants(): Promise<Plant[]> {
    try {
        const plantsRef = collection(db, 'plants');
        const q = query(plantsRef, orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const plants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        return plants;
    } catch (error) {
        console.error("Error fetching recent plants:", error);
        return [];
    }
}

export async function getRecentBlogs(): Promise<Blog[]> {
    try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
        return blogs;
    } catch (error) {
        console.error("Error fetching recent blogs:", error);
        return [];
    }
}

export async function getAllPlants(): Promise<Plant[]> {
    try {
        const plantsRef = collection(db, 'plants');
        const q = query(plantsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const plants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        return plants;
    } catch (error) {
        console.error("Error fetching all plants:", error);
        return [];
    }
}

export async function getAllBlogs(): Promise<Blog[]> {
    try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
        return blogs;
    } catch (error) {
        console.error("Error fetching all blogs:", error);
        return [];
    }
}

export async function getPlantById(id: string): Promise<Plant | null> {
    try {
        const plantDocRef = doc(db, 'plants', id);
        const plantSnap = await getDoc(plantDocRef);
        if (plantSnap.exists()) {
            return { id: plantSnap.id, ...plantSnap.data() } as Plant;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching plant with ID ${id}:`, error);
        return null;
    }
}

export async function getBlogById(id: string): Promise<Blog | null> {
    try {
        const blogDocRef = doc(db, 'blogs', id);
        const blogSnap = await getDoc(blogDocRef);
        if (blogSnap.exists()) {
            return { id: blogSnap.id, ...blogSnap.data() } as Blog;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching blog with ID ${id}:`, error);
        return null;
    }
}

export async function getBlogsByIds(ids: string[]): Promise<Blog[]> {
    if (!ids || ids.length === 0) {
        return [];
    }
    try {
        const blogsRef = collection(db, 'blogs');
        // Firestore 'in' queries are limited to 30 items.
        // For larger arrays, you'd need to chunk the requests.
        const q = query(blogsRef, where(documentId(), 'in', ids.slice(0,30)));
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
        return blogs;
    } catch (error) {
        console.error("Error fetching blogs by IDs:", error);
        return [];
    }
}

export async function getPlantsByIds(ids: string[]): Promise<Plant[]> {
    if (!ids || ids.length === 0) {
        return [];
    }
    try {
        const plantsRef = collection(db, 'plants');
        const q = query(plantsRef, where(documentId(), 'in', ids.slice(0,30)));
        const querySnapshot = await getDocs(q);
        const plants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
        return plants;
    } catch (error) {
        console.error("Error fetching plants by IDs:", error);
        return [];
    }
}

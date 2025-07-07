'use server';

import { collection, getDocs, getDoc, doc, query, orderBy, limit } from 'firebase/firestore';
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


'use server';

import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, documentId, getCountFromServer, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Plant, Blog, Banner, UserProfile, BilingualString } from './types';

export async function getAdminDashboardStats(): Promise<{ users: number; plants: number; blogs: number }> {
    try {
        const usersRef = collection(db, 'users');
        const plantsRef = collection(db, 'plants');
        const blogsRef = collection(db, 'blogs');

        const [usersSnap, plantsSnap, blogsSnap] = await Promise.all([
            getCountFromServer(usersRef),
            getCountFromServer(plantsRef),
            getCountFromServer(blogsRef)
        ]);

        return {
            users: usersSnap.data().count,
            plants: plantsSnap.data().count,
            blogs: blogsSnap.data().count,
        };
    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        return { users: 0, plants: 0, blogs: 0 };
    }
}

export async function getAllUsers(): Promise<UserProfile[]> {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                ...data,
                id: doc.id // Add this line
            } as UserProfile;
        });
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
}

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

export async function deletePlant(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const plantDocRef = doc(db, 'plants', id);
        await deleteDoc(plantDocRef);
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting plant with ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}

export async function deleteBlog(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const blogDocRef = doc(db, 'blogs', id);
        await deleteDoc(blogDocRef);
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting blog with ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}

export async function getAllBlogTitlesAndIds(): Promise<{ id: string; title: string }[]> {
    try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            title: (doc.data().title as BilingualString)?.en || `Blog ${doc.id}`
        }));
        return blogs;
    } catch (error) {
        console.error("Error fetching all blog titles:", error);
        return [];
    }
}


export async function getAllPlantTags(): Promise<string[]> {
    try {
        const plantsRef = collection(db, 'plants');
        const querySnapshot = await getDocs(plantsRef);
        const tags = new Set<string>();
        querySnapshot.docs.forEach(doc => {
            const plant = doc.data() as Plant;
            if (plant.tags) {
                plant.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    } catch (error) {
        console.error("Error fetching all plant tags:", error);
        return [];
    }
}

// The data structure passed to the server action, excluding fields generated by the server.
type PlantData = Omit<Plant, 'id' | 'createdAt'> & {
    id?: string;
};

export async function createOrUpdatePlant(
    data: PlantData
): Promise<{ success: boolean; error?: string; plantId?: string }> {
    try {
        const { id, ...plantData } = data;
        
        const plantCollection = collection(db, 'plants');
        let docRef;
        let isNew = false;

        if (id) {
            // Update
            docRef = doc(db, 'plants', id);
        } else {
            // Create
            docRef = doc(plantCollection);
            isNew = true;
        }
        
        const dataToSave = {
            ...plantData,
            // Only set createdAt on new documents
            ...(isNew && { createdAt: Timestamp.now() })
        };

        await setDoc(docRef, dataToSave, { merge: true });
        
        return { success: true, plantId: docRef.id };

    } catch (error: any) {
        console.error("Error creating/updating plant:", error);
        return { success: false, error: error.message };
    }
}

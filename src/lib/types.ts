import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  lastCheckedNotifications?: Timestamp;
}

export type BilingualString = {
  en: string;
  es: string;
};

export type BilingualTag = {
  id: string;
  en: string;
  es: string;
};

export interface Plant {
  id: string;
  name: BilingualString;
  scientificName?: string;
  family?: BilingualString;
  description: BilingualString;
  properties?: BilingualString;
  uses?: BilingualString;
  culturalSignificance?: BilingualString;
  preparationMethods?: BilingualString;
  dosage?: BilingualString;
  precautions?: BilingualString;
  ethicalHarvesting?: BilingualString;
  imageUrl?: string;
  videoUrl?: string;
  isLocked: boolean;
  createdAt: Timestamp;
  tags?: string[];
  relatedBlogs?: string[];
}

export interface Blog {
  id: string;
  title: BilingualString;
  content: BilingualString;
  imageUrl?: string;
  isLocked: boolean;
  createdAt: Timestamp;
  relatedPlants?: string[];
  tags?: BilingualTag[];
}

export interface Banner {
  imageUrl: string;
  enabled: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: Timestamp;
  userId: 'all' | string; // 'all' for broadcast, or a specific user ID
  read?: boolean;
}

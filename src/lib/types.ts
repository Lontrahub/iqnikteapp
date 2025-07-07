import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'admin';
  createdAt: Timestamp;
}

export type BilingualString = {
  en: string;
  es: string;
};

export interface Plant {
  id: string;
  name: BilingualString;
  description: BilingualString;
  properties?: BilingualString;
  uses?: BilingualString;
  culturalSignificance?: BilingualString;
  imageUrl?: string;
  isLocked: boolean;
  createdAt: Timestamp;
  tags?: string[];
}

export interface Blog {
  id: string;
  title: BilingualString;
  content: BilingualString;
  imageUrl?: string;
  isLocked: boolean;
  createdAt: Timestamp;
  relatedPlants?: string[];
}

export interface Banner {
  imageUrl: string;
  enabled: boolean;
}

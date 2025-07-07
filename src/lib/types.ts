import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'admin';
  createdAt: Timestamp;
}

export interface Plant {
  id: string;
  name: string;
  imageUrl: string;
  isLocked: boolean;
  createdAt: Timestamp;
}

export interface Blog {
  id: string;
  title: string;
  imageUrl: string;
  isLocked: boolean;
  createdAt: Timestamp;
}

export interface Banner {
  imageUrl: string;
  enabled: boolean;
}

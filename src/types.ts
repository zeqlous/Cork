import { Timestamp } from "firebase/firestore";

export interface Post {
  id?: string;
  title: string;
  price: string;
  imageUrl?: string;
  description: string;
  seller: string;
  timestamp?: Timestamp | Date;
}

export type SortOption = "newest" | "oldest" | "title";
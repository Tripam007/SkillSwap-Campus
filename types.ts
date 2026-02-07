
export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  avatar: string;
  skills: string[];
  reputation: number;
  tradesCompleted: number;
}

export type ListingType = 'SKILL' | 'MATERIAL';

export interface Listing {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: ListingType;
  title: string;
  description: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  mode?: 'Online' | 'Offline';
  duration?: string;
  tags: string[];
  createdAt: string;
  mediaUrl?: string;
}

export type TradeStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface Trade {
  id: string;
  requesterId: string;
  providerId: string;
  requesterItemId: string; 
  providerItemId: string;
  status: TradeStatus;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'thought';
  text: string;
  timestamp: number;
}

export type UserRole = 'customer' | 'worker';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  profession?: string;
  rating?: number;
  totalRatings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  workerId?: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  location: string;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  requestId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Rating {
  id: string;
  requestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
} 
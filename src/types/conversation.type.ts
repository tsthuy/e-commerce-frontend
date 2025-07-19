import type { Timestamp } from 'firebase/firestore';

export interface ConversationMetadata {
  conversationId: string;
  isSeen: boolean;
  lastMessage: string;
  receiverId: string;
  type: 'customer' | 'seller';
  updatedAt: Timestamp;
  unseenCount: number;
  receiverName?: string; // For display purposes
  receiverAvatar?: string; // For display purposes
}

export interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'seller';
  text: string;
  type: 'text' | 'image' | 'file';
  createdAt: Timestamp;
  senderName?: string; // For display purposes
  imageUrl?: string; // For image type messages
  fileUrl?: string; // For file type messages
  fileName?: string; // For file type messages
}

export interface ConversationDetail {
  conversationId: string;
  participants: {
    customerId: string;
    sellerId: string;
    customerName?: string;
    sellerName?: string;
    customerAvatar?: string;
    sellerAvatar?: string;
  };
  messages: Message[];
  lastMessage?: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface CreateConversationParams {
  customerId: string;
  sellerId: string;
  customerName?: string;
  sellerName?: string;
  initialMessage?: string;
}

export interface SendMessageParams {
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'seller';
  text: string;
  type: 'text' | 'image' | 'file';
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface ConversationListParams {
  userId: string;
  userType: 'customer' | 'seller';
  page?: number;
  limit?: number;
}

export interface MessagesListParams {
  conversationId: string;
  page?: number;
  limit?: number;
}

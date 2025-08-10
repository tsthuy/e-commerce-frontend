/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, startAfter, Timestamp, updateDoc } from 'firebase/firestore';

import type { ConversationListParams, ConversationMetadata, CreateConversationParams, Message, MessagesListParams, SendMessageParams } from '~/types';

import { firestore } from '~/libs/firebase.lib';

export class ConversationService {
  static async checkConversationExists(customerId: string, sellerId: string, userType: 'customer' | 'seller'): Promise<boolean> {
    try {
      const conversationId = `${customerId}_${sellerId}`;
      const userId = userType === 'customer' ? customerId : sellerId;
      const docRef = doc(firestore, `allConversation/${userType}_${userId}/conversations`, conversationId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking conversation:', error);
      return false;
    }
  }
  static async createConversation(params: CreateConversationParams): Promise<string> {
    try {
      const { customerId, sellerId, customerName, sellerName, initialMessage } = params;
      const conversationId = `${customerId}_${sellerId}`;
      const now = Timestamp.now();
      const customerConversationRef = doc(firestore, `allConversation/customer_${customerId}/conversations`, conversationId);
      await setDoc(customerConversationRef, {
        conversationId,
        isSeen: true,
        lastMessage: initialMessage || '',
        receiverId: sellerId,
        type: 'seller',
        updatedAt: now,
        unseenCount: 0,
        receiverName: sellerName || 'Seller',
        receiverAvatar: ''
      } as ConversationMetadata);
      const sellerConversationRef = doc(firestore, `allConversation/seller_${sellerId}/conversations`, conversationId);
      await setDoc(sellerConversationRef, {
        conversationId,
        isSeen: false,
        lastMessage: initialMessage || '',
        receiverId: customerId,
        type: 'customer',
        updatedAt: now,
        unseenCount: initialMessage ? 1 : 0,
        receiverName: customerName || 'Customer',
        receiverAvatar: ''
      } as ConversationMetadata);

      const conversationDocRef = doc(firestore, 'messagesOfConversation', conversationId);
      await setDoc(conversationDocRef, {
        conversationId,
        participants: {
          customerId,
          sellerId,
          customerName: customerName || 'Customer',
          sellerName: sellerName || 'Seller'
        },
        createdAt: now,
        updatedAt: now
      });
      if (initialMessage) {
        await this.sendMessage({
          conversationId,
          senderId: customerId,
          senderType: 'customer',
          text: initialMessage,
          type: 'text'
        });
      }

      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
  static async sendMessage(params: SendMessageParams): Promise<string> {
    try {
      const { conversationId, senderId, senderType, text, type, imageUrl, fileUrl, fileName } = params;
      const now = Timestamp.now();
      const [customerId, sellerId] = conversationId.split('_');

      await this.ensureConversationExists(conversationId, customerId, sellerId, senderType);
      const messagesRef = collection(firestore, `messagesOfConversation/${conversationId}/messages`);
      const messageDoc = await addDoc(messagesRef, {
        senderId,
        senderType,
        text,
        type,
        createdAt: now,
        ...(imageUrl && { imageUrl }),
        ...(fileUrl && { fileUrl }),
        ...(fileName && { fileName })
      } as Omit<Message, 'id'>);
      const messagePreview = text || (type === 'image' ? '📷 Image' : '📎 File');

      const senderDocId = senderType === 'customer' ? `customer_${senderId}` : `seller_${senderId}`;
      const senderConversationRef = doc(firestore, `allConversation/${senderDocId}/conversations`, conversationId);
      await updateDoc(senderConversationRef, {
        lastMessage: messagePreview,
        updatedAt: now,
        isSeen: true
      });
      const receiverId = senderType === 'customer' ? sellerId : customerId;
      const receiverType = senderType === 'customer' ? 'seller' : 'customer';
      const receiverDocId = receiverType === 'customer' ? `customer_${receiverId}` : `seller_${receiverId}`;
      const receiverConversationRef = doc(firestore, `allConversation/${receiverDocId}/conversations`, conversationId);

      const receiverDoc = await getDoc(receiverConversationRef);
      const currentUnseenCount = receiverDoc.exists() ? receiverDoc.data().unseenCount || 0 : 0;

      await updateDoc(receiverConversationRef, {
        lastMessage: messagePreview,
        updatedAt: now,
        isSeen: false,
        unseenCount: currentUnseenCount + 1
      });

      return messageDoc.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  private static async ensureConversationExists(conversationId: string, customerId: string, sellerId: string, initiatorType: 'customer' | 'seller'): Promise<void> {
    try {
      const now = Timestamp.now();

      const customerDocRef = doc(firestore, `allConversation/customer_${customerId}/conversations`, conversationId);
      const customerDoc = await getDoc(customerDocRef);
      if (!customerDoc.exists()) {
        await setDoc(customerDocRef, {
          conversationId,
          isSeen: initiatorType === 'customer',
          lastMessage: '',
          receiverId: sellerId,
          receiverName: 'Seller',
          receiverAvatar: '',
          type: 'seller',
          updatedAt: now,
          unseenCount: initiatorType === 'customer' ? 0 : 1
        } as ConversationMetadata);
      }
      const sellerDocRef = doc(firestore, `allConversation/seller_${sellerId}/conversations`, conversationId);
      const sellerDoc = await getDoc(sellerDocRef);
      if (!sellerDoc.exists()) {
        await setDoc(sellerDocRef, {
          conversationId,
          isSeen: initiatorType === 'seller',
          lastMessage: '',
          receiverId: customerId,
          receiverName: 'Customer',
          receiverAvatar: '',
          type: 'customer',
          updatedAt: now,
          unseenCount: initiatorType === 'seller' ? 0 : 1
        } as ConversationMetadata);
      }
    } catch (error) {
      console.error('Error ensuring conversation exists:', error);
      throw error;
    }
  }

  static subscribeToConversations(params: ConversationListParams, callback: (conversations: ConversationMetadata[]) => void): () => void {
    try {
      const { userId, userType, limit: pageLimit = 20 } = params;

      const docId = `${userType}_${userId}`;
      const conversationsRef = collection(firestore, `allConversation/${docId}/conversations`);
      const q = query(conversationsRef, orderBy('updatedAt', 'desc'), limit(pageLimit));

      return onSnapshot(q, (snapshot) => {
        const conversations: ConversationMetadata[] = [];
        snapshot.forEach((doc) => {
          conversations.push({
            conversationId: doc.id,
            ...doc.data()
          } as ConversationMetadata);
        });
        callback(conversations);
      });
    } catch (error) {
      console.error('Error subscribing to conversations:', error);
      return () => {};
    }
  }
  static subscribeToMessages(params: MessagesListParams, callback: (messages: Message[], hasMore: boolean) => void, lastVisible?: QueryDocumentSnapshot<DocumentData>): () => void {
    try {
      const { conversationId, limit: pageLimit = 20 } = params;

      const messagesRef = collection(firestore, `messagesOfConversation/${conversationId}/messages`);

      let q = query(messagesRef, orderBy('createdAt', 'desc'), limit(pageLimit));

      if (lastVisible) {
        q = query(messagesRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(pageLimit));
      }

      return onSnapshot(q, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data()
          } as Message);
        });
        messages.reverse();
        const hasMore = snapshot.docs.length === pageLimit;

        callback(messages, hasMore);
      });
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      return () => {};
    }
  }

  static async markConversationAsSeen(userId: string, conversationId: string, userType: 'customer' | 'seller'): Promise<void> {
    try {
      const docId = `${userType}_${userId}`;
      const conversationRef = doc(firestore, `allConversation/${docId}/conversations`, conversationId);
      await updateDoc(conversationRef, {
        isSeen: true,
        unseenCount: 0
      });
    } catch (error) {
      console.error('Error marking conversation as seen:', error);
      throw error;
    }
  }
  static async getConversationMetadata(userId: string, conversationId: string, userType: 'customer' | 'seller'): Promise<ConversationMetadata | null> {
    try {
      const docId = `${userType}_${userId}`;
      const conversationRef = doc(firestore, `allConversation/${docId}/conversations`, conversationId);
      const docSnap = await getDoc(conversationRef);

      if (docSnap.exists()) {
        return { conversationId: docSnap.id, ...docSnap.data() } as ConversationMetadata;
      }

      return null;
    } catch (error) {
      console.error('Error getting conversation metadata:', error);
      return null;
    }
  }
  static async getOlderMessages(params: { conversationId: string; beforeMessageId?: string; limit?: number }): Promise<Message[]> {
    try {
      const { conversationId, beforeMessageId, limit: pageLimit = 30 } = params;
      const messagesRef = collection(firestore, `messagesOfConversation/${conversationId}/messages`);

      let q = query(messagesRef, orderBy('createdAt', 'desc'), limit(pageLimit));

      if (beforeMessageId) {
        const beforeMessageDoc = doc(messagesRef, beforeMessageId);
        const beforeMessageSnap = await getDoc(beforeMessageDoc);
        if (beforeMessageSnap.exists()) {
          q = query(messagesRef, orderBy('createdAt', 'desc'), startAfter(beforeMessageSnap), limit(pageLimit));
        }
      }

      const snapshot = await getDocs(q);
      const messages: Message[] = [];

      snapshot.forEach((docSnap) => {
        messages.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Message);
      });

      return messages.reverse();
    } catch (error) {
      console.error('Error getting older messages:', error);
      throw error;
    }
  }
}

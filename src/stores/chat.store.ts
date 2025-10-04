/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import type { ChatMessage, ChatState } from '~/types/chat.types';

interface ChatActions {
  toggleChat: () => void;
  closeChat: () => void;
  addMessage: (content: string, isUser: boolean) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSessionId: (sessionId: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  sessionId: null,
  error: null,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  closeChat: () => set({ isOpen: false }),

  addMessage: (content: string, isUser: boolean) => {
    const message: ChatMessage = {
      id: uuidv4(),
      content,
      isUser,
      timestamp: new Date(),
      status: isUser ? 'sending' : 'sent'
    };

    set((state) => ({
      messages: [...state.messages, message]
    }));

    return message.id;
  },

  updateMessage: (id: string, updates: Partial<ChatMessage>) =>
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  setSessionId: (sessionId: string) => set({ sessionId }),

  clearMessages: () => set({ messages: [] })
}));

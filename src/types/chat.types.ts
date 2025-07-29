export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  timestamp: string;
  success: boolean;
  error: string | null;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
}

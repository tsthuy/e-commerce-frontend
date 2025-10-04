export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatMessageResponse {
  id: string;
  customerProfileId?: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
}

export interface ChatMessageListResponse {
  messages: ChatMessageResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
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

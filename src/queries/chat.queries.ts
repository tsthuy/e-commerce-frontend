import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiResponse, ChatMessageListResponse, QueryParams } from '~/types';

import type { ChatPaginationParams } from '~/services/chat.api';
import { chatApi } from '~/services/chat.api';

interface ChatHealthResponse {
  status: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  messages: unknown[];
  sessionId: string;
}

export const chatQueries = createQueryKeys('chat', {
  messages: (params: QueryParams<ChatPaginationParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<ChatMessageListResponse>> => {
      const { data } = await chatApi.getMessages(params.data);
      return data;
    }
  }),
  health: (params = {}) => ({
    queryKey: [params],
    queryFn: async (): Promise<ChatHealthResponse> => {
      const { data } = await chatApi.health();
      return data as ChatHealthResponse;
    }
  }),
  history: (params: { sessionId: string }) => ({
    queryKey: [params],
    queryFn: async (): Promise<ChatHistoryResponse> => {
      const { data } = await chatApi.getHistory(params.sessionId);
      return data as ChatHistoryResponse;
    }
  })
});

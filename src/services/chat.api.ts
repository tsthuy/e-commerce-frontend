/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { ApiResponse, ChatMessageListResponse } from '~/types';

import { httpBase } from './config.service';

import { API_URLS } from '~/constants/apis.const';
import type { ChatRequest, ChatResponse } from '~/types/chat.types';

export interface ChatPaginationParams {
  page?: number;
  size?: number;
}

export const chatApi = {
  sendMessage: ({ data }: { data: ChatRequest }) => httpBase.post<ChatRequest, ChatResponse>('/api/chat/message', data),

  getMessages: ({ page = 0, size = 50 }: ChatPaginationParams = {}) =>
    httpBase.get<ApiResponse<ChatMessageListResponse>>(API_URLS.chat.getMessages, {
      params: { page, size }
    }),

  getHistory: (sessionId: string) => httpBase.get(API_URLS.chat.getHistory(sessionId)),

  clearHistory: (sessionId: string) => httpBase.delete(API_URLS.chat.clearHistory(sessionId)),

  health: () => httpBase.get(API_URLS.chat.health)
};

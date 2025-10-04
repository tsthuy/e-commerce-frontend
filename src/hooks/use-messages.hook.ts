import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse, ChatMessageListResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

import type { ChatPaginationParams } from '~/services/chat.api';

interface ChatHealthResponse {
  status: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  messages: unknown[];
  sessionId: string;
}

export function useMessagesList({ data, enabled = true, retry = false }: UseQueryParams<ChatPaginationParams>): UseQueryResult<ApiResponse<ChatMessageListResponse>> {
  const queryResponse = useQuery({
    ...queries.chat.messages({ data }),
    retry,
    enabled
  });
  return queryResponse;
}

export function useChatHealth({ enabled = true, retry = 1 }: { enabled?: boolean; retry?: number | boolean } = {}): UseQueryResult<ChatHealthResponse> {
  const queryResponse = useQuery({
    ...queries.chat.health(),
    retry,
    enabled
  });
  return queryResponse;
}

export function useChatHistory({ sessionId, enabled = true, retry = false }: UseQueryParams & { sessionId: string }): UseQueryResult<ChatHistoryResponse> {
  const queryResponse = useQuery({
    ...queries.chat.history({ sessionId }),
    retry,
    enabled: enabled && !!sessionId
  });
  return queryResponse;
}

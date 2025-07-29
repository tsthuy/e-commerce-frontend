/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { httpBase } from './config.service';

import type { ChatRequest, ChatResponse } from '~/types/chat.types';

export const chatApi = {
  sendMessage: ({ data }: { data: ChatRequest }) => httpBase.post<ChatRequest, ChatResponse>('/api/chat/message', data)
};

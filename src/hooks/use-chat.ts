/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useCallback } from 'react';

import { toast } from 'sonner';

import { chatApi } from '~/services';

import { getErrorMessage } from '~/utils';

import { useChatStore } from '~/stores/chat.store';

export const useChat = () => {
  const { isOpen, messages, isLoading, sessionId, error, toggleChat, closeChat, addMessage, updateMessage, setLoading, setError, setSessionId, clearMessages } = useChatStore();

  const handleCloseChat = useCallback(() => {
    closeChat();
    clearMessages();
  }, [closeChat, clearMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      const userMessageId = addMessage(content, true);
      setLoading(true);
      setError(null);

      try {
        const { data } = await chatApi.sendMessage({
          data: {
            message: content,
            ...(sessionId && { sessionId })
          }
        });
        updateMessage(userMessageId, { status: 'sent' });
        addMessage(data.message, false);
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      } catch (error) {
        updateMessage(userMessageId, { status: 'error' });

        const errorMessage = getErrorMessage(error, 'Service đang bận, hãy thử lại sau');
        setError(errorMessage);
        addMessage('Service đang bận, hãy thử lại sau', false);

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isLoading, sessionId, addMessage, updateMessage, setLoading, setError, setSessionId]
  );

  return {
    isOpen,
    messages,
    isLoading,
    sessionId,
    error,

    toggleChat,
    closeChat: handleCloseChat,
    sendMessage
  };
};

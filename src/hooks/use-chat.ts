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
    clearMessages(); // Clear current session messages when closing
  }, [closeChat, clearMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Add user message
      const userMessageId = addMessage(content, true);
      setLoading(true);
      setError(null);

      try {
        // Call API
        const { data } = await chatApi.sendMessage({
          data: {
            message: content,
            ...(sessionId && { sessionId })
          }
        });

        // Update user message status
        updateMessage(userMessageId, { status: 'sent' });

        // Add bot response
        addMessage(data.message, false);

        // Update session ID
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      } catch (error) {
        // Update user message to error
        updateMessage(userMessageId, { status: 'error' });

        const errorMessage = getErrorMessage(error, 'Service đang bận, hãy thử lại sau');
        setError(errorMessage);

        // Add error bot message
        addMessage('Service đang bận, hãy thử lại sau', false);

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isLoading, sessionId, addMessage, updateMessage, setLoading, setError, setSessionId]
  );

  return {
    // State
    isOpen,
    messages,
    isLoading,
    sessionId,
    error,

    // Actions
    toggleChat,
    closeChat: handleCloseChat,
    sendMessage
  };
};

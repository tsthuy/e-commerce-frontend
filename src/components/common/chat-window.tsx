import { memo, useEffect, useRef } from 'react';

import { MessageCircle, X } from 'lucide-react';

import type { ApiResponse, ChatMessage, ChatMessageListResponse, ChatMessageResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { cn } from '~/utils';

import { ChatInput } from './chat-input';
import { ChatMessageComponent } from './chat-message';

import { useChat } from '~/hooks/use-chat';
import { useMessagesList } from '~/hooks/use-messages.hook';

export const ChatWindow = memo(() => {
  const { t } = useTranslation();
  const { isOpen, messages, isLoading, sendMessage, toggleChat, closeChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: chatHistory, isLoading: isLoadingHistory } = useMessagesList({
    data: { page: 0, size: 50 },
    enabled: isOpen
  });

  const welcomeMessage = {
    id: 'welcome',
    content: t('Chat.welcomeMessage'),
    isUser: false,
    timestamp: new Date(),
    status: 'sent' as const
  };

  const convertHistoryToMessages = (history: ApiResponse<ChatMessageListResponse> | undefined): ChatMessage[] => {
    if (!history?.result?.messages) return [];

    return history.result.messages.flatMap((item: ChatMessageResponse) => [
      {
        id: `${item.id}-user`,
        content: item.userMessage,
        isUser: true,
        timestamp: new Date(item.timestamp),
        status: 'sent' as const
      },
      {
        id: `${item.id}-bot`,
        content: item.botResponse,
        isUser: false,
        timestamp: new Date(item.timestamp),
        status: 'sent' as const
      }
    ]);
  };

  const historyMessages = convertHistoryToMessages(chatHistory);

  const currentSessionMessages = messages.filter(
    (msg) =>
      msg.status === 'sending' ||
      msg.status === 'error' ||
      !historyMessages.some((histMsg) => histMsg.content === msg.content && Math.abs(new Date(histMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 5000)
  );

  const allMessages = [...historyMessages, ...currentSessionMessages];

  const sortedMessages = allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const hasAnyMessages = historyMessages.length > 0 || currentSessionMessages.length > 0;
  const displayMessages = hasAnyMessages ? sortedMessages : !isLoadingHistory ? [welcomeMessage] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  if (!isOpen) {
    return (
      <button
        aria-label="Mở chat"
        type="button"
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'h-14 w-14 bg-teal-500 hover:bg-teal-600',
          'rounded-full shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'text-white transition-all duration-200',
          'transform hover:scale-105 active:scale-95'
        )}
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={cn('h-[600px] w-96 rounded-lg bg-white shadow-2xl', 'flex flex-col border border-gray-200', 'transform transition-all duration-200', 'animate-in slide-in-from-bottom-4')}>
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-teal-500 p-4 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <h3 className="font-medium">{t('Chat.virtualAssistant')}</h3>
          </div>
          <button aria-label={t('Chat.closeChat')} className="rounded p-1 transition-colors hover:bg-teal-600" type="button" onClick={closeChat}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {isLoadingHistory && (
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">{t('Chat.loadingChatHistory')}</div>
            </div>
          )}

          {displayMessages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="mb-4 flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                <MessageCircle className="text-gray-600" size={16} />
              </div>
              <div className="rounded-lg bg-gray-100 px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput isLoading={isLoading} onSendMessage={sendMessage} />
      </div>
    </div>
  );
});

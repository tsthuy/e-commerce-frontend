import { memo, useEffect, useRef } from 'react';

import { MessageCircle, X } from 'lucide-react';

import type { ApiResponse, ChatMessage, ChatMessageListResponse, ChatMessageResponse } from '~/types';

import { cn } from '~/utils';

import { ChatInput } from './chat-input';
import { ChatMessageComponent } from './chat-message';

import { useChat } from '~/hooks/use-chat';
import { useMessagesList } from '~/hooks/use-messages.hook';

export const ChatWindow = memo(() => {
  const { isOpen, messages, isLoading, sendMessage, toggleChat, closeChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when chat is opened
  const { data: chatHistory, isLoading: isLoadingHistory } = useMessagesList({
    data: { page: 0, size: 50 },
    enabled: isOpen
  });

  // Welcome message
  const welcomeMessage = {
    id: 'welcome',
    content: 'Xin chào! Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn tìm kiếm sản phẩm, so sánh giá cả và trả lời các câu hỏi về sản phẩm. Bạn cần hỗ trợ gì?',
    isUser: false,
    timestamp: new Date(),
    status: 'sent' as const
  };

  // Convert chat history to ChatMessage format
  const convertHistoryToMessages = (history: ApiResponse<ChatMessageListResponse> | undefined): ChatMessage[] => {
    if (!history?.result?.messages) return [];

    // eslint-disable-next-line no-console
    console.log('🔍 Converting chat history:', history.result);

    return history.result.messages.flatMap((item: ChatMessageResponse) => [
      // User message
      {
        id: `${item.id}-user`,
        content: item.userMessage,
        isUser: true,
        timestamp: new Date(item.timestamp),
        status: 'sent' as const
      },
      // Bot response
      {
        id: `${item.id}-bot`,
        content: item.botResponse,
        isUser: false,
        timestamp: new Date(item.timestamp),
        status: 'sent' as const
      }
    ]);
  };

  // Combine history and current messages
  const historyMessages = convertHistoryToMessages(chatHistory);

  // Filter out current session messages that might already be in history
  // Only keep messages from current session that are not saved yet (e.g., sending status)
  const currentSessionMessages = messages.filter(
    (msg) =>
      msg.status === 'sending' ||
      msg.status === 'error' ||
      !historyMessages.some(
        (histMsg) => histMsg.content === msg.content && Math.abs(new Date(histMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 5000 // within 5 seconds
      )
  );

  // eslint-disable-next-line no-console
  console.log('📋 History messages:', historyMessages);
  // eslint-disable-next-line no-console
  console.log('💬 Current session messages:', currentSessionMessages);

  const allMessages = [...historyMessages, ...currentSessionMessages];

  // Sort messages by timestamp
  const sortedMessages = allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Show welcome message only if no history and no current messages and not loading
  const hasAnyMessages = historyMessages.length > 0 || currentSessionMessages.length > 0;
  const displayMessages = hasAnyMessages ? sortedMessages : !isLoadingHistory ? [welcomeMessage] : [];

  // Auto scroll to bottom
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
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-teal-500 p-4 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <h3 className="font-medium">Trợ lý ảo</h3>
          </div>
          <button aria-label="Đóng chat" className="rounded p-1 transition-colors hover:bg-teal-600" type="button" onClick={closeChat}>
            <X size={18} />
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {/* History loading indicator */}
          {isLoadingHistory && (
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">Đang tải lịch sử chat...</div>
            </div>
          )}

          {displayMessages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
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
        {/* Input */}
        <ChatInput isLoading={isLoading} onSendMessage={sendMessage} />
      </div>
    </div>
  );
});

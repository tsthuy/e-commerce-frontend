import { memo, useEffect, useRef } from 'react';

import { MessageCircle, X } from 'lucide-react';

import { cn } from '~/utils';

import { ChatInput } from './chat-input';
import { ChatMessageComponent } from './chat-message';

import { useChat } from '~/hooks/use-chat';

export const ChatWindow = memo(() => {
  const { isOpen, messages, isLoading, sendMessage, toggleChat, closeChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome message
  const welcomeMessage = {
    id: 'welcome',
    content: 'Xin chào! Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn tìm kiếm sản phẩm, so sánh giá cả và trả lời các câu hỏi về sản phẩm. Bạn cần hỗ trợ gì?',
    isUser: false,
    timestamp: new Date(),
    status: 'sent' as const
  };

  // Show welcome message if no messages
  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

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

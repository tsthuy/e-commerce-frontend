import { memo } from 'react';

import { AlertCircle, Bot, Clock, User } from 'lucide-react';

import { cn } from '~/utils';

import { MarkdownMessage } from './markdown-message';

import type { ChatMessage } from '~/types/chat.types';

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent = memo<ChatMessageProps>(({ message }) => {
  const { content, isUser, timestamp, status } = message;

  return (
    <div className={cn('mb-4 flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full', isUser ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600')}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={cn('relative max-w-[80%] rounded-lg px-3 py-2', isUser ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-800')}>
        {isUser ? <div className="whitespace-pre-wrap break-words text-sm">{content}</div> : <MarkdownMessage className="whitespace-pre-wrap break-words text-sm" content={content} />}

        {isUser && (
          <div className="mt-1 flex items-center justify-end gap-1">
            {status === 'sending' && (
              <>
                <Clock className="text-teal-100" size={12} />
                <span className="text-xs text-teal-100">Đang gửi...</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="text-red-200" size={12} />
                <span className="text-xs text-red-200">Lỗi</span>
              </>
            )}
            {status === 'sent' && (
              <span className="text-xs text-teal-100">
                {new Date(timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        )}

        {!isUser && (
          <div className="mt-1 text-xs text-gray-500">
            {new Date(timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
});

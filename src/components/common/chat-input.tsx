/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { KeyboardEvent } from 'react';
import { memo, useRef, useState } from 'react';

import { Loader2, Send } from 'lucide-react';

import { useTranslation } from '~/hooks';

import { cn } from '~/utils';

import { Textarea } from '~/components/ui';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = memo<ChatInputProps>(({ onSendMessage, isLoading, disabled = false }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  };

  const canSend = message.trim() && !isLoading && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-center justify-center gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            disabled={disabled || isLoading}
            placeholder={t('Chat.enterMessage')}
            rows={1}
            value={message}
            className={cn(
              'w-full resize-none rounded-lg border border-gray-300 px-3 pr-10',
              'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500',
              'max-h-[100px] min-h-[40px] text-sm placeholder-gray-400',
              (disabled || isLoading) && 'cursor-not-allowed bg-gray-50'
            )}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          disabled={!canSend}
          type="button"
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
            canSend ? 'bg-teal-500 text-white hover:bg-teal-600' : 'cursor-not-allowed bg-gray-200 text-gray-400'
          )}
          onClick={handleSend}
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
});

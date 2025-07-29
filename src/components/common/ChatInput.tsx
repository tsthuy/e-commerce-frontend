import { Loader2, Send } from 'lucide-react';
import { KeyboardEvent, memo, useRef, useState } from 'react';
import { cn } from '~/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = memo<ChatInputProps>(({ onSendMessage, isLoading, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    // Reset textarea height
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

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  };

  const canSend = message.trim() && !isLoading && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn của bạn..."
            disabled={disabled || isLoading}
            className={cn(
              'w-full resize-none rounded-lg border border-gray-300 px-3 py-2 pr-10',
              'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500',
              'max-h-[100px] min-h-[40px] text-sm placeholder-gray-400',
              (disabled || isLoading) && 'cursor-not-allowed bg-gray-50'
            )}
            rows={1}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
            canSend ? 'bg-teal-500 text-white hover:bg-teal-600' : 'cursor-not-allowed bg-gray-200 text-gray-400'
          )}
          type="button"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
});

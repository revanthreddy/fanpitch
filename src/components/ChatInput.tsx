import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { PiBaseballDuotone } from 'react-icons/pi';

interface ChatInputProps {
  onSubmit: (text: string) => void;
  onAISubmit?: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSubmit,
  onAISubmit,
  disabled = false,
  placeholder = 'Type your message here...',
}: ChatInputProps) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (withAI: boolean = false) => {
    if (!text.trim() || disabled) return;
    if (withAI && onAISubmit) {
      onAISubmit(text);
    } else {
      onSubmit(text);
    }
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(false);
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit(true);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="relative flex items-end gap-2 max-w-container mx-auto">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 py-2.5 px-3 border border-gray-300 rounded-2xl resize-none focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none max-h-textarea min-h-[44px] leading-5 bg-gray-50"
          rows={1}
          disabled={disabled}
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={disabled || !text.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-primary disabled:bg-gray-300 text-white hover:brightness-125 hover:disabled:brightness-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:focus:ring-gray-300"
            title="Send message">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                fill="currentColor"
              />
            </svg>
          </button>
          {onAISubmit && (
            <button
              onClick={() => handleSubmit(true)}
              disabled={disabled || !text.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-secondary disabled:bg-gray-300 text-white flex items-center justify-center hover:brightness-125 hover:disabled:brightness-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:focus:ring-gray-300"
              title="Send message and get AI response">
              <PiBaseballDuotone className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      <div className="hidden sm:block text-xs text-gray-500 mt-1 px-3">
        Press Enter to send, Shift+Enter to send with AI response
      </div>
    </div>
  );
};

export default ChatInput;

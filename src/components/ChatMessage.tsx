import { ChatMessage as ChatMessageType } from '../types';
import clsx from 'clsx';
import AIBanner from './AIBanner';

export interface ChatMessageProps extends ChatMessageType {
  isSequential?: boolean;
}

const ChatMessage = ({
  timestamp,
  text,
  isSequential,
  sender,
}: ChatMessageProps) => {
  if (sender.isAI) {
    return <AIBanner timestamp={timestamp} text={text} sender={sender} />;
  }

  return (
    <div
      className={clsx(
        'group flex',
        sender.isUser ? 'justify-end' : 'justify-start',
        !isSequential && 'mt-4',
      )}>
      {!sender.isUser && !isSequential && (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2 flex-shrink-0">
          {sender.avatar || 'G'}
        </div>
      )}
      <div
        className={clsx(
          'relative max-w-[80%] px-4 py-2 rounded-2xl break-words',
          sender.isUser
            ? 'bg-chat-user-bg text-chat-user-text rounded-br-sm'
            : 'bg-chat-bot-bg text-chat-bot-text rounded-bl-sm',
          isSequential && (sender.isUser ? 'mr-10' : 'ml-10'),
        )}>
        {!isSequential && sender && (
          <div className="text-xs text-gray-500 mb-1">{sender.name}</div>
        )}
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
      {sender.isUser && !isSequential && (
        <div className="w-8 h-8 rounded-full bg-chat-user-text text-white flex items-center justify-center text-sm font-medium ml-2 flex-shrink-0">
          {sender?.avatar || 'U'}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

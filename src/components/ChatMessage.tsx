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
  videoUrls,
}: ChatMessageProps) => {
  if (sender.isAI) {
    return (
      <AIBanner
        timestamp={timestamp}
        text={text}
        sender={sender}
        videoUrls={videoUrls}
      />
    );
  }

  return (
    <div
      className={clsx(
        'group flex animate-float-in items-end',
        sender.isUser ? 'justify-end' : 'justify-start',
        !isSequential && 'mt-4',
      )}>
      {!sender.isUser && !isSequential && (
        <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center text-sm font-medium mr-2 flex-shrink-0 shadow-avatar">
          {sender.avatar || 'G'}
        </div>
      )}
      <div
        className={clsx(
          'relative max-w-[80%] px-4 py-2 rounded-2xl break-words transition-all duration-200',
          sender.isUser
            ? `bg-chat-user-bg text-chat-user-text ${
                isSequential ? 'rounded-tr-sm' : 'rounded-br-sm'
              } shadow-message shadow-chat-user-shadow`
            : `bg-chat-message-bg text-chat-message-text ${
                isSequential ? 'rounded-tl-sm' : 'rounded-bl-sm'
              } shadow-message shadow-chat-message-shadow`,
          isSequential && (sender.isUser ? 'mr-12' : 'ml-12'),
          'hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200',
        )}>
        {!isSequential && sender && (
          <div
            className={clsx(
              'text-xs mb-1',
              sender.isUser ? 'text-chat-user-text/75' : 'text-gray-500',
            )}>
            {sender.name}
          </div>
        )}
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
      {sender.isUser && !isSequential && (
        <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center text-sm font-medium ml-2 flex-shrink-0 shadow-avatar">
          {sender?.avatar || 'U'}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

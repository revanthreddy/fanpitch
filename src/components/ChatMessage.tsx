import { Message, ChatMessage as ChatMessageType } from '../types';
import clsx from 'clsx';

interface ChatMessageProps extends Message {
  isSequential?: boolean;
  sender?: ChatMessageType['sender'];
}

const ChatMessage = ({
  text,
  isUser,
  isSequential,
  sender,
}: ChatMessageProps) => {
  return (
    <div
      className={clsx(
        'group flex',
        isUser ? 'justify-end' : 'justify-start',
        !isSequential && 'mt-4',
      )}>
      {!isUser && !isSequential && (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2 flex-shrink-0">
          {sender?.avatar || 'G'}
        </div>
      )}
      <div
        className={clsx(
          'relative max-w-[80%] px-4 py-2 rounded-2xl break-words',
          isUser
            ? 'bg-chat-user-bg text-chat-user-text rounded-br-sm'
            : 'bg-chat-bot-bg text-chat-bot-text rounded-bl-sm',
          isSequential && (isUser ? 'mr-10' : 'ml-10'),
        )}>
        {!isSequential && sender && (
          <div className="text-xs text-gray-500 mb-1">{sender.name}</div>
        )}
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
      {isUser && !isSequential && (
        <div className="w-8 h-8 rounded-full bg-chat-user-text text-white flex items-center justify-center text-sm font-medium ml-2 flex-shrink-0">
          {sender?.avatar || 'U'}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

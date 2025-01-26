import { ChatMessage } from '../types';
const AIBanner = ({ text, sender }: ChatMessage) => {
  return (
    <div className={`w-full flex justify-center my-8`}>
      <div className="max-w-ai-banner bg-gradient-to-r from-chat-ai-border-from via-chat-ai-border-via to-chat-ai-border-to rounded-lg p-[2px] shadow-lg hover:shadow-xl transition-all">
        <div className="bg-white rounded-lg p-banner-padding relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chat-ai-accent rounded-full animate-bounce" />
              <span className="text-sm font-bold text-chat-ai-text uppercase tracking-wider">
                MLB AI Assistant
              </span>
            </div>
            <div className="text-xs text-gray-500">{sender?.name}</div>
          </div>

          <div className="text-chat-ai-text whitespace-pre-wrap font-medium">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBanner;

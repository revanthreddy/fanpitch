import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage as ChatMessageType, Participant } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { useChatSimulation } from './hooks/useChatSimulation';
import { MLBStatsPoller, MLBGameResponse } from './utils/MLBStatsPoller';
import {
  MLBDataForwarder,
  MLBForwardingResponse,
} from './utils/MLBDataForwarder';
import { mockConversation } from './mocks/mockConversation';
import { getMockTime } from './utils/dateUtils';
import { PiBaseballHelmetDuotone } from 'react-icons/pi';

const USER_SENDER: Participant = {
  id: 'user',
  name: 'You',
  avatar: 'U',
  isUser: true,
};

const BOT_SENDER: Participant = {
  id: 'mlb-bot',
  name: 'MLB Bot',
  avatar: '⚾',
  isAI: true,
};

// MLB Stats Poller configuration
const MLB_POLL_INTERVAL = 15000;

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessageType[]>([]);
  const mlbDataForwarder = useRef(MLBDataForwarder.getInstance());
  const mlbPoller = useRef<MLBStatsPoller | null>(null);

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleMLBUpdate = useCallback(async (mlbData: MLBGameResponse) => {
    try {
      const response: MLBForwardingResponse =
        await mlbDataForwarder.current.forwardData(mlbData, {
          ...mockConversation,
          messages: messagesRef.current.filter(
            (msg) => msg.timestamp <= getMockTime(),
          ),
        });

      if (!response.summary) return;

      const newMessage: ChatMessageType = {
        id: Math.random().toString(),
        text: response.summary,
        videoUrls: response.videos?.map((videoObj) => videoObj.video),
        timestamp: getMockTime(),
        sender: BOT_SENDER,
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Error handling MLB update:', error);
    }
  }, []); // No dependencies needed since we use refs

  // Initialize MLB Stats Poller
  useEffect(() => {
    mlbPoller.current = MLBStatsPoller.getInstance(
      MLB_POLL_INTERVAL,
      mockConversation.endTime,
      handleMLBUpdate,
    );

    return () => {
      mlbPoller.current?.stopPolling();
    };
  }, []);

  // Use simulated messages
  const { messages: simulatedMessages, isSimulating } = useChatSimulation();

  // Handle simulated messages
  useEffect(() => {
    setMessages((prev) =>
      [
        ...prev,
        ...simulatedMessages.filter(
          (msg) => !prev.some((p) => p.id === msg.id),
        ),
      ].sort((a, b) => a.timestamp - b.timestamp),
    );
  }, [simulatedMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGenerateResponse = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://us-central1-ethereal-temple-448819-n0.cloudfunctions.net/playgist_function/ask',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ask: prompt,
          }),
        },
      );

      const data = await response.json();
      const newMessage: ChatMessageType = {
        id: Math.random().toString(),
        text: data.summary,
        videoUrls: data.clip ? [data.clip] : [],
        timestamp: getMockTime(),
        sender: BOT_SENDER,
      };
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: Math.random().toString(),
        text: `Error: ${(error as Error).message}`,
        timestamp: getMockTime(),
        sender: BOT_SENDER,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessageType = {
      id: Math.random().toString(),
      text,
      timestamp: getMockTime(),
      sender: USER_SENDER,
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const handleAISubmit = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessageType = {
      id: Math.random().toString(),
      text,
      timestamp: getMockTime(),
      sender: USER_SENDER,
    };
    setMessages((prev) => [...prev, userMessage]);
    await handleGenerateResponse(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans antialiased bg-[url('/baseballs.jpg')] bg-contain">
      <header className="backdrop-blur-md bg-primary/75 py-4 shadow-md">
        <div className="px-6 sm:w-3/4 mx-auto">
          <h1 className="text-white text-xl font-medium flex items-center gap-2">
            <PiBaseballHelmetDuotone className="w-6 h-6" />
            Big Leagues Chat
          </h1>
        </div>
      </header>

      <main className="backdrop-blur-md bg-gray-100/75 flex-1 h-full max-w-full sm:w-3/4 mx-auto flex flex-col shadow-xl rounded-lg sm:my-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                {...message}
                isSequential={
                  index > 0 &&
                  messages[index - 1].sender.id === message.sender.id
                }
              />
            ))}
            {isLoading && (
              <ChatMessage
                timestamp={getMockTime()}
                text="Generating response..."
                sender={BOT_SENDER}
                isSequential={
                  messages.length > 0 &&
                  !messages[messages.length - 1].sender.isUser
                }
              />
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSubmit={handleSubmit}
          onAISubmit={handleAISubmit}
          disabled={isLoading}
          placeholder={
            isSimulating
              ? 'Join the conversation...'
              : 'Type your message here...'
          }
        />
      </main>
    </div>
  );
}

export default App;

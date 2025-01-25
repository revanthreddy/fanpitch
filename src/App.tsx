import { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, Participant } from './types';
import { useVertexAI } from './hooks/useVertexAI';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { useChatSimulation } from './hooks/useChatSimulation';

const USER_SENDER: Participant = {
  id: 'user',
  name: 'You',
  avatar: 'U',
  isUser: true,
};

const BOT_SENDER: Participant = {
  id: 'gemini',
  name: 'Gemini',
  avatar: 'G',
  isAI: true,
};

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { initialize, generateResponse } = useVertexAI();

  useEffect(() => {
    initialize().catch(console.error);
  }, [initialize]);

  const { messages: simulatedMessages, isSimulating } = useChatSimulation();

  // Handle simulated messages
  useEffect(() => {
    // FIXME Make this more efficient
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
      const response = await generateResponse(prompt);
      const newMessage: ChatMessageType = {
        id: Math.random().toString(),
        text: response,
        timestamp: Date.now(),
        sender: BOT_SENDER,
      };
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: Math.random().toString(),
        text: `Error: ${(error as Error).message}`,
        timestamp: Date.now(),
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
      timestamp: Date.now(),
      sender: USER_SENDER,
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const handleAISubmit = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessageType = {
      id: Math.random().toString(),
      text,
      timestamp: Date.now(),
      sender: USER_SENDER,
    };
    setMessages((prev) => [...prev, userMessage]);
    await handleGenerateResponse(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans antialiased">
      <header className="bg-primary px-6 py-4 shadow-md">
        <div className="max-w-container mx-auto">
          <h1 className="text-white text-xl font-medium flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14v8l6-4z" />
            </svg>
            MLB Fantasy League Chat
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-container w-full mx-auto flex flex-col bg-white shadow-xl rounded-lg my-4 overflow-hidden">
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
                timestamp={Date.now()}
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

import { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { useVertexAI } from './hooks/useVertexAI';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { initialize, generateResponse, initialMessages } = useVertexAI();

  useEffect(() => {
    initialize().catch(console.error);
  }, [initialize]);

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGenerateResponse = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await generateResponse(prompt);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${(error as Error).message}`, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, isUser: true }]);
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
            Chat with Gemini
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-container w-full mx-auto flex flex-col bg-white shadow-xl rounded-lg my-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                {...message}
                isSequential={
                  index > 0 && messages[index - 1].isUser === message.isUser
                }
              />
            ))}
            {isLoading && (
              <ChatMessage
                text="Generating response..."
                isUser={false}
                isSequential={
                  messages.length > 0 && !messages[messages.length - 1].isUser
                }
              />
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
      </main>
    </div>
  );
}

export default App;

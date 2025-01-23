import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, Conversation } from '../types';
import { mockConversation } from '../mocks/mockConversation';

export function useChatSimulation(
  conversation: Conversation = mockConversation,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const simulateChat = useCallback(() => {
    setIsSimulating(true);
    const now = Date.now();

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setMessages([]);

    // Schedule each message
    conversation.messages.forEach((message) => {
      const delay = message.timestamp - now;
      if (delay > 0) {
        const timeoutId = window.setTimeout(() => {
          setMessages((prev) => {
            // Find the last message's timestamp
            const lastMessageTime =
              prev.length > 0 ? prev[prev.length - 1].timestamp : 0;

            // Only add the message if it's newer than the last message
            // or if it's a user message (which we always want to keep)
            if (message.timestamp > lastMessageTime || message.isUser) {
              return [...prev, message];
            }
            return prev;
          });
        }, delay);
        timeoutsRef.current.push(timeoutId);
      }
    });

    // Schedule end of simulation
    const endTimeoutId = window.setTimeout(() => {
      setIsSimulating(false);
    }, conversation.endTime - now);

    timeoutsRef.current.push(endTimeoutId);
  }, [conversation]);

  useEffect(() => {
    simulateChat();

    return () => {
      // Clean up any remaining timeouts when component unmounts
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      //   setMessages([]);
      //   setIsSimulating(false);
    };
  }, [simulateChat]);

  return {
    messages,
    isSimulating,
  };
}

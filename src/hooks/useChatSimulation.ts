import { useState, useEffect, useRef } from 'react';
import { ChatMessage, Conversation } from '../types';
import { mockConversation } from '../mocks/mockConversation';

export function useChatSimulation(
  conversation: Conversation = mockConversation,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const simulateChat = () => {
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
            if (prev.find((msg) => msg.id === message.id)) return prev;
            return [...prev, message];
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
  };

  useEffect(() => {
    simulateChat();

    return () => {
      // Clean up any remaining timeouts when component unmounts
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      //   setMessages([]);
      //   setIsSimulating(false);
    };
  }, []);

  return {
    messages,
    isSimulating,
  };
}

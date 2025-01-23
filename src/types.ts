export interface Message {
  text: string;
  isUser?: boolean;
  isAI?: boolean;
  isSequential?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatMessage extends Message {
  id: string;
  timestamp: number;
  sender: Participant;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  participants: Participant[];
  startTime: number;
  endTime: number;
}

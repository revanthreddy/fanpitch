export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isUser?: boolean;
  isAI?: boolean;
}

export interface ChatMessage {
  id?: string;
  timestamp: number;
  text: string;
  sender: Participant;
  videoUrls?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  participants: Participant[];
  startTime: number;
  endTime: number;
}

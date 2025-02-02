import { Conversation } from '../types';
import { getMockTime } from '../utils/dateUtils';

const baseTime = getMockTime();
const CONVERSATION_DURATION = 60000; // 1 minute

export const mockConversation: Conversation = {
  id: 'mlb-fantasy-chat-1',
  title: 'MLB Fantasy League Chat',
  startTime: baseTime,
  endTime: baseTime + CONVERSATION_DURATION,
  participants: [
    { id: 'user1', name: 'Mike', avatar: '🎯' },
    { id: 'user2', name: 'Sarah', avatar: '⚾' },
    { id: 'user3', name: 'John', avatar: '🏆' },
    { id: 'user4', name: 'Alex', avatar: '🔥', isUser: true },
    { id: 'user5', name: 'Emma', avatar: '📊' },
  ],
  messages: [
    {
      id: 'pre1',
      text: 'Hey everyone! Just finished setting my fantasy lineup for tomorrow. Had to bench Verlander... tough call 😕',
      sender: { id: 'user2', name: 'Sarah', avatar: '⚾' },
      timestamp: baseTime, // 23:23:37
    },
    {
      id: 'pre2',
      text: "I feel you Sarah. I've got three pitchers on the IL right now. This season has been rough!",
      sender: { id: 'user5', name: 'Emma', avatar: '📊' },
      timestamp: baseTime + 5000, // 23:23:50
    },
    {
      id: 'pre3',
      text: "Anyone want to make a trade? I'm looking to upgrade my outfield situation",
      sender: { id: 'user1', name: 'Mike', avatar: '🎯' },
      timestamp: baseTime + 11000, // 23:24:07
    },
    {
      id: '1',
      text: "Here comes Chris Taylor! Let's see if he can keep the inning alive.",
      sender: { id: 'user3', name: 'John', avatar: '🏆' },
      timestamp: baseTime + 15000, // 23:24:22
    },
    {
      id: '2',
      text: 'Taylor with a sharp single to right! Runners on first and second for Ohtani 👀',
      sender: { id: 'user5', name: 'Emma', avatar: '📊' },
      timestamp: baseTime + 19000, // 23:24:41
    },
    {
      id: '3',
      text: "Ohtani stepping in. He's already 2-for-4 tonight with a double and a single!",
      sender: { id: 'user4', name: 'Alex', avatar: '🔥', isUser: true },
      timestamp: baseTime + 28000, // 23:24:50
    },
    {
      id: '4',
      text: 'OHTANI CRUSHES IT! ABSOLUTE MOONSHOT TO RIGHT CENTER! 3-RUN HOMER! 🚀',
      sender: { id: 'user1', name: 'Mike', avatar: '🎯' },
      timestamp: baseTime + 35000, // 23:24:57
    },
    {
      id: '5',
      text: "That's his 51st of the year! The Dodgers dugout is going crazy! 🔥",
      sender: { id: 'user3', name: 'John', avatar: '🏆' },
      timestamp: baseTime + 43000, // 23:25:05
    },
    {
      id: '6',
      text: 'What a moment! Muncy and Taylor score ahead of him. This game is getting out of hand!',
      sender: { id: 'user2', name: 'Sarah', avatar: '⚾' },
      timestamp: baseTime + 53000, // 23:25:15
    },
  ],
};

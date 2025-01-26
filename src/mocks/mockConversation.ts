import { Conversation } from '../types';

const now = Date.now();
const START_DELAY = 3000; // 3 seconds
const CONVERSATION_DURATION = 30000; // 30 seconds

export const mockConversation: Conversation = {
  id: 'mlb-fantasy-chat-1',
  title: 'MLB Fantasy League Chat',
  startTime: now + START_DELAY,
  endTime: now + START_DELAY + CONVERSATION_DURATION,
  participants: [
    { id: 'user1', name: 'Mike', avatar: '🎯' },
    { id: 'user2', name: 'Sarah', avatar: '⚾' },
    { id: 'user3', name: 'John', avatar: '🏆' },
    { id: 'user4', name: 'Alex', avatar: '🔥', isUser: true },
    { id: 'user5', name: 'BOT', avatar: '🤖', isAI: true },
  ],
  messages: [
    {
      id: '1',
      text: "Can't believe what Judge just did! That's his second homer of the night! 🔥",
      sender: { id: 'user1', name: 'Mike', avatar: '🎯' },
      timestamp: now + START_DELAY + 0,
    },
    {
      id: '2',
      text: "I'm so glad I drafted him first round. He's on fire tonight!",
      sender: { id: 'user2', name: 'Sarah', avatar: '⚾' },
      timestamp: now + START_DELAY + 3000,
    },
    {
      id: '3',
      text: "Yeah, but my Ohtani's pitching a gem too. 8 Ks through 5!",
      sender: { id: 'user3', name: 'John', avatar: '🏆' },
      timestamp: now + START_DELAY + 7000,
    },
    {
      id: '4',
      text: "Guys, Cole's dealing too. This Yankees-Angels game is insane!",
      sender: { id: 'user4', name: 'Alex', avatar: '🔥', isUser: true },
      timestamp: now + START_DELAY + 10000,
    },
    {
      id: '5',
      text: "Hold up - Trout's coming up with bases loaded 👀",
      sender: { id: 'user1', name: 'Mike', avatar: '🎯' },
      timestamp: now + START_DELAY + 15000,
    },
    {
      id: '6',
      text: 'Did you know that Trout is the only player in MLB history to have 300+ HRs, 300+ SB, and 300+ SB in the same season? 🤯',
      sender: { id: 'user5', name: 'BOT', avatar: '🤖', isAI: true },
      timestamp: now + START_DELAY + 18000,
    },
    {
      id: '7',
      text: "My week depends on this at-bat! I'm only up by 2 points 😰",
      sender: { id: 'user2', name: 'Sarah', avatar: '⚾' },
      timestamp: now + START_DELAY + 21000,
    },
    {
      id: '8',
      text: 'GRAND SLAM! TROUT YOU BEAUTIFUL MAN! 🎉',
      sender: { id: 'user3', name: 'John', avatar: '🏆' },
      timestamp: now + START_DELAY + 24000,
    },
    {
      id: '9',
      text: 'Well, there goes my pitching stats for the week 😭',
      sender: { id: 'user4', name: 'Alex', avatar: '🔥', isUser: true },
      timestamp: now + START_DELAY + 27000,
    },
    {
      id: '10',
      text: "Ohtani's pitching stats are: 1-0, 0.00 ERA, 10 Ks, 0 BBs, 0 HRs, 0.00 WHIP, 0.00 FIP, 0.00 xFIP, 0.00 K/BB, 0.00 K/9, 0.00 BB/9, 0.00 HR/9, 0.00 H/9, 0.00 HR/FB, 0.00 K/FB, 0.00 K%",
      sender: { id: 'user5', name: 'BOT', avatar: '🤖', isAI: true },
      timestamp: now + START_DELAY + 30000,
    },
    {
      id: '11',
      text: "That's baseball for ya! Anyone watching the Dodgers game? Betts is heating up 👀",
      sender: { id: 'user1', name: 'Mike', avatar: '🎯' },
      timestamp: now + START_DELAY + 33000,
    },
  ],
};

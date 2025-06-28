// Mock data for Natalie and other users
export interface UserPost {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  audioUrl: string;
  duration: number;
  voiceStyle: string;
  likes: number;
  replies: number;
  timestamp: string;
  isLiked: boolean;
  tags: string[];
  content: string; // Text content for search
  createdAt: Date;
}

export const nataliesPosts: UserPost[] = [
  {
    id: 'natalie_1',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 42,
    voiceStyle: 'Warm Morning Voice',
    likes: 234,
    replies: 45,
    timestamp: '2h',
    isLiked: false,
    tags: ['morning', 'coffee', 'thoughts', 'gratitude'],
    content: 'Good morning everyone! Just had my first cup of coffee and I\'m feeling so grateful for this beautiful day. There\'s something magical about morning light streaming through the windows.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'natalie_2',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 38,
    voiceStyle: 'Thoughtful Narrator',
    likes: 189,
    replies: 32,
    timestamp: '4h',
    isLiked: true,
    tags: ['productivity', 'mindfulness', 'work'],
    content: 'I\'ve been thinking about how we measure productivity. Is it really about how much we get done, or is it about how present we are in each moment? Today I\'m choosing presence over pressure.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: 'natalie_3',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 51,
    voiceStyle: 'Cozy Storyteller',
    likes: 312,
    replies: 67,
    timestamp: '6h',
    isLiked: false,
    tags: ['coffee', 'ritual', 'slowliving', 'morning'],
    content: 'My coffee ritual has become sacred to me. It\'s not just about the caffeine - it\'s about those five minutes of stillness before the world demands my attention. What rituals ground you?',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: 'natalie_4',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 29,
    voiceStyle: 'Gentle Wisdom',
    likes: 156,
    replies: 28,
    timestamp: '8h',
    isLiked: false,
    tags: ['reflection', 'growth', 'journey'],
    content: 'Sometimes the best conversations happen with yourself. I spent some time journaling this morning and realized how much I\'ve grown in the past year. Growth isn\'t always loud.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: 'natalie_5',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 35,
    voiceStyle: 'Inspiring Guide',
    likes: 278,
    replies: 41,
    timestamp: '10h',
    isLiked: true,
    tags: ['motivation', 'dreams', 'courage'],
    content: 'I used to think courage meant not being afraid. Now I know it means being afraid and doing it anyway. What\'s one thing you\'ve been afraid to try? Maybe today is the day.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
  },
];

export const allUsers = [
  {
    username: 'natalie',
    displayName: 'Natalie Chen',
    posts: nataliesPosts,
  },
  // Add more users as needed
];

export function getUserPosts(username: string): UserPost[] {
  const user = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
  return user ? user.posts : [];
}

export function searchUserPosts(username: string, topic: string): UserPost[] {
  const userPosts = getUserPosts(username);
  return userPosts.filter(post => 
    post.content.toLowerCase().includes(topic.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
  );
}

export function getTodaysPosts(username: string): UserPost[] {
  const userPosts = getUserPosts(username);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return userPosts.filter(post => post.createdAt >= today);
}
// Local placeholder database for all posts
export interface Post {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  audioUrl: string;
  duration: number; // Always under 60 seconds
  voiceStyle: string;
  replies: number;
  timestamp: string;
  tags: string[]; // Maximum 3 tags per post
  content: string;
  createdAt: Date;
  hasReplies?: boolean;
  replyPosts?: Post[];
  listenCount?: number; // New field for simulated listen counts
}

// Consistent EchoHQ avatar across all posts - matching profile name
const ECHOHQ_AVATAR = 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';

// Function to generate realistic listen counts based on post characteristics
function generateListenCount(post: Partial<Post>): number {
  let baseCount = 0;
  
  // Base count based on replies (listen count should be higher than replies)
  if (post.replies) {
    baseCount = Math.floor(post.replies * (8 + Math.random() * 4)); // 8x to 12x replies
  }
  
  // Boost for popular creators
  if (post.username === '@elonmusk') {
    baseCount = Math.floor(baseCount * 3.2); // Elon gets massive engagement
  } else if (post.username === '@encode_club') {
    baseCount = Math.floor(baseCount * 2.1); // Tech content gets good engagement
  } else if (post.username === '@wisdom_voice') {
    baseCount = Math.floor(baseCount * 1.8); // Wisdom content performs well
  }
  
  // Boost for certain tags
  if (post.tags?.includes('comedy')) {
    baseCount = Math.floor(baseCount * 1.4); // Comedy gets more listens
  }
  if (post.tags?.includes('confession')) {
    baseCount = Math.floor(baseCount * 1.3); // Confessions are engaging
  }
  if (post.tags?.includes('motivation')) {
    baseCount = Math.floor(baseCount * 1.2); // Motivational content performs well
  }
  
  // Add some randomness to make it feel natural
  const variance = 0.3; // 30% variance
  const randomMultiplier = 1 + (Math.random() - 0.5) * variance;
  baseCount = Math.floor(baseCount * randomMultiplier);
  
  // Ensure minimum count and realistic numbers
  return Math.max(baseCount, Math.floor(Math.random() * 50) + 10);
}

// Centralized post database - all posts 5-10 seconds with max 3 tags and simulated listen counts
export const postsDatabase: Post[] = [
  {
    id: 'post_1',
    username: '@alex_voice',
    displayName: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 8,
    voiceStyle: 'Chill Narrator',
    replies: 25,
    timestamp: '2h',
    tags: ['deepthoughts', 'philosophy', 'mindfulness'],
    content: 'Just had the most incredible conversation with a stranger at the coffee shop. Sometimes the best connections happen when you least expect them. We talked about everything from philosophy to our favorite books, and I left feeling so inspired.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasReplies: false,
    listenCount: 487,
  },
  {
    id: 'post_2',
    username: '@sarah_speaks',
    displayName: 'Sarah Kim',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 10,
    voiceStyle: 'Energetic Host',
    replies: 14,
    timestamp: '4h',
    tags: ['motivation', 'energy', 'morning'],
    content: 'Morning motivation: Your energy introduces you before you even speak. Today I\'m choosing to radiate positivity and see how it transforms not just my day, but the days of everyone I encounter.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    hasReplies: false,
    listenCount: 312,
  },
  {
    id: 'post_3',
    username: '@mike_audio',
    displayName: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 9,
    voiceStyle: 'Wise Storyteller',
    replies: 47,
    timestamp: '6h',
    tags: ['confession', 'anonymous', 'secrets'],
    content: 'I have a confession to make. For years, I\'ve been afraid to share my real thoughts, hiding behind what I thought people wanted to hear. But authenticity is magnetic, and I\'m done pretending to be anyone other than myself.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    listenCount: 834,
  },
  {
    id: 'post_4',
    username: '@radiowave',
    displayName: 'RadioWave',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 7,
    voiceStyle: 'Peppy Radio Host',
    replies: 31,
    timestamp: '8h',
    tags: ['motivation', 'energy', 'morning'],
    content: 'Good morning beautiful souls! Remember that every sunrise is a new opportunity to become the person you\'ve always wanted to be. Let\'s make today absolutely incredible!',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    listenCount: 623,
  },
  {
    id: 'post_5',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 8,
    voiceStyle: 'Warm Morning Voice',
    replies: 45,
    timestamp: '1h',
    tags: ['morning', 'coffee', 'gratitude'],
    content: 'Good morning everyone! Just had my first cup of coffee and I\'m feeling so grateful for this beautiful day. There\'s something magical about morning light streaming through the windows.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    listenCount: 756,
  },
  {
    id: 'post_6',
    username: '@encode_club',
    displayName: 'Encode Club',
    avatar: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 9,
    voiceStyle: 'Tech Educator',
    replies: 89,
    timestamp: '3h',
    tags: ['coding', 'education', 'web3'],
    content: 'Today we\'re diving deep into smart contract security. Remember, in Web3, your code is your contract with the world. Every line matters, every function call is a promise. Let\'s build the future responsibly.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    listenCount: 2847,
  },
  {
    id: 'post_7',
    username: '@midnight_thinker',
    displayName: 'MidnightThinker',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 10,
    voiceStyle: 'Deep Narrator Voice',
    replies: 134,
    timestamp: '2h',
    tags: ['deepthoughts', 'philosophy', 'existence'],
    content: 'What if consciousness is just the universe trying to understand itself through our eyes? Every thought we have is a cosmic conversation.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    listenCount: 3247,
  },
  {
    id: 'post_8',
    username: '@wisdom_voice',
    displayName: 'Wisdom Voice',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 9,
    voiceStyle: 'Sage Storyteller',
    replies: 234,
    timestamp: '5h',
    tags: ['wisdom', 'life', 'growth'],
    content: 'Life has taught me that wisdom isn\'t about having all the answers—it\'s about asking better questions. Today I want to share three questions that completely changed how I see the world and my place in it.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    listenCount: 8934,
  },
  {
    id: 'post_9',
    username: '@energy_boost',
    displayName: 'Energy Boost',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 7,
    voiceStyle: 'Energetic Coach',
    replies: 156,
    timestamp: '7h',
    tags: ['motivation', 'energy', 'success'],
    content: 'Your Monday morning energy sets the tone for your entire week! I\'m sharing my 5-minute ritual that transforms how I show up every single day. It\'s simple, powerful, and will change everything.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    listenCount: 6789,
  },
  {
    id: 'post_10',
    username: '@heartbreak_healer',
    displayName: 'Heartbreak Healer',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 8,
    voiceStyle: 'Gentle Counselor',
    replies: 289,
    timestamp: '9h',
    tags: ['breakups', 'healing', 'selflove'],
    content: 'Six months ago, I thought my world was ending. Today, I\'m grateful for that heartbreak because it led me to the most important relationship of my life—the one with myself. Here\'s what I learned.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
    listenCount: 12456,
  },
  {
    id: 'elon_confession',
    username: '@elonmusk',
    displayName: 'Elon Musk',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 10,
    voiceStyle: 'Dramatic Reader',
    replies: 2341,
    timestamp: '3h',
    tags: ['confession', 'truth', 'leadership'],
    content: 'I need to confess something that\'s been weighing on me. Despite all the success, the rockets, the companies... I still feel like that awkward kid who just wanted to build cool things. Sometimes I wonder if I\'m just really good at pretending to know what I\'m doing. The truth is, every major decision terrifies me, but I\'ve learned that courage isn\'t the absence of fear—it\'s acting despite it.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    listenCount: 127834,
  },
  {
    id: 'post_11',
    username: '@the_confessor',
    displayName: 'TheConfessor',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 6,
    voiceStyle: 'Whisper',
    replies: 67,
    timestamp: '3h',
    tags: ['confession', 'secrets', 'truth'],
    content: 'I\'ve been pretending to be confident for so long that I forgot what my real voice sounds like. This is me, unfiltered.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    listenCount: 1567,
  },
  // Comedy posts - new tag added
  {
    id: 'comedy_1',
    username: '@funny_voice',
    displayName: 'Comedy Central',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 8,
    voiceStyle: 'Stand-up Comedian',
    replies: 234,
    timestamp: '1h',
    tags: ['comedy', 'humor', 'standup'],
    content: 'So I went to the gym yesterday... just kidding, I drove past it and felt really good about myself. That counts as exercise, right? My car definitely got a workout!',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    listenCount: 5234,
  },
  {
    id: 'comedy_2',
    username: '@laugh_track',
    displayName: 'Laugh Track',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 9,
    voiceStyle: 'Impressionist',
    replies: 345,
    timestamp: '3h',
    tags: ['comedy', 'impressions', 'entertainment'],
    content: 'My impression of my phone battery at 2%: *dramatic whisper* "I don\'t feel so good..." *dies*. Why do phones have more dramatic death scenes than most movies?',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    listenCount: 7892,
  },
  {
    id: 'comedy_3',
    username: '@dad_jokes_daily',
    displayName: 'Dad Jokes Daily',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 6,
    voiceStyle: 'Dad Voice',
    replies: 156,
    timestamp: '5h',
    tags: ['comedy', 'dadjokes', 'family'],
    content: 'Why don\'t scientists trust atoms? Because they make up everything! *ba dum tss* I\'ll see myself out... but first, did you hear about the mathematician who\'s afraid of negative numbers?',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    listenCount: 3456,
  },
  // EchoHQ posts - consistent avatar across all posts matching profile name
  {
    id: 'echohq_1',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 7,
    voiceStyle: 'Original',
    replies: 15,
    timestamp: '30m',
    tags: ['authentic', 'voice', 'original'],
    content: 'Testing out my authentic voice for the first time. No filters, no effects, just me sharing what\'s on my mind. There\'s something powerful about speaking your truth in your own voice.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    listenCount: 267,
  },
  {
    id: 'echohq_2',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 9,
    voiceStyle: 'Thoughtful Narrator',
    replies: 28,
    timestamp: '2h',
    tags: ['reflection', 'growth', 'journey'],
    content: 'Been reflecting on how much this platform has changed the way I communicate. Voice has this incredible ability to convey emotion and nuance that text just can\'t capture. Every echo tells a story.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    listenCount: 445,
  },
  {
    id: 'echohq_3',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 8,
    voiceStyle: 'Inspiring Guide',
    replies: 42,
    timestamp: '4h',
    tags: ['community', 'connection', 'voices'],
    content: 'What amazes me most about this community is how diverse voices come together to create something beautiful. Each person brings their unique perspective, their own way of seeing the world.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    listenCount: 678,
  },
  {
    id: 'echohq_4',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 6,
    voiceStyle: 'Original',
    replies: 31,
    timestamp: '6h',
    tags: ['gratitude', 'community', 'authentic'],
    content: 'Grateful for everyone who listens and shares their own stories. This is what authentic connection looks like in the digital age.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    listenCount: 523,
  },
  {
    id: 'echohq_5',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 10,
    voiceStyle: 'Warm Storyteller',
    replies: 56,
    timestamp: '8h',
    tags: ['storytelling', 'memories', 'voice'],
    content: 'There\'s something magical about hearing someone\'s voice tell a story. It\'s not just the words—it\'s the pauses, the emphasis, the emotion behind each syllable. That\'s the power of voice.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    listenCount: 892,
  },
];

// Apply generated listen counts to posts that don't have them
postsDatabase.forEach(post => {
  if (post.listenCount === undefined) {
    post.listenCount = generateListenCount(post);
  }
});

// Helper functions to get posts for different views
export function getForYouPosts(): Post[] {
  return postsDatabase.filter(post => 
    ['post_1', 'post_2', 'post_3', 'post_4'].includes(post.id)
  );
}

export function getFriendsPosts(): Post[] {
  return postsDatabase.filter(post => 
    ['post_5', 'post_6'].includes(post.id)
  );
}

export function getFeaturedPosts(): Post[] {
  return postsDatabase.filter(post => 
    ['elon_confession', 'post_8', 'post_9', 'post_10'].includes(post.id)
  );
}

export function getUserPosts(username: string): Post[] {
  return postsDatabase.filter(post => 
    post.username.toLowerCase().includes(username.toLowerCase())
  );
}

export function getEchoHQPosts(): Post[] {
  return postsDatabase.filter(post => 
    post.username === '@EchoHQ'
  );
}

export function getPostById(id: string): Post | undefined {
  return postsDatabase.find(post => post.id === id);
}

export function searchPosts(query: string): Post[] {
  const lowerQuery = query.toLowerCase();
  return postsDatabase.filter(post =>
    post.content.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    post.displayName.toLowerCase().includes(lowerQuery) ||
    post.username.toLowerCase().includes(lowerQuery)
  );
}

export function getPostsByTag(tag: string): Post[] {
  return postsDatabase.filter(post =>
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

export function getTrendingPosts(): Post[] {
  return postsDatabase
    .sort((a, b) => (b.listenCount || 0) - (a.listenCount || 0))
    .slice(0, 10);
}

export function getComedyPosts(): Post[] {
  return postsDatabase.filter(post =>
    post.tags.includes('comedy')
  );
}
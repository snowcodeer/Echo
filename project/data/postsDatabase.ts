// Local placeholder database for all posts
export interface Post {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  audioUrl: string;
  duration: number; // Always under 60 seconds
  voiceStyle: string;
  likes: number;
  replies: number;
  timestamp: string;
  isLiked: boolean;
  tags: string[]; // Maximum 3 tags per post
  content: string;
  createdAt: Date;
  hasReplies?: boolean;
  replyPosts?: Post[];
}

// Consistent EchoHQ avatar across all posts - matching profile name
const ECHOHQ_AVATAR = 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';

// Reply posts for the top two posts in For You feed
const post1Replies: Post[] = [
  {
    id: 'reply_1_1',
    username: '@sarah_speaks',
    displayName: 'Sarah Kim',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 22,
    voiceStyle: 'Warm Response',
    likes: 45,
    replies: 0,
    timestamp: '1h',
    isLiked: false,
    tags: ['response', 'connection'],
    content: 'This is so true! I had a similar experience last week at a bookstore. Sometimes the universe puts exactly the right person in your path when you need them most.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'reply_1_2',
    username: '@wisdom_voice',
    displayName: 'Wisdom Voice',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 28,
    voiceStyle: 'Thoughtful Reflection',
    likes: 67,
    replies: 0,
    timestamp: '45m',
    isLiked: false,
    tags: ['wisdom', 'serendipity'],
    content: 'Beautiful reminder that meaningful connections often happen in the most unexpected places. These chance encounters teach us to stay open and present in every moment.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
];

const post2Replies: Post[] = [
  {
    id: 'reply_2_1',
    username: '@energy_boost',
    displayName: 'Energy Boost',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 19,
    voiceStyle: 'Enthusiastic Agreement',
    likes: 32,
    replies: 0,
    timestamp: '3h',
    isLiked: false,
    tags: ['energy', 'positivity'],
    content: 'YES! Energy is everything! I love how you put this - it really is about choosing your vibe and watching it ripple out into the world.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'reply_2_2',
    username: '@midnight_thinker',
    displayName: 'MidnightThinker',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 31,
    voiceStyle: 'Deep Contemplation',
    likes: 58,
    replies: 0,
    timestamp: '2h',
    isLiked: false,
    tags: ['reflection', 'impact'],
    content: 'This makes me think about how we\'re all walking around broadcasting our internal state. What a responsibility and opportunity that is - to be intentional about the energy we share.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

// Centralized post database - all posts under 60 seconds with max 3 tags
export const postsDatabase: Post[] = [
  {
    id: 'post_1',
    username: '@alex_voice',
    displayName: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 28,
    voiceStyle: 'Chill Narrator',
    likes: 142,
    replies: 25, // Updated to include reply posts
    timestamp: '2h',
    isLiked: false,
    tags: ['deepthoughts', 'philosophy', 'mindfulness'],
    content: 'Just had the most incredible conversation with a stranger at the coffee shop. Sometimes the best connections happen when you least expect them. We talked about everything from philosophy to our favorite books, and I left feeling so inspired.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasReplies: true,
    replyPosts: post1Replies,
  },
  {
    id: 'post_2',
    username: '@sarah_speaks',
    displayName: 'Sarah Kim',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 45,
    voiceStyle: 'Energetic Host',
    likes: 89,
    replies: 14, // Updated to include reply posts
    timestamp: '4h',
    isLiked: true,
    tags: ['motivation', 'energy', 'morning'],
    content: 'Morning motivation: Your energy introduces you before you even speak. Today I\'m choosing to radiate positivity and see how it transforms not just my day, but the days of everyone I encounter.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    hasReplies: true,
    replyPosts: post2Replies,
  },
  {
    id: 'post_3',
    username: '@mike_audio',
    displayName: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 52,
    voiceStyle: 'Wise Storyteller',
    likes: 256,
    replies: 47,
    timestamp: '6h',
    isLiked: false,
    tags: ['confession', 'anonymous', 'secrets'],
    content: 'I have a confession to make. For years, I\'ve been afraid to share my real thoughts, hiding behind what I thought people wanted to hear. But authenticity is magnetic, and I\'m done pretending to be anyone other than myself.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'post_4',
    username: '@radiowave',
    displayName: 'RadioWave',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 38,
    voiceStyle: 'Peppy Radio Host',
    likes: 178,
    replies: 31,
    timestamp: '8h',
    isLiked: false,
    tags: ['motivation', 'energy', 'morning'],
    content: 'Good morning beautiful souls! Remember that every sunrise is a new opportunity to become the person you\'ve always wanted to be. Let\'s make today absolutely incredible!',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 'post_5',
    username: '@natalie_morning',
    displayName: 'Natalie Chen',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 42,
    voiceStyle: 'Warm Morning Voice',
    likes: 234,
    replies: 45,
    timestamp: '1h',
    isLiked: false,
    tags: ['morning', 'coffee', 'gratitude'],
    content: 'Good morning everyone! Just had my first cup of coffee and I\'m feeling so grateful for this beautiful day. There\'s something magical about morning light streaming through the windows.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'post_6',
    username: '@encode_club',
    displayName: 'Encode Club',
    avatar: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 35,
    voiceStyle: 'Tech Educator',
    likes: 567,
    replies: 89,
    timestamp: '3h',
    isLiked: true,
    tags: ['coding', 'education', 'web3'],
    content: 'Today we\'re diving deep into smart contract security. Remember, in Web3, your code is your contract with the world. Every line matters, every function call is a promise. Let\'s build the future responsibly.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'post_7',
    username: '@midnight_thinker',
    displayName: 'MidnightThinker',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 45,
    voiceStyle: 'Deep Narrator Voice',
    likes: 892,
    replies: 134,
    timestamp: '2h',
    tags: ['deepthoughts', 'philosophy', 'existence'],
    content: 'What if consciousness is just the universe trying to understand itself through our eyes? Every thought we have is a cosmic conversation.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'post_8',
    username: '@wisdom_voice',
    displayName: 'Wisdom Voice',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 42,
    voiceStyle: 'Sage Storyteller',
    likes: 2847,
    replies: 234,
    timestamp: '5h',
    tags: ['wisdom', 'life', 'growth'],
    content: 'Life has taught me that wisdom isn\'t about having all the answers—it\'s about asking better questions. Today I want to share three questions that completely changed how I see the world and my place in it.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'post_9',
    username: '@energy_boost',
    displayName: 'Energy Boost',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 28,
    voiceStyle: 'Energetic Coach',
    likes: 1923,
    replies: 156,
    timestamp: '7h',
    tags: ['motivation', 'energy', 'success'],
    content: 'Your Monday morning energy sets the tone for your entire week! I\'m sharing my 5-minute ritual that transforms how I show up every single day. It\'s simple, powerful, and will change everything.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
  },
  {
    id: 'post_10',
    username: '@heartbreak_healer',
    displayName: 'Heartbreak Healer',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 35,
    voiceStyle: 'Gentle Counselor',
    likes: 3156,
    replies: 289,
    timestamp: '9h',
    tags: ['breakups', 'healing', 'selflove'],
    content: 'Six months ago, I thought my world was ending. Today, I\'m grateful for that heartbreak because it led me to the most important relationship of my life—the one with myself. Here\'s what I learned.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
  },
  {
    id: 'elon_confession',
    username: '@elonmusk',
    displayName: 'Elon Musk',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 57,
    voiceStyle: 'Dramatic Reader',
    likes: 15847,
    replies: 2341,
    timestamp: '3h',
    tags: ['confession', 'truth', 'leadership'],
    content: 'I need to confess something that\'s been weighing on me. Despite all the success, the rockets, the companies... I still feel like that awkward kid who just wanted to build cool things. Sometimes I wonder if I\'m just really good at pretending to know what I\'m doing. The truth is, every major decision terrifies me, but I\'ve learned that courage isn\'t the absence of fear—it\'s acting despite it.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'post_11',
    username: '@the_confessor',
    displayName: 'TheConfessor',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 29,
    voiceStyle: 'Whisper',
    likes: 445,
    replies: 67,
    timestamp: '3h',
    tags: ['confession', 'secrets', 'truth'],
    content: 'I\'ve been pretending to be confident for so long that I forgot what my real voice sounds like. This is me, unfiltered.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  // Comedy posts - new tag added
  {
    id: 'comedy_1',
    username: '@funny_voice',
    displayName: 'Comedy Central',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 34,
    voiceStyle: 'Stand-up Comedian',
    likes: 1567,
    replies: 234,
    timestamp: '1h',
    tags: ['comedy', 'humor', 'standup'],
    content: 'So I went to the gym yesterday... just kidding, I drove past it and felt really good about myself. That counts as exercise, right? My car definitely got a workout!',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'comedy_2',
    username: '@laugh_track',
    displayName: 'Laugh Track',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 41,
    voiceStyle: 'Impressionist',
    likes: 2134,
    replies: 345,
    timestamp: '3h',
    tags: ['comedy', 'impressions', 'entertainment'],
    content: 'My impression of my phone battery at 2%: *dramatic whisper* "I don\'t feel so good..." *dies*. Why do phones have more dramatic death scenes than most movies?',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'comedy_3',
    username: '@dad_jokes_daily',
    displayName: 'Dad Jokes Daily',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    duration: 23,
    voiceStyle: 'Dad Voice',
    likes: 892,
    replies: 156,
    timestamp: '5h',
    tags: ['comedy', 'dadjokes', 'family'],
    content: 'Why don\'t scientists trust atoms? Because they make up everything! *ba dum tss* I\'ll see myself out... but first, did you hear about the mathematician who\'s afraid of negative numbers?',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  // EchoHQ posts - consistent avatar across all posts matching profile name
  {
    id: 'echohq_1',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 33,
    voiceStyle: 'Original',
    likes: 89,
    replies: 15,
    timestamp: '30m',
    tags: ['authentic', 'voice', 'original'],
    content: 'Testing out my authentic voice for the first time. No filters, no effects, just me sharing what\'s on my mind. There\'s something powerful about speaking your truth in your own voice.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'echohq_2',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 41,
    voiceStyle: 'Thoughtful Narrator',
    likes: 156,
    replies: 28,
    timestamp: '2h',
    tags: ['reflection', 'growth', 'journey'],
    content: 'Been reflecting on how much this platform has changed the way I communicate. Voice has this incredible ability to convey emotion and nuance that text just can\'t capture. Every echo tells a story.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'echohq_3',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 38,
    voiceStyle: 'Inspiring Guide',
    likes: 234,
    replies: 42,
    timestamp: '4h',
    tags: ['community', 'connection', 'voices'],
    content: 'What amazes me most about this community is how diverse voices come together to create something beautiful. Each person brings their unique perspective, their own way of seeing the world.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'echohq_4',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 29,
    voiceStyle: 'Original',
    likes: 178,
    replies: 31,
    timestamp: '6h',
    tags: ['gratitude', 'community', 'authentic'],
    content: 'Grateful for everyone who listens and shares their own stories. This is what authentic connection looks like in the digital age.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'echohq_5',
    username: '@EchoHQ',
    displayName: 'EchoHQ',
    avatar: ECHOHQ_AVATAR,
    duration: 44,
    voiceStyle: 'Warm Storyteller',
    likes: 312,
    replies: 56,
    timestamp: '8h',
    tags: ['storytelling', 'memories', 'voice'],
    content: 'There\'s something magical about hearing someone\'s voice tell a story. It\'s not just the words—it\'s the pauses, the emphasis, the emotion behind each syllable. That\'s the power of voice.',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    isLiked: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  // Add reply posts to the database
  ...post1Replies,
  ...post2Replies,
];

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
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);
}

export function getComedyPosts(): Post[] {
  return postsDatabase.filter(post =>
    post.tags.includes('comedy')
  );
}
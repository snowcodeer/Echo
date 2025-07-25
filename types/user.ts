export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: Date;
  isVerified: boolean;
  isOwner: boolean;
  followerCount: number;
  followingCount: number;
  echoCount: number;
  location?: string;
  website?: string;
  birthDate?: Date;
  preferences: {
    isPrivate: boolean;
    allowDirectMessages: boolean;
    showEmail: boolean;
    showBirthDate: boolean;
  };
}

export interface UserActivity {
  savedEchoes: UserEcho[];
  downloads: UserDownload[];
  userEchoes: UserEcho[];
  friends: UserFriend[];
}

export interface UserEcho {
  id: string;
  content: string;
  audioUrl?: string;
  duration?: number;
  voiceStyle: string;
  replies: number;
  createdAt: Date;
  tags: string[];
  isPublic: boolean;
  listenCount?: number;
  likes?: number;
  isLiked?: boolean;
}

export interface UserDownload {
  id: string;
  echoId: string;
  title: string;
  format: 'mp3' | 'wav' | 'aac';
  size: number; // in bytes
  downloadedAt: Date;
  expiresAt?: Date;
}

export interface UserFriend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  mutualFriends: number;
  friendshipDate: Date;
}

export interface EditProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  preferences: UserProfile['preferences'];
}

// API Post interface to match backend response
export interface ApiPost {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  audio_url: string;
  duration: number;
  voice_style: string;
  likes: number;
  timestamp: string;
  is_liked: boolean;
  tags: string[];
  content: string;
  created_at: string;
  listen_count: number;
}
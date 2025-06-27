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
  likedEchoes: UserEcho[];
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
  likes: number;
  replies: number;
  createdAt: Date;
  tags: string[];
  isPublic: boolean;
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
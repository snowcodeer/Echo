import { useState, useEffect } from 'react';
import { UserActivity, UserEcho, UserDownload, UserFriend, ApiPost } from '@/types/user';
import { getEchoHQPosts } from '@/data/postsDatabase';
import { useSave } from '@/contexts/SaveContext';
import { fetchUserPosts } from '@/utils/api';

// Mock data generators
const generateMockDownloads = (): UserDownload[] => [
  {
    id: 'dl_1',
    echoId: 'post_1',
    title: 'Coffee Shop Philosophy',
    format: 'mp3',
    size: 2048576, // 2MB
    downloadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'dl_2',
    echoId: 'post_2',
    title: 'Morning Energy Boost',
    format: 'wav',
    size: 4194304, // 4MB
    downloadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'dl_3',
    echoId: 'elon_confession',
    title: 'Elon\'s Vulnerability',
    format: 'aac',
    size: 1572864, // 1.5MB
    downloadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
];

const generateMockFriends = (): UserFriend[] => [
  {
    id: 'friend_1',
    username: '@alex_voice',
    displayName: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
    mutualFriends: 12,
    friendshipDate: new Date('2024-02-10'),
  },
  {
    id: 'friend_2',
    username: '@sarah_speaks',
    displayName: 'Sarah Kim',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    mutualFriends: 8,
    friendshipDate: new Date('2024-01-25'),
  },
  {
    id: 'friend_3',
    username: '@mike_audio',
    displayName: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
    mutualFriends: 15,
    friendshipDate: new Date('2024-03-05'),
  },
];

// Convert API post to UserEcho format
const convertApiPostToUserEcho = (apiPost: ApiPost): UserEcho => ({
  id: apiPost.id,
  content: apiPost.content,
  audioUrl: apiPost.audio_url,
  duration: apiPost.duration,
  voiceStyle: apiPost.voice_style,
  replies: 0, // API doesn't provide replies count in this endpoint
  createdAt: new Date(apiPost.created_at),
  tags: apiPost.tags,
  isPublic: true,
  listenCount: apiPost.listen_count,
  likes: apiPost.likes,
  isLiked: apiPost.is_liked,
});

export function useUserActivity() {
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { savedPosts } = useSave();

  const loadUserPosts = async () => {
    try {
      console.log('🔄 Loading user posts from API...');
      
      // Fetch user posts from API
      const userPostsResult = await fetchUserPosts(0, 50); // Fetch up to 50 posts
      let userEchoes: UserEcho[] = [];
      
      if (userPostsResult.success && userPostsResult.data) {
        // Convert API posts to UserEcho format
        userEchoes = userPostsResult.data.map(convertApiPostToUserEcho);
        console.log('✅ Successfully converted API posts to UserEchoes:', userEchoes.length);
        console.log('📋 First post preview:', userEchoes[0] ? {
          id: userEchoes[0].id,
          content: userEchoes[0].content.substring(0, 50) + '...',
          listenCount: userEchoes[0].listenCount,
          likes: userEchoes[0].likes
        } : 'No posts');
      } else {
        console.warn('⚠️ Failed to fetch user posts from API:', userPostsResult.error);
        // Fallback to hardcoded EchoHQ posts if API fails
        const echoHQPosts = getEchoHQPosts();
        userEchoes = echoHQPosts.map(post => ({
          id: post.id,
          content: post.content,
          audioUrl: post.audioUrl,
          duration: post.duration,
          voiceStyle: post.voiceStyle,
          replies: post.replies,
          createdAt: post.createdAt,
          tags: post.tags,
          isPublic: true,
          listenCount: post.listenCount,
        }));
        console.log('📦 Using fallback EchoHQ posts:', userEchoes.length);
      }

      return userEchoes;
    } catch (err) {
      console.error('❌ Error loading user posts:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load user posts
        const userEchoes = await loadUserPosts();

        // Convert saved posts to UserEcho format
        const savedEchoes: UserEcho[] = savedPosts.map(post => ({
          id: post.id,
          content: post.content,
          audioUrl: post.audioUrl,
          duration: post.duration,
          voiceStyle: post.voiceStyle || 'Original',
          replies: post.replies,
          createdAt: post.createdAt,
          tags: post.tags,
          isPublic: true,
        }));

        setActivity({
          savedEchoes,
          downloads: generateMockDownloads(),
          userEchoes,
          friends: generateMockFriends(),
        });

        console.log('🎉 Activity loaded successfully with', userEchoes.length, 'user echoes');
      } catch (err) {
        console.error('❌ Error loading user activity:', err);
        setError('Failed to load user activity');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [savedPosts]);

  const removeDownload = async (downloadId: string) => {
    if (!activity) return;
    
    setActivity(prev => prev ? {
      ...prev,
      downloads: prev.downloads.filter(d => d.id !== downloadId)
    } : null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  const refreshUserPosts = async () => {
    try {
      console.log('🔄 Refreshing user posts...');
      setLoading(true);
      
      const userEchoes = await loadUserPosts();
      
      if (activity) {
        setActivity(prev => prev ? { ...prev, userEchoes } : null);
        console.log('✅ User posts refreshed successfully');
      }
    } catch (err) {
      console.error('❌ Error refreshing user posts:', err);
      setError('Failed to refresh user posts');
    } finally {
      setLoading(false);
    }
  };

  return {
    activity,
    loading,
    error,
    removeDownload,
    formatFileSize,
    getRelativeTime,
    refreshUserPosts,
  };
}
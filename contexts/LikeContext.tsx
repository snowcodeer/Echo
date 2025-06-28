import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '@/data/postsDatabase';

interface LikedPost extends Post {
  likedAt: Date;
}

interface LikeContextType {
  likedPosts: Set<string>;
  likedPostsData: LikedPost[];
  toggleLike: (post: Post) => Promise<void>;
  isLiked: (postId: string) => boolean;
  getLikeCount: (postId: string) => number;
  clearLikeData: () => Promise<void>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

const STORAGE_KEY = '@echo_liked_posts';

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedPostsData, setLikedPostsData] = useState<LikedPost[]>([]);

  // Load data from storage on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed: LikedPost[] = JSON.parse(storedData).map((post: any) => ({
          ...post,
          likedAt: new Date(post.likedAt),
          createdAt: new Date(post.createdAt),
        }));
        
        setLikedPostsData(parsed);
        setLikedPosts(new Set(parsed.map(post => post.id)));
      }
    } catch (error) {
      console.error('Error loading liked posts:', error);
    }
  };

  const saveToStorage = async (data: LikedPost[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving liked posts:', error);
    }
  };

  const toggleLike = async (post: Post) => {
    const postId = post.id;
    const isCurrentlyLiked = likedPosts.has(postId);

    if (isCurrentlyLiked) {
      // Unlike the post
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });

      setLikedPostsData(prev => {
        const updated = prev.filter(p => p.id !== postId);
        saveToStorage(updated);
        return updated;
      });
    } else {
      // Like the post
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.add(postId);
        return newSet;
      });

      const likedPost: LikedPost = {
        ...post,
        likedAt: new Date(),
      };

      setLikedPostsData(prev => {
        const updated = [likedPost, ...prev];
        saveToStorage(updated);
        return updated;
      });
    }
  };

  const isLiked = (postId: string) => {
    return likedPosts.has(postId);
  };

  const getLikeCount = (postId: string) => {
    // This would typically come from the server
    // For now, we'll just return the base like count from the post data
    return 0;
  };

  const clearLikeData = async () => {
    try {
      setLikedPosts(new Set());
      setLikedPostsData([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing like data:', error);
    }
  };

  return (
    <LikeContext.Provider value={{
      likedPosts,
      likedPostsData,
      toggleLike,
      isLiked,
      getLikeCount,
      clearLikeData,
    }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
}
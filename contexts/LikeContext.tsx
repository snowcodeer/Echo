import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikedPost {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  tags: string[];
  voiceStyle?: string;
  duration?: number;
}

interface LikeContextType {
  likedPosts: Set<string>;
  likedPostsData: LikedPost[];
  toggleLike: (postId: string, postData: LikedPost) => void;
  isLiked: (postId: string) => boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedPostsData, setLikedPostsData] = useState<LikedPost[]>([]);

  const toggleLike = (postId: string, postData: LikedPost) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        // Remove from liked posts data
        setLikedPostsData(prevData => prevData.filter(post => post.id !== postId));
      } else {
        newSet.add(postId);
        // Add to liked posts data with proper user attribution
        const likedPost = {
          ...postData,
          // Ensure we preserve the original poster's information
          username: postData.username,
          displayName: postData.displayName,
          avatar: postData.avatar,
          isLiked: true
        };
        setLikedPostsData(prevData => [...prevData, likedPost]);
      }
      return newSet;
    });
  };

  const isLiked = (postId: string) => {
    return likedPosts.has(postId);
  };

  return (
    <LikeContext.Provider value={{ likedPosts, likedPostsData, toggleLike, isLiked }}>
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
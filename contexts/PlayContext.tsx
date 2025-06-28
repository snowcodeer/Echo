import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlaySession {
  postId: string;
  userId: string;
  timestamp: Date;
  duration: number;
}

interface PlayContextType {
  currentlyPlaying: string | null;
  playedPosts: Set<string>;
  playCounts: Record<string, number>;
  playHistory: PlaySession[];
  setCurrentlyPlaying: (postId: string | null) => void;
  incrementPlayCount: (postId: string) => void;
  getPlayCount: (postId: string) => number;
  hasPlayed: (postId: string) => boolean;
  getTotalPlayTime: () => number;
  getUniqueListeners: (postId: string) => number;
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAY_COUNTS: '@echo_play_counts',
  PLAYED_POSTS: '@echo_played_posts',
  PLAY_HISTORY: '@echo_play_history',
};

// Simulated user ID for demo purposes
const CURRENT_USER_ID = 'user_123';

export function PlayProvider({ children }: { children: ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [playedPosts, setPlayedPosts] = useState<Set<string>>(new Set());
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const [playHistory, setPlayHistory] = useState<PlaySession[]>([]);

  // Load data from storage on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [countsData, playedData, historyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PLAY_COUNTS),
        AsyncStorage.getItem(STORAGE_KEYS.PLAYED_POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.PLAY_HISTORY),
      ]);

      if (countsData) {
        setPlayCounts(JSON.parse(countsData));
      }
      if (playedData) {
        setPlayedPosts(new Set(JSON.parse(playedData)));
      }
      if (historyData) {
        setPlayHistory(JSON.parse(historyData).map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
        })));
      }
    } catch (error) {
      console.error('Error loading play data:', error);
    }
  };

  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const incrementPlayCount = (postId: string) => {
    // Only increment if this post hasn't been played before by this user
    if (!playedPosts.has(postId)) {
      // Update play counts
      setPlayCounts(prev => {
        const updated = {
          ...prev,
          [postId]: (prev[postId] || 0) + 1
        };
        saveToStorage(STORAGE_KEYS.PLAY_COUNTS, updated);
        return updated;
      });

      // Mark as played
      setPlayedPosts(prev => {
        const updated = new Set(prev).add(postId);
        saveToStorage(STORAGE_KEYS.PLAYED_POSTS, Array.from(updated));
        return updated;
      });

      // Add to play history
      const session: PlaySession = {
        postId,
        userId: CURRENT_USER_ID,
        timestamp: new Date(),
        duration: 5, // Minimum 5 seconds to count as a play
      };

      setPlayHistory(prev => {
        const updated = [...prev, session];
        saveToStorage(STORAGE_KEYS.PLAY_HISTORY, updated);
        return updated;
      });
    }
  };

  const getPlayCount = (postId: string) => {
    return playCounts[postId] || 0;
  };

  const hasPlayed = (postId: string) => {
    return playedPosts.has(postId);
  };

  const getTotalPlayTime = () => {
    return playHistory.reduce((total, session) => total + session.duration, 0);
  };

  const getUniqueListeners = (postId: string) => {
    const uniqueUsers = new Set(
      playHistory
        .filter(session => session.postId === postId)
        .map(session => session.userId)
    );
    return uniqueUsers.size;
  };

  return (
    <PlayContext.Provider value={{
      currentlyPlaying,
      playedPosts,
      playCounts,
      playHistory,
      setCurrentlyPlaying,
      incrementPlayCount,
      getPlayCount,
      hasPlayed,
      getTotalPlayTime,
      getUniqueListeners,
    }}>
      {children}
    </PlayContext.Provider>
  );
}

export function usePlay() {
  const context = useContext(PlayContext);
  if (context === undefined) {
    throw new Error('usePlay must be used within a PlayProvider');
  }
  return context;
}
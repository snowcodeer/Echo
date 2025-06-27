import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '@/data/postsDatabase';

interface SavedPost extends Post {
  isPermanentlySaved?: boolean;
  savedAt: Date;
}

interface SaveContextType {
  savedPosts: SavedPost[];
  commuteQueue: SavedPost[];
  downloadingPosts: Set<string>;
  downloadedPosts: Set<string>;
  savePost: (post: Post, isPermanent?: boolean) => Promise<void>;
  unsavePost: (postId: string) => Promise<void>;
  moveToSaved: (postId: string) => Promise<void>;
  moveToQueue: (postId: string) => Promise<void>;
  downloadPost: (post: Post) => Promise<void>;
  removeDownload: (postId: string) => Promise<void>;
  clearQueue: () => Promise<void>;
  isSaved: (postId: string) => boolean;
  isDownloaded: (postId: string) => boolean;
  isDownloading: (postId: string) => boolean;
}

const SaveContext = createContext<SaveContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SAVED_POSTS: '@echo_saved_posts',
  COMMUTE_QUEUE: '@echo_commute_queue',
  DOWNLOADED_POSTS: '@echo_downloaded_posts',
};

export function SaveProvider({ children }: { children: ReactNode }) {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [commuteQueue, setCommuteQueue] = useState<SavedPost[]>([]);
  const [downloadingPosts, setDownloadingPosts] = useState<Set<string>>(new Set());
  const [downloadedPosts, setDownloadedPosts] = useState<Set<string>>(new Set());

  // Load data from storage on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [savedData, queueData, downloadedData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.COMMUTE_QUEUE),
        AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADED_POSTS),
      ]);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('Loaded saved posts:', parsed.length);
        setSavedPosts(parsed);
      }
      if (queueData) {
        const parsed = JSON.parse(queueData);
        console.log('Loaded commute queue:', parsed.length);
        setCommuteQueue(parsed);
      }
      if (downloadedData) {
        const parsed = JSON.parse(downloadedData);
        console.log('Loaded downloaded posts:', parsed.length);
        setDownloadedPosts(new Set(parsed));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log(`Saved to ${key}:`, Array.isArray(data) ? data.length : data);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const savePost = async (post: Post, isPermanent = true) => {
    console.log(`Saving post ${post.id} as ${isPermanent ? 'permanent' : 'temporary'}`);
    
    const savedPost: SavedPost = {
      ...post,
      isPermanentlySaved: isPermanent,
      savedAt: new Date(),
    };

    if (isPermanent) {
      setSavedPosts(prev => {
        const filtered = prev.filter(p => p.id !== post.id);
        const updated = [...filtered, savedPost];
        console.log(`Updated saved posts: ${updated.length} items`);
        saveToStorage(STORAGE_KEYS.SAVED_POSTS, updated);
        return updated;
      });
    } else {
      // Adding to commute queue (temporary save)
      setCommuteQueue(prev => {
        const filtered = prev.filter(p => p.id !== post.id);
        const updated = [...filtered, savedPost];
        console.log(`Updated commute queue: ${updated.length} items`);
        saveToStorage(STORAGE_KEYS.COMMUTE_QUEUE, updated);
        return updated;
      });
    }
  };

  const unsavePost = async (postId: string) => {
    console.log(`Unsaving post ${postId} - ONLY removing from saved posts, NOT from commute queue`);
    
    // CRITICAL FIX: Only remove from saved posts, NOT from commute queue
    // The commute queue should be independent of the saved status
    setSavedPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      console.log(`Removed from saved posts. Remaining: ${updated.length} items`);
      saveToStorage(STORAGE_KEYS.SAVED_POSTS, updated);
      return updated;
    });

    // DO NOT remove from commute queue - this was the bug!
    // The commute queue should only be affected by download/remove download actions
    console.log(`Post ${postId} unsaved but remains in commute queue if downloaded`);
  };

  const moveToSaved = async (postId: string) => {
    console.log(`Moving post ${postId} from queue to saved`);
    
    const queueItem = commuteQueue.find(p => p.id === postId);
    if (queueItem) {
      const savedPost = { ...queueItem, isPermanentlySaved: true };
      
      setCommuteQueue(prev => {
        const updated = prev.filter(p => p.id !== postId);
        console.log(`Removed from queue. Remaining: ${updated.length} items`);
        saveToStorage(STORAGE_KEYS.COMMUTE_QUEUE, updated);
        return updated;
      });

      setSavedPosts(prev => {
        const updated = [...prev, savedPost];
        console.log(`Added to saved posts. Total: ${updated.length} items`);
        saveToStorage(STORAGE_KEYS.SAVED_POSTS, updated);
        return updated;
      });
    }
  };

  const moveToQueue = async (postId: string) => {
    console.log(`Moving post ${postId} from saved to queue`);
    
    const savedItem = savedPosts.find(p => p.id === postId);
    if (savedItem && !savedItem.isPermanentlySaved) {
      const queuePost = { ...savedItem, isPermanentlySaved: false };
      
      setSavedPosts(prev => {
        const updated = prev.filter(p => p.id !== postId);
        console.log(`Removed from saved posts. Remaining: ${updated.length} items`);
        saveToStorage(STORAGE_KEYS.SAVED_POSTS, updated);
        return updated;
      });

      setCommuteQueue(prev => {
        const updated = [...prev, queuePost];
        console.log(`Added to queue. Total: ${updated.length} items`);
        saveToStorage(STORAGE_KEYS.COMMUTE_QUEUE, updated);
        return updated;
      });
    }
  };

  const downloadPost = async (post: Post) => {
    console.log(`Starting download for post ${post.id}`);
    
    if (downloadingPosts.has(post.id) || downloadedPosts.has(post.id)) {
      console.log(`Post ${post.id} already downloading or downloaded`);
      return;
    }

    setDownloadingPosts(prev => {
      const updated = new Set(prev).add(post.id);
      console.log(`Added to downloading: ${post.id}`);
      return updated;
    });

    // Simulate download process
    setTimeout(async () => {
      console.log(`Download completed for post ${post.id}`);
      
      setDownloadingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        console.log(`Removed from downloading: ${post.id}`);
        return newSet;
      });

      setDownloadedPosts(prev => {
        const newSet = new Set(prev).add(post.id);
        const array = Array.from(newSet);
        console.log(`Added to downloaded posts: ${post.id}. Total downloaded: ${array.length}`);
        saveToStorage(STORAGE_KEYS.DOWNLOADED_POSTS, array);
        return newSet;
      });

      // Add to commute queue (this is independent of saved status)
      await savePost(post, false);
      console.log(`Post ${post.id} added to commute queue after download`);
    }, 2000);
  };

  const removeDownload = async (postId: string) => {
    console.log(`Removing download for post ${postId}`);
    
    // Remove from downloaded posts
    setDownloadedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      const array = Array.from(newSet);
      console.log(`Removed from downloaded posts: ${postId}. Remaining: ${array.length}`);
      saveToStorage(STORAGE_KEYS.DOWNLOADED_POSTS, array);
      return newSet;
    });

    // Remove from commute queue
    setCommuteQueue(prev => {
      const updated = prev.filter(p => p.id !== postId);
      console.log(`Removed from commute queue: ${postId}. Remaining: ${updated.length}`);
      saveToStorage(STORAGE_KEYS.COMMUTE_QUEUE, updated);
      return updated;
    });

    console.log(`Post ${postId} completely removed from downloads and queue`);
  };

  const clearQueue = async () => {
    console.log('Clearing entire commute queue');
    
    const queueIds = commuteQueue.map(p => p.id);
    console.log(`Clearing ${queueIds.length} items from queue`);
    
    setCommuteQueue([]);
    saveToStorage(STORAGE_KEYS.COMMUTE_QUEUE, []);

    setDownloadedPosts(prev => {
      const newSet = new Set(prev);
      queueIds.forEach(id => {
        newSet.delete(id);
        console.log(`Removed from downloaded: ${id}`);
      });
      const array = Array.from(newSet);
      saveToStorage(STORAGE_KEYS.DOWNLOADED_POSTS, array);
      return newSet;
    });
    
    console.log('Queue cleared successfully');
  };

  const isSaved = (postId: string) => {
    const inSaved = savedPosts.some(p => p.id === postId);
    const inQueue = commuteQueue.some(p => p.id === postId);
    return inSaved || inQueue;
  };

  const isDownloaded = (postId: string) => {
    return downloadedPosts.has(postId);
  };

  const isDownloading = (postId: string) => {
    return downloadingPosts.has(postId);
  };

  return (
    <SaveContext.Provider value={{
      savedPosts,
      commuteQueue,
      downloadingPosts,
      downloadedPosts,
      savePost,
      unsavePost,
      moveToSaved,
      moveToQueue,
      downloadPost,
      removeDownload,
      clearQueue,
      isSaved,
      isDownloaded,
      isDownloading,
    }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  const context = useContext(SaveContext);
  if (context === undefined) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
}
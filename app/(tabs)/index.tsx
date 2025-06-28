import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getForYouPosts, getFriendsPosts, Post } from '@/data/postsDatabase';
import { usePlay } from '@/contexts/PlayContext';
import PostCard from '@/components/PostCard';
import { globalStyles, colors, gradients } from '@/styles/globalStyles';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>(getForYouPosts());
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [playTimers, setPlayTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [activeTab, setActiveTab] = useState<'foryou' | 'friends'>('foryou');
  
  const { 
    currentlyPlaying, 
    setCurrentlyPlaying, 
    incrementPlayCount, 
    getPlayCount 
  } = usePlay();

  const handleTabChange = (tab: 'foryou' | 'friends') => {
    setActiveTab(tab);
    setPosts(tab === 'foryou' ? getForYouPosts() : getFriendsPosts());
  };

  const handlePlay = (postId: string, duration: number) => {
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== postId) {
      handleStop(currentlyPlaying);
    }

    if (currentlyPlaying === postId) {
      // Pause current audio
      handleStop(postId);
    } else {
      // Start playing
      setCurrentlyPlaying(postId);
      
      // Start progress simulation
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        setPlayProgress(prev => ({
          ...prev,
          [postId]: progress
        }));

        // Stop when complete
        if (progress >= 1) {
          handleStop(postId);
        }
      }, 100);

      setPlayTimers(prev => ({
        ...prev,
        [postId]: timer
      }));
    }
  };

  const handleStop = (postId: string) => {
    setCurrentlyPlaying(null);
    
    // Clear timer
    if (playTimers[postId]) {
      clearInterval(playTimers[postId]);
      setPlayTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[postId];
        return newTimers;
      });
    }
    
    // Reset progress
    setPlayProgress(prev => ({
      ...prev,
      [postId]: 0
    }));
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(playTimers).forEach(timer => clearInterval(timer));
    };
  }, []);

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Simplified header - no subtitle */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>echo</Text>
        </View>

        {/* Using globalStyles.tabsContainer for consistent tab styling */}
        <View style={globalStyles.tabsContainer}>
          <TouchableOpacity
            style={[globalStyles.tab, activeTab === 'foryou' && globalStyles.tabActive]}
            onPress={() => handleTabChange('foryou')}>
            <Text style={[globalStyles.tabText, activeTab === 'foryou' && globalStyles.tabTextActive]}>
              For You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.tab, activeTab === 'friends' && globalStyles.tabActive]}
            onPress={() => handleTabChange('friends')}>
            <Text style={[globalStyles.tabText, activeTab === 'friends' && globalStyles.tabTextActive]}>
              Friends
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              playProgress={playProgress[post.id] || 0}
              onPlay={handlePlay}
              onStop={handleStop}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
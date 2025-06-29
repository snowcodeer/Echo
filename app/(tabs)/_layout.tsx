import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet, Alert } from 'react-native';
import { Chrome as Home, Bookmark, Mic, Compass, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import BoltBadge from '@/components/BoltBadge';
import ConvAiDOMComponent from '@/conversational-ai/ConvAI';
import { Message } from '@/components/ChatMessage';
import { addUserPost } from '@/data/profile';
import { Post } from '@/data/postsDatabase';
import { colors, spacing, borderRadius, shadows } from '@/styles/globalStyles';

export default function TabLayout() {
  const { isAuthenticated, loading, user } = useAuth();
  const [aiPostContent, setAiPostContent] = useState<string | null>(null);

  // Handle AI messages
  const handleAIMessage = (message: Message) => {
    console.log('AI Message:', message);
    // You can handle the AI messages here - perhaps show them in a toast or modal
  };

  // Handle echo content extraction from AI
  const handleEchoContentExtracted = (content: string) => {
    console.log('🎯 Echo content extracted in layout:', content);
    setAiPostContent(content);
  };

  // Create AI post when aiPostContent changes
  useEffect(() => {
    if (aiPostContent) {
      createAIPost(aiPostContent);
    }
  }, [aiPostContent]);

  const createAIPost = async (content: string) => {
    try {
      console.log('🚀 Creating AI post with content:', content);

      // Generate tags based on content
      const generateTags = (text: string): string[] => {
        const lowerText = text.toLowerCase();
        const tags: string[] = [];
        
        if (lowerText.includes('morning') || lowerText.includes('coffee')) {
          tags.push('morning');
        }
        if (lowerText.includes('motivation') || lowerText.includes('inspire')) {
          tags.push('motivation');
        }
        if (lowerText.includes('thought') || lowerText.includes('philosophy')) {
          tags.push('deepthoughts');
        }
        if (lowerText.includes('confession') || lowerText.includes('secret')) {
          tags.push('confession');
        }
        if (lowerText.includes('energy') || lowerText.includes('positive')) {
          tags.push('energy');
        }
        
        // Ensure we have at least one tag but no more than 3
        if (tags.length === 0) {
          tags.push('voice', 'ai', 'echo');
        } else if (tags.length > 3) {
          tags.splice(3);
        } else {
          // Fill up to 3 tags
          const defaultTags = ['ai', 'echo', 'voice'];
          for (const tag of defaultTags) {
            if (tags.length < 3 && !tags.includes(tag)) {
              tags.push(tag);
            }
          }
        }
        
        return tags.slice(0, 3);
      };

      // Estimate duration based on content length (roughly 150 words per minute for speech)
      const estimateDuration = (text: string): number => {
        const wordCount = text.split(' ').length;
        const wordsPerSecond = 2.5; // Approximately 150 words per minute
        const estimatedSeconds = Math.ceil(wordCount / wordsPerSecond);
        // Ensure duration is between 5-10 seconds as per app constraints
        return Math.max(Math.min(estimatedSeconds, 10), 5);
      };

      const newPost = addUserPost({
        username: user?.username || '@EchoHQ',
        displayName: user?.displayName || 'EchoHQ',
        avatar: user?.avatar || 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder audio
        duration: estimateDuration(content),
        voiceStyle: 'AI Generated',
        replies: 0,
        timestamp: 'now',
        tags: generateTags(content),
        content: content,
        isUserPost: true,
        createdVia: 'ai-assistant',
        originalText: content,
      });

      console.log('✅ AI post created successfully:', newPost);

      // Show success alert
      Alert.alert(
        'Echo Created!', 
        'Your AI-generated echo has been posted to your profile.',
        [
          {
            text: 'View Profile',
            onPress: () => {
              // Navigate to profile tab to see the new post
              router.push('/(tabs)/profile');
            },
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );

      // Reset the AI post content
      setAiPostContent(null);

    } catch (error) {
      console.error('❌ Error creating AI post:', error);
      Alert.alert('Error', 'Failed to create your echo. Please try again.');
      setAiPostContent(null);
    }
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading]);

  // Don't render tabs if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: '#1a1a1a',
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 100 : 80,
            paddingBottom: Platform.OS === 'ios' ? 35 : 15,
            paddingTop: 10,
            paddingHorizontal: 8,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B7280',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 11,
            marginTop: 4,
            marginBottom: 0,
            textAlign: 'center',
          },
          tabBarIconStyle: {
            marginTop: 8,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feed',
            tabBarIcon: ({ size, color }) => (
              <Home size={22} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            tabBarIcon: ({ size, color }) => (
              <Bookmark size={22} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post',
            tabBarIcon: ({ size, color }) => (
              <Mic size={22} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ size, color }) => (
              <Compass size={22} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={22} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
      
      {/* AI Assistant - positioned in top right corner with app-consistent styling */}
      <View style={styles.aiAssistantContainer}>
        <View style={styles.aiAssistantWrapper}>
          <ConvAiDOMComponent
            dom={{ style: styles.aiComponent }}
            platform={Platform.OS}
            onMessage={handleAIMessage}
            onEchoContentExtracted={handleEchoContentExtracted}
          />
        </View>
      </View>
      
      {/* Bolt.new Badge - positioned above navbar on the right */}
      <BoltBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  aiAssistantContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: spacing.xl,
    zIndex: 1000,
  },
  aiAssistantWrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
    // Add subtle glow effect consistent with app's accent color
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  aiComponent: {
    width: 48,
    height: 48,
  },
});
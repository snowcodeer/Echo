import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Chrome as Home, Bookmark, Mic, Compass, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import BoltBadge from '@/components/BoltBadge';
import ConvAiDOMComponent from '@/conversational-ai/ConvAI';
import { Message } from '@/components/ChatMessage';
import { colors, spacing, borderRadius, shadows } from '@/styles/globalStyles';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();

  // Handle AI messages
  const handleAIMessage = (message: Message) => {
    console.log('AI Message:', message);
    // You can handle the AI messages here - perhaps show them in a toast or modal
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
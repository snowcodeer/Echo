import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Chrome as Home, Bookmark, Mic, Compass, User } from 'lucide-react-native';
import BoltBadge from '@/components/BoltBadge';

export default function TabLayout() {
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
      
      {/* Bolt.new Badge - positioned above navbar on the right */}
      <BoltBadge />
    </View>
  );
}
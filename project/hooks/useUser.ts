import { useState, useEffect } from 'react';
import { UserProfile, UserActivity } from '@/types/user';

// Mock user data for demonstration
const mockUserProfile: UserProfile = {
  id: 'user_123',
  username: '@EchoHQ',
  displayName: 'EchoHQ',
  email: 'hello@echohq.com',
  avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  bio: 'Sharing thoughts through the power of voice ✨ Building the future of audio social media.',
  joinDate: new Date('2024-01-15'),
  isVerified: true,
  isOwner: true,
  followerCount: 2400,
  followingCount: 892,
  echoCount: 156,
  location: 'London, UK',
  website: 'https://echohq.com',
  preferences: {
    isPrivate: false,
    allowDirectMessages: true,
    showEmail: false,
    showBirthDate: false,
  },
};

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadUser = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUserProfile);
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (err) {
      setError('Failed to update profile');
      return { success: false, error: 'Update failed' };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    isAuthenticated: !!user,
  };
}
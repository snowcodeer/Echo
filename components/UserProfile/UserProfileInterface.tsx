import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useUserActivity } from '@/hooks/useUserActivity';
import { EditProfileData } from '@/types/user';
import { gradients } from '@/styles/globalStyles';
import ProfileHeader from './ProfileHeader';
import ActivityTabs from './ActivityTabs';
import EditProfileModal from './EditProfileModal';

export default function UserProfileInterface() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { user, loading: userLoading, refreshUserData } = useAuth();
  const { 
    activity, 
    loading: activityLoading, 
    error: activityError,
  } = useUserActivity();

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleSaveProfile = async (data: EditProfileData) => {
    try {
      // In a real app, this would make an API call to update the profile
      // For now, we'll simulate success and refresh user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh user data from the API
      await refreshUserData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const handleRetryActivity = () => {
    // In a real implementation, this would trigger a refetch
    console.log('Retrying activity fetch...');
  };

  if (userLoading) {
    return (
      <LinearGradient colors={gradients.background} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            {/* Loading state is handled by individual components */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient colors={gradients.background} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            {/* Error state - user should be redirected to login */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Convert auth user to UserProfile format for compatibility
  const userProfile = {
    id: user.id,
    username: user.username || '@user',
    displayName: user.displayName || user.username || 'User',
    email: user.email || 'user@example.com',
    avatar: user.avatar,
    bio: user.bio,
    joinDate: user.joinDate ? new Date(user.joinDate) : new Date(),
    isVerified: user.isVerified || false,
    isOwner: true, // Current user is always the owner of their profile
    followerCount: user.followerCount || 0,
    followingCount: user.followingCount || 0,
    echoCount: user.echoCount || 0,
    location: user.location,
    website: user.website,
    preferences: {
      isPrivate: user.preferences?.isPrivate || false,
      allowDirectMessages: user.preferences?.allowDirectMessages || true,
      showEmail: user.preferences?.showEmail || false,
      showBirthDate: user.preferences?.showBirthDate || false,
    },
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Profile Header */}
        <ProfileHeader
          user={userProfile}
          onEditPress={handleEditProfile}
          onSettingsPress={handleSettings}
        />

        {/* Activity Tabs */}
        <ActivityTabs
          activity={activity}
          loading={activityLoading}
          error={activityError}
          onRetry={handleRetryActivity}
        />

        {/* Edit Profile Modal */}
        <EditProfileModal
          visible={editModalVisible}
          user={userProfile}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveProfile}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
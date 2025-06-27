import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { useUserActivity } from '@/hooks/useUserActivity';
import { EditProfileData } from '@/types/user';
import { gradients } from '@/styles/globalStyles';
import ProfileHeader from './ProfileHeader';
import ActivityTabs from './ActivityTabs';
import EditProfileModal from './EditProfileModal';

export default function UserProfileInterface() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { user, loading: userLoading, error: userError, updateProfile } = useUser();
  const { 
    activity, 
    loading: activityLoading, 
    error: activityError,
  } = useUserActivity();

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality would be implemented here');
  };

  const handleSaveProfile = async (data: EditProfileData) => {
    return await updateProfile(data);
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
            {/* Loading state would be handled by individual components */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (userError || !user) {
    return (
      <LinearGradient colors={gradients.background} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            {/* Error state would be handled by individual components */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Profile Header */}
        <ProfileHeader
          user={user}
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
          user={user}
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
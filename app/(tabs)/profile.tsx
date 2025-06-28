import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, MapPin, CreditCard as Edit3, Mic, Users, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { getEchoHQPosts } from '@/data/postsDatabase';
import { useLike } from '@/contexts/LikeContext';
import { useSave } from '@/contexts/SaveContext';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

// Mock user data
const mockUser = {
  id: 'user_123',
  username: '@EchoHQ',
  displayName: 'EchoHQ',
  avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  bio: 'Sharing thoughts through the power of voice ✨ Building the future of audio social media.',
  isVerified: true,
  isOwner: true,
  followerCount: 2400,
  followingCount: 892,
  echoCount: 156,
  location: 'London, UK',
  preferences: {
    isPrivate: false,
    allowDirectMessages: true,
  },
};

export default function ProfileScreen() {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('echoes');
  const [userEchoCount, setUserEchoCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  
  const { likedPostsData } = useLike();
  const { savedPosts } = useSave();

  // Calculate actual user activity counts
  useEffect(() => {
    // Get actual EchoHQ posts count
    const echoHQPosts = getEchoHQPosts();
    setUserEchoCount(echoHQPosts.length);
    
    // Mock friends count - in a real app this would come from a friends API
    // For now, we'll use a realistic number based on the user's activity
    const mockFriendsCount = Math.floor(savedPosts.length * 2.5 + likedPostsData.length * 1.8 + 15);
    setFriendsCount(Math.min(mockFriendsCount, 127)); // Cap at reasonable number
  }, [savedPosts.length, likedPostsData.length]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would be implemented here');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const shouldShowBio = mockUser.bio && mockUser.bio.length > 0;
  const bioPreview = mockUser.bio && mockUser.bio.length > 100 
    ? mockUser.bio.substring(0, 100) + '...' 
    : mockUser.bio;

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Header */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>profile</Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            {/* Header Actions */}
            <View style={styles.headerActions}>
              {mockUser.isOwner && (
                <>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleEditProfile}
                    accessibilityLabel="Edit profile"
                    accessibilityRole="button">
                    <Edit3 size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleSettings}
                    accessibilityLabel="Settings"
                    accessibilityRole="button">
                    <Settings size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Profile Image */}
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: mockUser.avatar }} 
                style={styles.avatar}
              />
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.displayNameAndVerifiedContainer}>
                <Text style={[styles.displayName, { fontSize: getResponsiveFontSize(24) }]}>
                  {mockUser.displayName}
                </Text>
                {mockUser.isVerified && (
                  <View style={styles.verifiedCheckmark}>
                    <Check size={16} color={colors.textPrimary} />
                  </View>
                )}
              </View>
              <Text style={[styles.username, { fontSize: getResponsiveFontSize(16) }]}>
                {mockUser.username}
              </Text>
            </View>

            {/* Bio Section */}
            {shouldShowBio && (
              <View style={styles.bioContainer}>
                <Text style={[styles.bio, { fontSize: getResponsiveFontSize(16) }]}>
                  {bioExpanded ? mockUser.bio : bioPreview}
                </Text>
                {mockUser.bio && mockUser.bio.length > 100 && (
                  <TouchableOpacity 
                    onPress={() => setBioExpanded(!bioExpanded)}
                    style={styles.bioToggle}>
                    <Text style={[styles.bioToggleText, { fontSize: getResponsiveFontSize(14) }]}>
                      {bioExpanded ? 'Show less' : 'Show more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Location */}
            {mockUser.location && (
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <MapPin size={14} color={colors.textMuted} />
                  <Text style={[styles.metaText, { fontSize: getResponsiveFontSize(12) }]}>
                    {mockUser.location}
                  </Text>
                </View>
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                  {formatNumber(mockUser.followerCount)}
                </Text>
                <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                  Followers
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                  {formatNumber(mockUser.followingCount)}
                </Text>
                <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                  Following
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                  {formatNumber(mockUser.echoCount)}
                </Text>
                <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                  Echoes
                </Text>
              </View>
            </View>
          </View>

          {/* Activity Tabs - Using Feed Page Style with Dynamic Counts */}
          <View style={globalStyles.tabsContainer}>
            <TouchableOpacity
              style={[globalStyles.tab, activeTab === 'echoes' && globalStyles.tabActive]}
              onPress={() => setActiveTab('echoes')}>
              <Text style={[globalStyles.tabText, activeTab === 'echoes' && globalStyles.tabTextActive]}>
                Your Echoes ({userEchoCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.tab, activeTab === 'friends' && globalStyles.tabActive]}
              onPress={() => setActiveTab('friends')}>
              <Text style={[globalStyles.tabText, activeTab === 'friends' && globalStyles.tabTextActive]}>
                Friends ({friendsCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                {activeTab === 'echoes' && userEchoCount === 0 && 'No echoes yet'}
                {activeTab === 'echoes' && userEchoCount > 0 && `${userEchoCount} echoes created`}
                {activeTab === 'friends' && friendsCount === 0 && 'No friends yet'}
                {activeTab === 'friends' && friendsCount > 0 && `${friendsCount} friends connected`}
              </Text>
              <Text style={[styles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
                {activeTab === 'echoes' && userEchoCount === 0 && 'Share your first voice echo to get started'}
                {activeTab === 'echoes' && userEchoCount > 0 && 'Your voice echoes are making an impact in the community'}
                {activeTab === 'friends' && friendsCount === 0 && 'Connect with other users to see them here'}
                {activeTab === 'friends' && friendsCount > 0 && 'Your network is growing! Keep connecting with amazing voices'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  displayNameAndVerifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  displayName: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  verifiedCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  bioContainer: {
    marginBottom: spacing.lg,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bioToggle: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  bioToggleText: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  tabContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    color: colors.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
  },
});
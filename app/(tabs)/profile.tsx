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
import { Settings, MapPin, Link as LinkIcon, Calendar, Shield, CreditCard as Edit3, Mail, MailCheck, Mic, Users } from 'lucide-react-native';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

// Mock user data
const mockUser = {
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
  },
};

// Mock activity data
const mockActivity = {
  userEchoes: 42,
  friends: 89,
};

export default function ProfileScreen() {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('echoes');

  const formatJoinDate = (date: Date): string => {
    const now = new Date();
    const diffInMonths = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    if (diffInMonths < 1) return 'Joined this month';
    if (diffInMonths === 1) return 'Joined 1 month ago';
    if (diffInMonths < 12) return `Joined ${diffInMonths} months ago`;
    
    const years = Math.floor(diffInMonths / 12);
    return years === 1 ? 'Joined 1 year ago' : `Joined ${years} years ago`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username;
    return `${maskedUsername}@${domain}`;
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would be implemented here');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality would be implemented here');
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
                    onPress={handleEditProfile}>
                    <Edit3 size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleSettings}>
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
              {mockUser.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={16} color={colors.textPrimary} fill={colors.accent} />
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={[styles.displayName, { fontSize: getResponsiveFontSize(24) }]}>
                {mockUser.displayName}
              </Text>
              <Text style={[styles.username, { fontSize: getResponsiveFontSize(16) }]}>
                {mockUser.username}
              </Text>
              
              {/* Email */}
              <View style={styles.emailContainer}>
                {mockUser.preferences.showEmail ? (
                  <MailCheck size={14} color={colors.success} />
                ) : (
                  <Mail size={14} color={colors.textMuted} />
                )}
                <Text style={[styles.email, { fontSize: getResponsiveFontSize(12) }]}>
                  {mockUser.preferences.showEmail ? mockUser.email : maskEmail(mockUser.email)}
                </Text>
              </View>

              {/* Join Date */}
              <View style={styles.joinDateContainer}>
                <Calendar size={14} color={colors.textMuted} />
                <Text style={[styles.joinDate, { fontSize: getResponsiveFontSize(12) }]}>
                  {formatJoinDate(mockUser.joinDate)}
                </Text>
              </View>
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

            {/* Location and Website */}
            <View style={styles.metaInfo}>
              {mockUser.location && (
                <View style={styles.metaItem}>
                  <MapPin size={14} color={colors.textMuted} />
                  <Text style={[styles.metaText, { fontSize: getResponsiveFontSize(12) }]}>
                    {mockUser.location}
                  </Text>
                </View>
              )}
              {mockUser.website && (
                <View style={styles.metaItem}>
                  <LinkIcon size={14} color={colors.textMuted} />
                  <Text style={[styles.metaLink, { fontSize: getResponsiveFontSize(12) }]}>
                    {mockUser.website}
                  </Text>
                </View>
              )}
            </View>

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

          {/* Activity Tabs - Using Feed Page Style */}
          <View style={globalStyles.tabsContainer}>
            <TouchableOpacity
              style={[globalStyles.tab, activeTab === 'echoes' && globalStyles.tabActive]}
              onPress={() => setActiveTab('echoes')}>
              <Text style={[globalStyles.tabText, activeTab === 'echoes' && globalStyles.tabTextActive]}>
                Your Echoes ({mockActivity.userEchoes})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.tab, activeTab === 'friends' && globalStyles.tabActive]}
              onPress={() => setActiveTab('friends')}>
              <Text style={[globalStyles.tabText, activeTab === 'friends' && globalStyles.tabTextActive]}>
                Friends ({mockActivity.friends})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                {activeTab === 'echoes' && 'No echoes yet'}
                {activeTab === 'friends' && 'No friends yet'}
              </Text>
              <Text style={[styles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
                {activeTab === 'echoes' && 'Share your first voice echo to get started'}
                {activeTab === 'friends' && 'Connect with other users to see them here'}
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
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  displayName: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  username: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  email: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  joinDate: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
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
  metaLink: {
    fontFamily: 'Inter-Regular',
    color: colors.accent,
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
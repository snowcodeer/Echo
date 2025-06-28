import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Settings, RefreshCw, LogOut, User, Mail, Calendar, Mic, Users } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { makeAuthenticatedRequest } from '@/utils/api';
import { getUserPosts, getUserStats } from '@/data/profile';
import { usePlay } from '@/contexts/PlayContext';
import { useTranscription } from '@/contexts/TranscriptionContext';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

interface ApiUser {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

type TabType = 'profile' | 'echoes' | 'friends';

export default function ProfileScreen() {
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();
  const { currentlyPlaying, setCurrentlyPlaying, getPlayCount } = usePlay();
  const { transcriptionsEnabled } = useTranscription();
  
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [playTimers, setPlayTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Get user posts and stats
  const userPosts = getUserPosts();
  const userStats = getUserStats();

  // Mock friends data
  const mockFriends = [
    {
      id: '1',
      username: '@alex_voice',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: true,
      mutualFriends: 12,
    },
    {
      id: '2',
      username: '@sarah_speaks',
      displayName: 'Sarah Kim',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: false,
      mutualFriends: 8,
    },
    {
      id: '3',
      username: '@mike_audio',
      displayName: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: true,
      mutualFriends: 15,
    },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading]);

  // Fetch user profile from API
  const fetchUserProfile = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      console.log('Fetching user profile from API...');
      const response = await makeAuthenticatedRequest('/api/auth/me');
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User profile fetched successfully:', userData);
        setApiUser(userData);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch user profile:', response.status, errorData);
        setError(errorData.message || `Failed to fetch profile (${response.status})`);
      }
    } catch (error) {
      console.error('Network error fetching user profile:', error);
      setError('Network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authLoading]);

  const handlePlay = (postId: string, duration: number) => {
    if (currentlyPlaying && currentlyPlaying !== postId) {
      handleStop(currentlyPlaying);
    }

    if (currentlyPlaying === postId) {
      handleStop(postId);
    } else {
      setCurrentlyPlaying(postId);
      
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        setPlayProgress(prev => ({
          ...prev,
          [postId]: progress
        }));

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
    
    if (playTimers[postId]) {
      clearInterval(playTimers[postId]);
      setPlayTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[postId];
        return newTimers;
      });
    }
    
    setPlayProgress(prev => ({
      ...prev,
      [postId]: 0
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrentTime = (progress: number, duration: number) => {
    const currentSeconds = Math.floor(progress * duration);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    fetchUserProfile(true);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              router.replace('/login');
            } else {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <LinearGradient colors={gradients.background} style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeArea}>
          <View style={styles.centerContainer}>
            <Text style={[styles.loadingText, { fontSize: getResponsiveFontSize(16) }]}>
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // If not authenticated, show message (shouldn't happen due to redirect above)
  if (!isAuthenticated) {
    return (
      <LinearGradient colors={gradients.background} style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeArea}>
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(16) }]}>
              Please log in to view your profile
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const renderProfileTab = () => (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      showsVerticalScrollIndicator={false}>
      
      {/* Loading State */}
      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { fontSize: getResponsiveFontSize(16) }]}>
            Loading profile...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(16) }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchUserProfile()}>
            <Text style={[styles.retryButtonText, { fontSize: getResponsiveFontSize(14) }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Content */}
      {apiUser && !loading && (
        <View style={styles.profileContent}>
          
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            {apiUser.avatar ? (
              <Image source={{ uri: apiUser.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={colors.textMuted} />
              </View>
            )}
          </View>

          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <Text style={[styles.displayName, { fontSize: getResponsiveFontSize(24) }]}>
              {apiUser.displayName || apiUser.username || 'Unknown User'}
            </Text>
            
            {apiUser.username && (
              <Text style={[styles.username, { fontSize: getResponsiveFontSize(16) }]}>
                @{apiUser.username}
              </Text>
            )}

            {apiUser.bio && (
              <Text style={[styles.bio, { fontSize: getResponsiveFontSize(14) }]}>
                {apiUser.bio}
              </Text>
            )}
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                {userStats.totalPosts}
              </Text>
              <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                Echoes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                {userStats.totalListens}
              </Text>
              <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                Listens
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                {mockFriends.length}
              </Text>
              <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                Friends
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
              Account Details
            </Text>

            {apiUser.email && (
              <View style={styles.detailItem}>
                <Mail size={16} color={colors.textMuted} />
                <Text style={[styles.detailText, { fontSize: getResponsiveFontSize(14) }]}>
                  {apiUser.email}
                </Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <User size={16} color={colors.textMuted} />
              <Text style={[styles.detailText, { fontSize: getResponsiveFontSize(14) }]}>
                ID: {apiUser.id}
              </Text>
            </View>

            {apiUser.createdAt && (
              <View style={styles.detailItem}>
                <Calendar size={16} color={colors.textMuted} />
                <Text style={[styles.detailText, { fontSize: getResponsiveFontSize(14) }]}>
                  Joined: {new Date(apiUser.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderEchoesTab = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.tabContent}>
        <Text style={[styles.tabHeader, { fontSize: getResponsiveFontSize(18) }]}>
          Your Echoes ({userPosts.length})
        </Text>
        
        {userPosts.length > 0 ? (
          <View style={styles.postsContainer}>
            {userPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <LinearGradient colors={gradients.surface} style={styles.postGradient}>
                  
                  <View style={styles.postHeader}>
                    <View style={styles.postMeta}>
                      <Text style={[styles.postTimestamp, { fontSize: getResponsiveFontSize(12) }]}>
                        {post.timestamp}
                      </Text>
                      <View style={styles.createdViaBadge}>
                        <Text style={[styles.createdViaText, { fontSize: getResponsiveFontSize(10) }]}>
                          {post.createdVia === 'text-to-speech' ? 'TTS' : 'Voice'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Voice Style Badge */}
                  <View style={styles.voiceStyleContainer}>
                    <View style={[
                      styles.voiceStyleBadge,
                      post.voiceStyle === 'Original' && styles.originalVoiceBadge
                    ]}>
                      <Text style={[
                        styles.voiceStyleText,
                        post.voiceStyle === 'Original' && styles.originalVoiceText,
                        { fontSize: getResponsiveFontSize(12) }
                      ]}>
                        {post.voiceStyle}
                      </Text>
                    </View>
                  </View>

                  {/* Content - Only show if transcriptions are enabled */}
                  {transcriptionsEnabled && (
                    <Text style={[styles.postContent, { fontSize: getResponsiveFontSize(16) }]}>
                      {post.content}
                    </Text>
                  )}

                  {/* Audio Progress with Play Button */}
                  <View style={styles.audioContainer}>
                    <View style={styles.audioControls}>
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => handlePlay(post.id, post.duration)}>
                        {currentlyPlaying === post.id ? (
                          <Text style={styles.playButtonText}>⏸</Text>
                        ) : (
                          <Text style={styles.playButtonText}>▶</Text>
                        )}
                      </TouchableOpacity>
                      
                      <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                          <View style={[
                            styles.progressFill, 
                            { width: `${(playProgress[post.id] || 0) * 100}%` }
                          ]} />
                        </View>
                        <View style={styles.timeContainer}>
                          <Text style={[styles.currentTime, { fontSize: getResponsiveFontSize(12) }]}>
                            {formatCurrentTime(playProgress[post.id] || 0, post.duration)}
                          </Text>
                          <Text style={[styles.totalTime, { fontSize: getResponsiveFontSize(12) }]}>
                            {formatDuration(post.duration)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Tags Section */}
                  <View style={styles.tagsContainer}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tagButton}>
                        <Text style={[styles.tagText, { fontSize: getResponsiveFontSize(12) }]}>
                          #{tag}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Actions Container */}
                  <View style={styles.actionsContainer}>
                    <View style={styles.actionButton}>
                      <Text style={styles.actionIcon}>👂</Text>
                      <Text style={[styles.actionText, { fontSize: getResponsiveFontSize(14) }]}>
                        {getPlayCount(post.id)}
                      </Text>
                    </View>

                    <View style={styles.actionButton}>
                      <Text style={styles.actionIcon}>💬</Text>
                      <Text style={[styles.actionText, { fontSize: getResponsiveFontSize(14) }]}>
                        {post.replies}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
              No echoes yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
              Share your first voice echo to get started
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderFriendsTab = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.tabContent}>
        <Text style={[styles.tabHeader, { fontSize: getResponsiveFontSize(18) }]}>
          Friends ({mockFriends.length})
        </Text>
        
        <View style={styles.friendsContainer}>
          {mockFriends.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <View style={styles.friendInfo}>
                <View style={styles.friendAvatarContainer}>
                  <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                  {friend.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                
                <View style={styles.friendDetails}>
                  <Text style={[styles.friendName, { fontSize: getResponsiveFontSize(16) }]}>
                    {friend.displayName}
                  </Text>
                  <Text style={[styles.friendUsername, { fontSize: getResponsiveFontSize(14) }]}>
                    {friend.username}
                  </Text>
                  <Text style={[styles.mutualFriends, { fontSize: getResponsiveFontSize(12) }]}>
                    {friend.mutualFriends} mutual friends
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { fontSize: getResponsiveFontSize(24) }]}>
            Profile
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleRefresh}
              disabled={loading || refreshing}>
              <RefreshCw 
                size={20} 
                color={loading || refreshing ? colors.textMuted : colors.textPrimary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSettings}>
              <Settings size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSignOut}>
              <LogOut size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
            onPress={() => setActiveTab('profile')}>
            <User size={16} color={activeTab === 'profile' ? colors.accent : colors.textMuted} />
            <Text style={[
              styles.tabText, 
              activeTab === 'profile' && styles.tabTextActive,
              { fontSize: getResponsiveFontSize(14) }
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'echoes' && styles.tabActive]}
            onPress={() => setActiveTab('echoes')}>
            <Mic size={16} color={activeTab === 'echoes' ? colors.accent : colors.textMuted} />
            <Text style={[
              styles.tabText, 
              activeTab === 'echoes' && styles.tabTextActive,
              { fontSize: getResponsiveFontSize(14) }
            ]}>
              Echoes ({userPosts.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
            onPress={() => setActiveTab('friends')}>
            <Users size={16} color={activeTab === 'friends' ? colors.accent : colors.textMuted} />
            <Text style={[
              styles.tabText, 
              activeTab === 'friends' && styles.tabTextActive,
              { fontSize: getResponsiveFontSize(14) }
            ]}>
              Friends ({mockFriends.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'echoes' && renderEchoesTab()}
        {activeTab === 'friends' && renderFriendsTab()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.accent,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  profileContent: {
    padding: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.border,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  displayName: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  username: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
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
  detailsSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    flex: 1,
  },
  tabContent: {
    padding: spacing.xl,
  },
  tabHeader: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  // Posts styles
  postsContainer: {
    gap: spacing.lg,
  },
  postCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  postGradient: {
    padding: spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  postTimestamp: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  createdViaBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  createdViaText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  voiceStyleContainer: {
    marginBottom: spacing.lg,
  },
  voiceStyleBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  originalVoiceBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  voiceStyleText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  originalVoiceText: {
    color: colors.accent,
    fontFamily: 'Inter-SemiBold',
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  audioContainer: {
    marginBottom: spacing.lg,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  progressContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.borderSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTime: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  totalTime: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tagButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  // Friends styles
  friendsContainer: {
    gap: spacing.md,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  friendUsername: {
    fontFamily: 'Inter-Regular',
    color: colors.accent,
    marginBottom: 2,
  },
  mutualFriends: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
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
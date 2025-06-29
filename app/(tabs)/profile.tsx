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
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { Settings, User, Mail, Calendar, MailCheck, MapPin, Link as LinkIcon, Shield, Play, Heart, Eye, Pause, Loader } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { makeAuthenticatedRequest } from '@/utils/api';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

interface ApiUser {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  followerCount?: number;
  followingCount?: number;
  echoCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface Post {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  audio_url: string;
  duration: number;
  voice_style: string;
  likes: number;
  timestamp: string;
  is_liked: boolean;
  tags: string[];
  content: string;
  created_at: string;
  listen_count: number;
}

interface PostsResponse {
  posts: Post[];
  total: number;
}

export default function ProfileScreen() {
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('echoes');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  // Handle audio press with proper state management
  const handleAudioPress = async (audioUrl: string, postId: string) => {
    try {
      // If this is the currently playing audio, pause it
      if (currentlyPlayingId === postId && currentSound) {
        await currentSound.pauseAsync();
        setCurrentlyPlayingId(null);
        return;
      }

      // Stop any currently playing audio
      if (currentSound) {
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setCurrentlyPlayingId(null);
      }

      setAudioLoading(postId);
      console.log('Playing audio:', audioUrl);
      
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setCurrentSound(sound);
      setCurrentlyPlayingId(postId);
      
      await sound.playAsync();
      
      // Handle playback completion
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setCurrentSound(null);
          setCurrentlyPlayingId(null);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', 'Failed to play audio. Please try again.');
      setCurrentlyPlayingId(null);
      setCurrentSound(null);
    } finally {
      setAudioLoading(null);
    }
  };

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

  // Fetch user's posts/echoes
  const fetchUserPosts = async (isRefresh = false) => {
    if (!isRefresh) {
      setPostsLoading(true);
    }
    
    try {
      console.log('Fetching user posts from API...');
      const response = await makeAuthenticatedRequest('/api/posts/my-posts?skip=0&limit=10');
      
      if (response.ok) {
        const postsData: PostsResponse = await response.json();
        console.log('User posts fetched successfully:', postsData);
        setUserPosts(postsData.posts);
        setPostsTotal(postsData.total);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch user posts:', response.status, errorData);
      }
    } catch (error) {
      console.error('Network error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch profile and posts on mount
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [isAuthenticated, authLoading]);

  const handleRefresh = async () => {
    // Stop any playing audio during refresh
    if (currentSound) {
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setCurrentlyPlayingId(null);
    }
    
    await Promise.all([
      fetchUserProfile(true),
      fetchUserPosts(true)
    ]);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Utility functions
  const formatJoinDate = (dateString: string): string => {
    const date = new Date(dateString);
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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Render post item
  const renderPostItem = ({ item }: { item: Post }) => {
    const isCurrentlyPlaying = currentlyPlayingId === item.id;
    const isLoading = audioLoading === item.id;
    
    return (
      <View style={styles.postItem}>
        <View style={styles.postHeader}>
          <View style={styles.postInfo}>
            <Text style={[styles.postContent, { fontSize: getResponsiveFontSize(14) }]} numberOfLines={3}>
              {item.content}
            </Text>
            <Text style={[styles.postTimestamp, { fontSize: getResponsiveFontSize(12) }]}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.playButton, 
              isCurrentlyPlaying && styles.playButtonActive
            ]}
            onPress={() => handleAudioPress(item.audio_url, item.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={16} color={colors.textPrimary} />
            ) : isCurrentlyPlaying ? (
              <Pause size={16} color={colors.textPrimary} fill={colors.accent} />
            ) : (
              <Play size={16} color={colors.textPrimary} fill="transparent" />
            )}
          </TouchableOpacity>
        </View>
      
        <View style={styles.postMeta}>
          <Text style={[styles.postDuration, { fontSize: getResponsiveFontSize(12) }]}>
            {formatDuration(item.duration)}
          </Text>
          <Text style={[styles.postStyle, { fontSize: getResponsiveFontSize(12) }]}>
            {item.voice_style}
          </Text>
        </View>
        
        {item.tags.length > 0 && (
          <View style={styles.postTags}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={[styles.tagText, { fontSize: getResponsiveFontSize(10) }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.postStats}>
          <View style={styles.statRow}>
            <Heart size={14} color={item.is_liked ? colors.accent : colors.textMuted} 
                  fill={item.is_liked ? colors.accent : 'transparent'} />
            <Text style={[styles.statText, { fontSize: getResponsiveFontSize(12) }]}>
              {item.likes}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Eye size={14} color={colors.textMuted} />
            <Text style={[styles.statText, { fontSize: getResponsiveFontSize(12) }]}>
              {item.listen_count}
            </Text>
          </View>
        </View>
      </View>
    );
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

  // If not authenticated, show message
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

  const shouldShowBio = apiUser?.bio && apiUser.bio.length > 0;
  const bioPreview = apiUser?.bio && apiUser.bio.length > 100 
    ? apiUser.bio.substring(0, 100) + '...' 
    : apiUser?.bio;

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
              onPress={handleSettings}>
              <Settings size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

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
            <>
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                  {apiUser.avatar ? (
                    <Image source={{ uri: apiUser.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <User size={40} color={colors.textMuted} />
                    </View>
                  )}
                  {apiUser.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Shield size={16} color={colors.textPrimary} fill={colors.accent} />
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

                  {/* Email */}
                  {apiUser.email && (
                    <View style={styles.emailContainer}>
                      <MailCheck size={14} color={colors.success} />
                      <Text style={[styles.email, { fontSize: getResponsiveFontSize(12) }]}>
                        {maskEmail(apiUser.email)}
                      </Text>
                    </View>
                  )}

                  {/* Join Date */}
                  {apiUser.createdAt && (
                    <View style={styles.joinDateContainer}>
                      <Calendar size={14} color={colors.textMuted} />
                      <Text style={[styles.joinDate, { fontSize: getResponsiveFontSize(12) }]}>
                        {formatJoinDate(apiUser.createdAt)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bio Section */}
                {shouldShowBio && (
                  <View style={styles.bioContainer}>
                    <Text style={[styles.bio, { fontSize: getResponsiveFontSize(16) }]}>
                      {bioExpanded ? apiUser.bio : bioPreview}
                    </Text>
                    {apiUser.bio && apiUser.bio.length > 100 && (
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
                  {apiUser.location && (
                    <View style={styles.metaItem}>
                      <MapPin size={14} color={colors.textMuted} />
                      <Text style={[styles.metaText, { fontSize: getResponsiveFontSize(12) }]}>
                        {apiUser.location}
                      </Text>
                    </View>
                  )}
                  {apiUser.website && (
                    <View style={styles.metaItem}>
                      <LinkIcon size={14} color={colors.textMuted} />
                      <Text style={[styles.metaLink, { fontSize: getResponsiveFontSize(12) }]}>
                        {apiUser.website}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                      {formatNumber(apiUser.followerCount || 0)}
                    </Text>
                    <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                      Followers
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                      {formatNumber(apiUser.followingCount || 0)}
                    </Text>
                    <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                      Following
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(20) }]}>
                      {formatNumber(postsTotal)}
                    </Text>
                    <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(12) }]}>
                      Echoes
                    </Text>
                  </View>
                </View>
              </View>

              {/* Activity Tabs */}
              <View style={globalStyles.tabsContainer}>
                <TouchableOpacity
                  style={[globalStyles.tab, activeTab === 'echoes' && globalStyles.tabActive]}
                  onPress={() => setActiveTab('echoes')}>
                  <Text style={[globalStyles.tabText, activeTab === 'echoes' && globalStyles.tabTextActive]}>
                    Your Echoes ({postsTotal})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.tab, activeTab === 'friends' && globalStyles.tabActive]}
                  onPress={() => setActiveTab('friends')}>
                  <Text style={[globalStyles.tabText, activeTab === 'friends' && globalStyles.tabTextActive]}>
                    Friends ({apiUser.followingCount || 0})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              <View style={styles.tabContent}>
                {activeTab === 'echoes' && (
                  <>
                    {postsLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={[styles.loadingText, { fontSize: getResponsiveFontSize(16) }]}>
                          Loading echoes...
                        </Text>
                      </View>
                    ) : userPosts.length > 0 ? (
                      <FlatList
                        data={userPosts}
                        renderItem={renderPostItem}
                        keyExtractor={(item) => item.id}
                        style={styles.postsList}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                      />
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
                  </>
                )}
                
                {activeTab === 'friends' && (
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                      No friends yet
                    </Text>
                    <Text style={[styles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
                      Connect with other users to see them here
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
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
  profileHeader: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  userInfoSection: {
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
  postsList: {
    flex: 1,
  },
  postItem: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  postInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  postTimestamp: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: colors.accent + '20',
  },
  postMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  postDuration: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  postStyle: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  postStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
});
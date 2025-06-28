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
import { Settings, MapPin, CreditCard as Edit3, Mic, Users, Check, Headphones, MessageCircle, Play, Pause } from 'lucide-react-native';
import { router } from 'expo-router';
import { getUserPosts, getUserPostCount, UserPost } from '@/data/profile';
import { useLike } from '@/contexts/LikeContext';
import { useSave } from '@/contexts/SaveContext';
import { usePlay } from '@/contexts/PlayContext';
import { useTranscription } from '@/contexts/TranscriptionContext';
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
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [playTimers, setPlayTimers] = useState<Record<string, NodeJS.Timeout>>({});
  
  const { likedPostsData } = useLike();
  const { savedPosts } = useSave();
  const { currentlyPlaying, setCurrentlyPlaying, getPlayCount } = usePlay();
  const { transcriptionsEnabled } = useTranscription();

  // Calculate actual user activity counts and load user posts
  useEffect(() => {
    // Get actual user posts count and data
    const posts = getUserPosts();
    setUserPosts(posts);
    setUserEchoCount(posts.length);
    
    // Mock friends count - in a real app this would come from a friends API
    // For now, we'll use a realistic number based on the user's activity
    const mockFriendsCount = Math.floor(savedPosts.length * 2.5 + likedPostsData.length * 1.8 + 15);
    setFriendsCount(Math.min(mockFriendsCount, 127)); // Cap at reasonable number
  }, [savedPosts.length, likedPostsData.length]);

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
            {activeTab === 'echoes' ? (
              userEchoCount > 0 ? (
                <View style={styles.postsContainer}>
                  {userPosts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                      <LinearGradient
                        colors={gradients.surface}
                        style={styles.postGradient}>
                        
                        <View style={styles.postHeader}>
                          <View style={styles.userInfo}>
                            <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                            <View>
                              <Text style={styles.postDisplayName}>{post.displayName}</Text>
                              <Text style={styles.postUsername}>{post.username}</Text>
                            </View>
                          </View>
                          <View style={styles.postMeta}>
                            <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                            <View style={styles.createdViaBadge}>
                              <Text style={styles.createdViaText}>
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
                              post.voiceStyle === 'Original' && styles.originalVoiceText
                            ]}>
                              {post.voiceStyle}
                            </Text>
                          </View>
                        </View>

                        {/* Content - Only show if transcriptions are enabled */}
                        {transcriptionsEnabled && (
                          <Text style={styles.postContent}>
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
                                <Pause size={20} color={colors.textPrimary} />
                              ) : (
                                <Play size={20} color={colors.textPrimary} />
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
                                <Text style={styles.currentTime}>
                                  {formatCurrentTime(playProgress[post.id] || 0, post.duration)}
                                </Text>
                                <Text style={styles.totalTime}>{formatDuration(post.duration)}</Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* Tags Section */}
                        <View style={styles.tagsContainer}>
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <View key={index} style={styles.tagButton}>
                              <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Actions Container */}
                        <View style={styles.actionsContainer}>
                          <View style={styles.actionButton}>
                            <Headphones size={20} color={colors.textMuted} />
                            <Text style={styles.actionText}>
                              {getPlayCount(post.id)}
                            </Text>
                          </View>

                          <View style={styles.actionButton}>
                            <MessageCircle size={20} color={colors.textMuted} />
                            <Text style={styles.actionText}>{post.replies}</Text>
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
              )
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                  {friendsCount === 0 ? 'No friends yet' : `${friendsCount} friends connected`}
                </Text>
                <Text style={[styles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
                  {friendsCount === 0 
                    ? 'Connect with other users to see them here' 
                    : 'Your network is growing! Keep connecting with amazing voices'
                  }
                </Text>
              </View>
            )}
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
  // Post styles for user echoes
  postsContainer: {
    padding: spacing.xl,
  },
  postCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  postGradient: {
    padding: spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postDisplayName: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 2,
  },
  postUsername: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
    fontSize: 14,
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  postTimestamp: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    fontSize: 12,
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
    fontSize: 10,
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
    fontSize: 12,
  },
  originalVoiceText: {
    color: colors.accent,
    fontFamily: 'Inter-SemiBold',
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    fontSize: 16,
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
    fontSize: 12,
  },
  totalTime: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    fontSize: 12,
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
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    fontSize: 14,
  },
});
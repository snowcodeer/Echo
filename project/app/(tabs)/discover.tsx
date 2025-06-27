import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, TrendingUp, Hash, Users, X } from 'lucide-react-native';
import { useLike } from '@/contexts/LikeContext';
import { usePlay } from '@/contexts/PlayContext';
import { useSave } from '@/contexts/SaveContext';
import { getFeaturedPosts, getPostsByTag, Post } from '@/data/postsDatabase';
import PostCard from '@/components/PostCard';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

interface TrendingTag {
  id: string;
  tag: string;
  posts: number;
  growth: string;
}

interface TrendingCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: string;
  voiceStyle: string;
  isVerified: boolean;
  isFollowing: boolean;
}

const trendingTags: TrendingTag[] = [
  { id: '1', tag: 'deepthoughts', posts: 1247, growth: '+23%' },
  { id: '2', tag: 'motivation', posts: 892, growth: '+18%' },
  { id: '3', tag: 'comedy', posts: 756, growth: '+42%' },
  { id: '4', tag: 'breakups', posts: 834, growth: '+52%' },
  { id: '5', tag: 'relationshipadvice', posts: 756, growth: '+35%' },
  { id: '6', tag: 'confession', posts: 634, growth: '+45%' },
  { id: '7', tag: 'philosophy', posts: 521, growth: '+12%' },
  { id: '8', tag: 'storytelling', posts: 445, growth: '+31%' },
  { id: '9', tag: 'morning', posts: 387, growth: '+8%' },
];

const initialTrendingCreators: TrendingCreator[] = [
  {
    id: '1',
    username: '@encode_club',
    displayName: 'Encode Club',
    avatar: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: '24.8k',
    voiceStyle: 'Tech Educator',
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '2',
    username: '@elonmusk',
    displayName: 'Elon Musk',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: '156.2M',
    voiceStyle: 'Visionary Leader',
    isVerified: true,
    isFollowing: true,
  },
  {
    id: '3',
    username: '@midnight_thinker',
    displayName: 'MidnightThinker',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: '12.4k',
    voiceStyle: 'Deep Narrator Voice',
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '4',
    username: '@the_confessor',
    displayName: 'TheConfessor',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: '8.7k',
    voiceStyle: 'Whisper',
    isVerified: false,
    isFollowing: false,
  },
  {
    id: '5',
    username: '@radiowave',
    displayName: 'RadioWave',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: '15.2k',
    voiceStyle: 'Peppy Radio Host',
    isVerified: true,
    isFollowing: true,
  },
];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'creators' | 'tags'>('trending');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [playTimers, setPlayTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [trendingCreators, setTrendingCreators] = useState<TrendingCreator[]>(initialTrendingCreators);
  
  const { 
    currentlyPlaying, 
    setCurrentlyPlaying, 
    incrementPlayCount, 
    hasPlayed
  } = usePlay();

  const featuredPosts = getFeaturedPosts();

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

        if (elapsed >= 5 && !hasPlayed(postId)) {
          incrementPlayCount(postId);
        }

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

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('tags');
  };

  const handleFollowToggle = (creatorId: string) => {
    setTrendingCreators(prev => 
      prev.map(creator => 
        creator.id === creatorId 
          ? { ...creator, isFollowing: !creator.isFollowing }
          : creator
      )
    );
  };

  const filteredTags = trendingTags.filter(tag =>
    tag.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Simplified header - no subtitle */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>discover</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[globalStyles.input, styles.searchInput]}
              placeholder="Search tags, creators, topics..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'trending' && styles.tabButtonActive]}
            onPress={() => {
              setActiveTab('trending');
              setSelectedTag(null);
            }}>
            <TrendingUp size={16} color={activeTab === 'trending' ? colors.accent : colors.textMuted} />
            <Text style={[
              styles.tabText, 
              activeTab === 'trending' && styles.tabTextActive,
              { fontSize: getResponsiveFontSize(14) }
            ]}>
              Trending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'creators' && styles.tabButtonActive]}
            onPress={() => {
              setActiveTab('creators');
              setSelectedTag(null);
            }}>
            <Users size={16} color={activeTab === 'creators' ? colors.accent : colors.textMuted} />
            <Text style={[
              styles.tabText, 
              activeTab === 'creators' && styles.tabTextActive,
              { fontSize: getResponsiveFontSize(14) }
            ]}>
              Creators
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'tags' && styles.tabButtonActive]}
            onPress={() => {
              setActiveTab('tags');
              setSelectedTag(null);
            }}>
            <Hash size={16} color={activeTab === 'tags' ? colors.accent : colors.textMuted} />
            <Text style={[
              styles.tabText, 
              activeTab === 'tags' && styles.tabTextActive,
              { fontSize: getResponsiveFontSize(14) }
            ]}>
              Tags
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {activeTab === 'trending' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                  Featured Echoes
                </Text>
                {featuredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    playProgress={playProgress[post.id] || 0}
                    onPlay={handlePlay}
                    onStop={handleStop}
                    isFeatured={true}
                  />
                ))}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                  Trending Tags
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsPreview}>
                  {trendingTags.slice(0, 4).map((tag) => (
                    <TouchableOpacity 
                      key={tag.id} 
                      style={styles.trendingTagCard}
                      onPress={() => handleTagClick(tag.tag)}>
                      <Text style={[styles.trendingTagName, { fontSize: getResponsiveFontSize(16) }]}>
                        #{tag.tag}
                      </Text>
                      <Text style={[styles.trendingTagPosts, { fontSize: getResponsiveFontSize(12) }]}>
                        {tag.posts.toLocaleString()} posts
                      </Text>
                      <Text style={[styles.trendingTagGrowth, { fontSize: getResponsiveFontSize(12) }]}>
                        {tag.growth}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {activeTab === 'creators' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Rising Creators
              </Text>
              {trendingCreators.map((creator) => (
                <View key={creator.id} style={styles.creatorCard}>
                  <View style={styles.creatorInfo}>
                    <Image source={{ uri: creator.avatar }} style={styles.creatorAvatar} />
                    <View style={styles.creatorDetails}>
                      <View style={styles.creatorNameRow}>
                        <Text style={[styles.creatorName, { fontSize: getResponsiveFontSize(16) }]}>
                          {creator.displayName}
                        </Text>
                        {creator.isVerified && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.creatorUsername, { fontSize: getResponsiveFontSize(14) }]}>
                        {creator.username}
                      </Text>
                      <Text style={[styles.creatorFollowers, { fontSize: getResponsiveFontSize(12) }]}>
                        {creator.followers} followers
                      </Text>
                      <Text style={[styles.creatorVoiceStyle, { fontSize: getResponsiveFontSize(12) }]}>
                        {creator.voiceStyle === 'Original' ? 'Original' : creator.voiceStyle}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.followCreatorButton,
                      creator.isFollowing && styles.followingButton
                    ]}
                    onPress={() => handleFollowToggle(creator.id)}>
                    <Text style={[
                      styles.followCreatorText,
                      creator.isFollowing && styles.followingText,
                      { fontSize: getResponsiveFontSize(14) }
                    ]}>
                      {creator.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'tags' && (
            <View style={styles.section}>
              {selectedTag ? (
                <>
                  <View style={styles.tagHeaderContainer}>
                    <TouchableOpacity 
                      style={styles.backButton}
                      onPress={() => setSelectedTag(null)}>
                      <Text style={[styles.backButtonText, { fontSize: getResponsiveFontSize(16) }]}>
                        ← Back
                      </Text>
                    </TouchableOpacity>
                    <Text style={[styles.simplifiedTagTitle, { fontSize: getResponsiveFontSize(28) }]}>
                      #{selectedTag}
                    </Text>
                  </View>
                  {getPostsByTag(selectedTag).map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      playProgress={playProgress[post.id] || 0}
                      onPlay={handlePlay}
                      onStop={handleStop}
                    />
                  ))}
                  {getPostsByTag(selectedTag).length === 0 && (
                    <View style={globalStyles.emptyState}>
                      <Text style={[globalStyles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                        No posts found for #{selectedTag}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Tags'}
                  </Text>
                  {filteredTags.map((tag, index) => (
                    <TouchableOpacity 
                      key={tag.id} 
                      style={styles.tagCard}
                      onPress={() => handleTagClick(tag.tag)}>
                      <View style={styles.tagRank}>
                        <Text style={[styles.tagRankNumber, { fontSize: getResponsiveFontSize(14) }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.tagInfo}>
                        <Text style={[styles.tagName, { fontSize: getResponsiveFontSize(16) }]}>
                          #{tag.tag}
                        </Text>
                        <Text style={[styles.tagPosts, { fontSize: getResponsiveFontSize(12) }]}>
                          {tag.posts.toLocaleString()} posts
                        </Text>
                      </View>
                      <View style={styles.tagGrowth}>
                        <Text style={[styles.tagGrowthText, { fontSize: getResponsiveFontSize(14) }]}>
                          {tag.growth}
                        </Text>
                        <TrendingUp size={16} color={colors.success} />
                      </View>
                    </TouchableOpacity>
                  ))}
                  {filteredTags.length === 0 && searchQuery && (
                    <View style={globalStyles.emptyState}>
                      <Text style={[globalStyles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                        No tags found for "{searchQuery}"
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Only keeping styles that are unique to this component and not covered by globalStyles
const styles = StyleSheet.create({
  searchContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.sm,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: colors.accent,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.accent,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  tagHeaderContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  simplifiedTagTitle: {
    fontFamily: 'Inter-Bold',
    color: colors.accent,
  },
  tagsPreview: {
    paddingLeft: spacing.xl,
  },
  trendingTagCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    minWidth: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendingTagName: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  trendingTagPosts: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  trendingTagGrowth: {
    fontFamily: 'Inter-Medium',
    color: colors.success,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creatorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.lg,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  creatorName: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: colors.textPrimary,
  },
  creatorUsername: {
    fontFamily: 'Inter-Regular',
    color: colors.accent,
    marginBottom: 2,
  },
  creatorFollowers: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    marginBottom: 2,
  },
  creatorVoiceStyle: {
    fontFamily: 'Inter-Medium',
    color: colors.textDisabled,
  },
  followCreatorButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.xl,
    minWidth: 80,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: colors.borderSecondary,
    borderWidth: 1,
    borderColor: colors.textDisabled,
  },
  followCreatorText: {
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
  },
  followingText: {
    color: colors.textMuted,
  },
  tagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  tagRankNumber: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
    marginBottom: 2,
  },
  tagPosts: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  tagGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tagGrowthText: {
    fontFamily: 'Inter-Medium',
    color: colors.success,
  },
});
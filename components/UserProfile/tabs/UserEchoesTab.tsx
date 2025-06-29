import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Grid3x3 as Grid3X3, List, Plus } from 'lucide-react-native';
import { UserEcho } from '@/types/user';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';
import PostCard from '@/components/PostCard';
import { usePlay } from '@/contexts/PlayContext';

interface UserEchoesTabProps {
  echoes: UserEcho[];
  loading?: boolean;
  onRefresh?: () => void;
}

// Convert UserEcho to Post format for PostCard compatibility
const convertUserEchoToPost = (echo: UserEcho) => ({
  id: echo.id,
  username: '@you', // Indicate it's the user's own post
  displayName: 'You',
  avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  audioUrl: echo.audioUrl || '',
  duration: echo.duration || 30,
  voiceStyle: echo.voiceStyle,
  replies: echo.replies,
  timestamp: formatTimestamp(echo.createdAt),
  tags: echo.tags,
  content: echo.content,
  createdAt: echo.createdAt,
  listenCount: echo.listenCount || 0,
  hasReplies: false,
});

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return date.toLocaleDateString();
};

export default function UserEchoesTab({ echoes, loading = false, onRefresh }: UserEchoesTabProps) {
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed'); // Changed to 'feed' as default
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [playTimers, setPlayTimers] = useState<Record<string, NodeJS.Timeout>>({});
  
  const { 
    currentlyPlaying, 
    setCurrentlyPlaying, 
    incrementPlayCount, 
    getPlayCount 
  } = usePlay();

  // Sort by creation date (most recent first)
  const sortedEchoes = [...echoes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const publicEchoes = sortedEchoes.filter(echo => echo.isPublic);
  const privateEchoes = sortedEchoes.filter(echo => !echo.isPublic);

  // Convert echoes to posts for PostCard
  const posts = sortedEchoes.map(convertUserEchoToPost);

  const handlePlay = (postId: string, duration: number) => {
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== postId) {
      handleStop(currentlyPlaying);
    }

    if (currentlyPlaying === postId) {
      // Pause current audio
      handleStop(postId);
    } else {
      // Start playing
      setCurrentlyPlaying(postId);
      
      // Start progress simulation
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        setPlayProgress(prev => ({
          ...prev,
          [postId]: progress
        }));

        // Stop when complete
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
    
    // Clear timer
    if (playTimers[postId]) {
      clearInterval(playTimers[postId]);
      setPlayTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[postId];
        return newTimers;
      });
    }
    
    // Reset progress
    setPlayProgress(prev => ({
      ...prev,
      [postId]: 0
    }));
  };

  console.log('📊 UserEchoesTab rendering with:', {
    totalEchoes: echoes.length,
    sortedEchoes: sortedEchoes.length,
    loading,
    hasRefresh: !!onRefresh
  });

  if (echoes.length === 0 && !loading) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          ) : undefined
        }>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No echoes yet</Text>
          <Text style={styles.emptySubtitle}>
            Your voice echoes from the API will appear here
          </Text>
          {onRefresh && (
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {echoes.length} Echo{echoes.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.headerSubtitle}>
            {publicEchoes.length} public • {privateEchoes.length} private
          </Text>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'feed' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('feed')}
            accessibilityLabel="Feed view"
            accessibilityRole="button">
            <List size={16} color={viewMode === 'feed' ? colors.accent : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'grid' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('grid')}
            accessibilityLabel="Grid view"
            accessibilityRole="button">
            <Grid3X3 size={16} color={viewMode === 'grid' ? colors.accent : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          ) : undefined
        }>
        
        {/* Loading indicator */}
        {loading && echoes.length > 0 && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Refreshing...</Text>
          </View>
        )}

        {viewMode === 'feed' ? (
          <View style={styles.feedContainer}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                playProgress={playProgress[post.id] || 0}
                onPlay={handlePlay}
                onStop={handleStop}
              />
            ))}
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {sortedEchoes.map((echo, index) => (
              <View key={echo.id} style={styles.gridItem}>
                <Text style={styles.gridItemContent} numberOfLines={3}>
                  {echo.content}
                </Text>
                <View style={styles.gridItemMeta}>
                  <Text style={styles.gridItemDuration}>
                    {echo.duration ? `${Math.floor(echo.duration / 60)}:${(echo.duration % 60).toString().padStart(2, '0')}` : '0:30'}
                  </Text>
                  <Text style={styles.gridItemStyle}>
                    {echo.voiceStyle}
                  </Text>
                </View>
                {echo.tags.length > 0 && (
                  <View style={styles.gridItemTags}>
                    {echo.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Text key={tagIndex} style={styles.gridItemTag}>
                        #{tag}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    padding: 2,
  },
  toggleButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.accent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing.md,
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    ...typography.caption,
    color: colors.accent,
  },
  feedContainer: {
    // No additional padding needed as PostCard handles its own margins
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
  },
  gridItem: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  gridItemContent: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
    flex: 1,
  },
  gridItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  gridItemDuration: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: 'Inter-SemiBold',
  },
  gridItemStyle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  gridItemTags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  gridItemTag: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 400,
  },
  emptyTitle: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  refreshButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  refreshButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
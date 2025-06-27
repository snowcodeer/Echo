import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Bookmark, Play, Pause, Download } from 'lucide-react-native';
import { useSave } from '@/contexts/SaveContext';
import { usePlay } from '@/contexts/PlayContext';
import PostCard from '@/components/PostCard';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

export default function SavedScreen() {
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [playTimers, setPlayTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  
  const { 
    savedPosts, 
    commuteQueue, 
    removeDownload, 
    clearQueue 
  } = useSave();
  
  const { 
    currentlyPlaying, 
    setCurrentlyPlaying 
  } = usePlay();

  const handlePlay = (postId: string, duration: number = 30) => {
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
          
          // Auto-delete from commute queue after playback if enabled
          if (autoDeleteEnabled && commuteQueue.some(item => item.id === postId)) {
            removeDownload(postId);
          }
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(playTimers).forEach(timer => clearInterval(timer));
    };
  }, []);

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Simplified header - no subtitle */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>saved</Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Commute Queue */}
          <View style={styles.section}>
            <View style={styles.queueHeader}>
              <View style={styles.queueTitleContainer}>
                <Download size={20} color={colors.accent} />
                <Text style={[styles.queueTitle, { fontSize: getResponsiveFontSize(18) }]}>
                  Commute Queue ({commuteQueue.length})
                </Text>
              </View>
              
              {/* Toggle Switch for Auto-Delete */}
              <View style={styles.toggleContainer}>
                <Text style={[styles.toggleLabel, { fontSize: getResponsiveFontSize(12) }]}>
                  auto-delete after playback
                </Text>
                <Switch
                  value={autoDeleteEnabled}
                  onValueChange={setAutoDeleteEnabled}
                  trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                  thumbColor={autoDeleteEnabled ? colors.textPrimary : colors.textMuted}
                  ios_backgroundColor={colors.borderSecondary}
                  style={styles.toggleSwitch}
                />
              </View>
              
              {commuteQueue.length > 0 && (
                <TouchableOpacity onPress={clearQueue} style={globalStyles.secondaryButton}>
                  <Text style={[globalStyles.secondaryButtonText, { fontSize: getResponsiveFontSize(14) }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {commuteQueue.length > 0 ? (
              <View style={styles.queueContainer}>
                {commuteQueue.map((item) => (
                  <View key={item.id} style={styles.queueItem}>
                    <View style={styles.queueItemInfo}>
                      <Image source={{ uri: item.avatar }} style={globalStyles.avatar} />
                      <View style={styles.queueItemDetails}>
                        <Text style={[globalStyles.displayName, { fontSize: getResponsiveFontSize(16) }]}>
                          {item.displayName}
                        </Text>
                        <Text style={[globalStyles.username, { fontSize: getResponsiveFontSize(14) }]}>
                          {item.username}
                        </Text>
                        <Text style={[styles.queueItemContent, { fontSize: getResponsiveFontSize(12) }]} numberOfLines={2}>
                          {item.content}
                        </Text>
                        <View style={globalStyles.tagsContainer}>
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <Text key={index} style={[styles.queueItemTag, { fontSize: getResponsiveFontSize(10) }]}>
                              #{tag}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                    <View style={styles.queueItemActions}>
                      {item.duration && (
                        <TouchableOpacity
                          style={styles.queuePlayButton}
                          onPress={() => handlePlay(item.id, item.duration!)}>
                          {currentlyPlaying === item.id ? (
                            <Pause size={16} color={colors.textPrimary} />
                          ) : (
                            <Play size={16} color={colors.textPrimary} />
                          )}
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => removeDownload(item.id)}
                        style={styles.removeButton}>
                        <X size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={globalStyles.emptyState}>
                <Text style={[globalStyles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                  No posts in queue
                </Text>
                <Text style={[globalStyles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
                  Download posts for offline listening
                </Text>
              </View>
            )}
          </View>

          {/* Saved Posts */}
          <View style={styles.section}>
            <View style={styles.savedPostsHeader}>
              <Bookmark size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Saved Posts ({savedPosts.length})
              </Text>
            </View>
            
            {savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                playProgress={playProgress[post.id] || 0}
                onPlay={handlePlay}
                onStop={handleStop}
              />
            ))}

            {savedPosts.length === 0 && (
              <View style={globalStyles.emptyState}>
                <Text style={[globalStyles.emptyStateText, { fontSize: getResponsiveFontSize(16) }]}>
                  No saved posts yet
                </Text>
                <Text style={[globalStyles.emptyStateSubtext, { fontSize: getResponsiveFontSize(14) }]}>
                  Save posts to keep them here permanently
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Only keeping styles that are unique to this component and not covered by globalStyles
const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xxl,
  },
  savedPostsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  queueTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  queueTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  toggleLabel: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  queueContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  queueItemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  queueItemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  queueItemContent: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  queueItemTag: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  queueItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  queuePlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
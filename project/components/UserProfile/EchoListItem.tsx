import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Heart, MessageCircle, Lock, HeartHandshake } from 'lucide-react-native';
import { UserEcho } from '@/types/user';
import { useUserActivity } from '@/hooks/useUserActivity';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';

interface EchoListItemProps {
  echo: UserEcho;
  showPrivateIndicator?: boolean;
  showLikedIndicator?: boolean;
  onPress: () => void;
}

export default function EchoListItem({ 
  echo, 
  showPrivateIndicator = false,
  showLikedIndicator = false,
  onPress 
}: EchoListItemProps) {
  const { getRelativeTime } = useUserActivity();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={`Echo: ${echo.content.substring(0, 50)}...`}
      accessibilityRole="button">
      
      <LinearGradient
        colors={['#111111', '#1a1a1a']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.playButton}>
              <Play size={16} color={colors.textPrimary} />
            </View>
            {echo.duration && (
              <Text style={styles.duration}>
                {formatDuration(echo.duration)}
              </Text>
            )}
          </View>
          
          <View style={styles.headerRight}>
            {showLikedIndicator && (
              <View style={styles.likedIndicator}>
                <HeartHandshake size={14} color={colors.like} />
              </View>
            )}
            {showPrivateIndicator && !echo.isPublic && (
              <View style={styles.privateIndicator}>
                <Lock size={12} color={colors.warning} />
              </View>
            )}
            <Text style={styles.date}>
              {getRelativeTime(echo.createdAt)}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.content} numberOfLines={3}>
          {echo.content}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {echo.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* Footer Stats */}
        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Heart size={14} color={colors.textMuted} />
              <Text style={styles.statText}>{echo.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={14} color={colors.textMuted} />
              <Text style={styles.statText}>{echo.replies}</Text>
            </View>
          </View>
          
          <View style={styles.voiceStyleBadge}>
            <Text style={styles.voiceStyleText}>{echo.voiceStyle}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  gradient: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: 'Inter-SemiBold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  likedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 92, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privateIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  content: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  voiceStyleBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  voiceStyleText: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: 'Inter-Medium',
  },
});
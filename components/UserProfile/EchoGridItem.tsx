import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, MessageCircle, Lock, Heart } from 'lucide-react-native';
import { UserEcho } from '@/types/user';
import { useUserActivity } from '@/hooks/useUserActivity';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';

const { width } = Dimensions.get('window');
const itemWidth = (width - (spacing.lg * 2) - (spacing.md * 2)) / 3;

interface EchoGridItemProps {
  echo: UserEcho;
  index: number;
  showPrivateIndicator?: boolean;
  onPress: () => void;
}

export default function EchoGridItem({ 
  echo, 
  index, 
  showPrivateIndicator = false,
  onPress 
}: EchoGridItemProps) {
  const { getRelativeTime } = useUserActivity();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: itemWidth }]}
      onPress={onPress}
      accessibilityLabel={`Echo: ${echo.content.substring(0, 50)}...`}
      accessibilityRole="button">
      
      <LinearGradient
        colors={['#1a0f2e', '#2d1b4e']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.playButton}>
            <Play size={12} color={colors.textPrimary} />
          </View>
          {showPrivateIndicator && !echo.isPublic && (
            <View style={styles.privateIndicator}>
              <Lock size={10} color={colors.warning} />
            </View>
          )}
        </View>

        {/* Content Preview */}
        <Text style={styles.content} numberOfLines={3}>
          {echo.content}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {echo.tags.slice(0, 2).map((tag, tagIndex) => (
            <View key={tagIndex} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MessageCircle size={10} color={colors.textMuted} />
              <Text style={styles.statText}>{echo.replies}</Text>
            </View>
            {echo.duration && (
              <Text style={styles.duration}>
                {formatDuration(echo.duration)}
              </Text>
            )}
            {echo.listenCount !== undefined && (
              <View style={styles.statItem}>
                <Play size={10} color={colors.textMuted} />
                <Text style={styles.statText}>{formatCount(echo.listenCount)}</Text>
              </View>
            )}
            {echo.likes !== undefined && (
              <View style={styles.statItem}>
                <Heart size={10} color={echo.isLiked ? colors.error : colors.textMuted} />
                <Text style={styles.statText}>{formatCount(echo.likes)}</Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>
            {getRelativeTime(echo.createdAt)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: spacing.md,
    height: 160,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privateIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 14,
    flex: 1,
    marginVertical: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.xs,
  },
  tagText: {
    fontSize: 8,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  duration: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  date: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: colors.textSubtle,
  },
});
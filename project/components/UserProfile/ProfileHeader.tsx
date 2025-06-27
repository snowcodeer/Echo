import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, MapPin, Link as LinkIcon, Calendar, Shield, CreditCard as Edit3, Mail, MailCheck } from 'lucide-react-native';
import { UserProfile } from '@/types/user';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';

interface ProfileHeaderProps {
  user: UserProfile;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
}

export default function ProfileHeader({ 
  user, 
  onEditPress, 
  onSettingsPress 
}: ProfileHeaderProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  
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

  const shouldShowBio = user.bio && user.bio.length > 0;
  const bioPreview = user.bio && user.bio.length > 100 
    ? user.bio.substring(0, 100) + '...' 
    : user.bio;

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        {user.isOwner && (
          <>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onEditPress}
              accessibilityLabel="Edit profile"
              accessibilityRole="button">
              <Edit3 size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onSettingsPress}
              accessibilityLabel="Settings"
              accessibilityRole="button">
              <Settings size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Profile Image */}
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
            accessibilityLabel={`${user.displayName}'s profile picture`}
          />
        ) : (
          <LinearGradient
            colors={['#8B5CF6', '#A855F7', '#EC4899']}
            style={styles.avatarGradient}>
            <Text style={styles.avatarInitials}>
              {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </LinearGradient>
        )}
        {user.isVerified && (
          <View style={styles.verifiedBadge}>
            <Shield size={16} color={colors.textPrimary} fill={colors.accent} />
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>{user.username}</Text>
        
        {/* Email - masked for privacy */}
        <View style={styles.emailContainer}>
          {user.preferences.showEmail ? (
            <MailCheck size={14} color={colors.success} />
          ) : (
            <Mail size={14} color={colors.textMuted} />
          )}
          <Text style={styles.email}>
            {user.preferences.showEmail ? user.email : maskEmail(user.email)}
          </Text>
        </View>

        {/* Join Date */}
        <View style={styles.joinDateContainer}>
          <Calendar size={14} color={colors.textMuted} />
          <Text style={styles.joinDate}>{formatJoinDate(user.joinDate)}</Text>
        </View>
      </View>

      {/* Bio Section */}
      {shouldShowBio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>
            {bioExpanded ? user.bio : bioPreview}
          </Text>
          {user.bio && user.bio.length > 100 && (
            <TouchableOpacity 
              onPress={() => setBioExpanded(!bioExpanded)}
              style={styles.bioToggle}
              accessibilityLabel={bioExpanded ? "Show less" : "Show more"}
              accessibilityRole="button">
              <Text style={styles.bioToggleText}>
                {bioExpanded ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Location and Website */}
      {(user.location || user.website) && (
        <View style={styles.metaInfo}>
          {user.location && (
            <View style={styles.metaItem}>
              <MapPin size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{user.location}</Text>
            </View>
          )}
          {user.website && (
            <View style={styles.metaItem}>
              <LinkIcon size={14} color={colors.textMuted} />
              <Text style={styles.metaLink}>{user.website}</Text>
            </View>
          )}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(user.followerCount)}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(user.followingCount)}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(user.echoCount)}</Text>
          <Text style={styles.statLabel}>Echoes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
  },
  avatarInitials: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
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
    ...typography.headerMedium,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  username: {
    ...typography.bodyMedium,
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
    ...typography.caption,
    color: colors.textMuted,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  joinDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bioContainer: {
    marginBottom: spacing.lg,
  },
  bio: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bioToggle: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  bioToggleText: {
    ...typography.link,
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
    ...typography.caption,
    color: colors.textMuted,
  },
  metaLink: {
    ...typography.caption,
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
    ...typography.headerSmall,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
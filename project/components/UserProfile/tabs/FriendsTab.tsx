import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { UserPlus, MessageCircle, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { UserFriend } from '@/types/user';
import { useUserActivity } from '@/hooks/useUserActivity';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';

interface FriendsTabProps {
  friends: UserFriend[];
}

export default function FriendsTab({ friends }: FriendsTabProps) {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const { getRelativeTime } = useUserActivity();

  if (friends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <UserPlus size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No friends yet</Text>
        <Text style={styles.emptySubtitle}>
          Connect with other users to see them here
        </Text>
        <TouchableOpacity style={styles.findFriendsButton}>
          <UserPlus size={20} color={colors.textPrimary} />
          <Text style={styles.findFriendsText}>Find Friends</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Sort friends: online first, then by friendship date
  const sortedFriends = [...friends].sort((a, b) => {
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return new Date(b.friendshipDate).getTime() - new Date(a.friendshipDate).getTime();
  });

  const onlineFriends = friends.filter(f => f.isOnline);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>Total Friends</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{onlineFriends.length}</Text>
            <Text style={styles.statLabel}>Online Now</Text>
          </View>
        </View>
      </View>

      {/* Friends List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Online Friends Section */}
        {onlineFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Online Now ({onlineFriends.length})
            </Text>
            {onlineFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                isSelected={selectedFriend === friend.id}
                onPress={() => setSelectedFriend(
                  selectedFriend === friend.id ? null : friend.id
                )}
                getRelativeTime={getRelativeTime}
              />
            ))}
          </View>
        )}

        {/* All Friends Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            All Friends ({friends.length})
          </Text>
          {sortedFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              isSelected={selectedFriend === friend.id}
              onPress={() => setSelectedFriend(
                selectedFriend === friend.id ? null : friend.id
              )}
              getRelativeTime={getRelativeTime}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

interface FriendCardProps {
  friend: UserFriend;
  isSelected: boolean;
  onPress: () => void;
  getRelativeTime: (date: Date) => string;
}

function FriendCard({ friend, isSelected, onPress, getRelativeTime }: FriendCardProps) {
  return (
    <TouchableOpacity
      style={[styles.friendCard, isSelected && styles.friendCardSelected]}
      onPress={onPress}
      accessibilityLabel={`${friend.displayName}, ${friend.isOnline ? 'online' : 'offline'}`}
      accessibilityRole="button">
      
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
          {friend.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{friend.displayName}</Text>
          <Text style={styles.friendUsername}>{friend.username}</Text>
          
          <View style={styles.friendMeta}>
            <Text style={styles.mutualFriends}>
              {friend.mutualFriends} mutual friends
            </Text>
            <Text style={styles.friendshipDate}>
              Friends since {getRelativeTime(friend.friendshipDate)}
            </Text>
          </View>
          
          {!friend.isOnline && friend.lastSeen && (
            <Text style={styles.lastSeen}>
              Last seen {getRelativeTime(friend.lastSeen)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.friendActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={18} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MoreHorizontal size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.lg,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.headerSmall,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  friendUsername: {
    ...typography.bodySmall,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  friendMeta: {
    marginBottom: spacing.xs,
  },
  mutualFriends: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  friendshipDate: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  lastSeen: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  friendActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    marginTop: spacing.lg,
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
  findFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  findFriendsText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
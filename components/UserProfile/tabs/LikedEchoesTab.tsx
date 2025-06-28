import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { UserEcho } from '@/types/user';
import { colors, spacing, typography } from '@/styles/globalStyles';
import EchoListItem from '../EchoListItem';

interface LikedEchoesTabProps {
  echoes: UserEcho[];
}

export default function LikedEchoesTab({ echoes }: LikedEchoesTabProps) {
  if (echoes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No liked echoes yet</Text>
        <Text style={styles.emptySubtitle}>
          Like echoes to see them here in chronological order
        </Text>
      </View>
    );
  }

  // Sort by creation date (most recent first)
  const sortedEchoes = [...echoes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {echoes.length} Liked Echo{echoes.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.headerSubtitle}>
          Sorted by most recent
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {sortedEchoes.map((echo) => (
            <EchoListItem 
              key={echo.id} 
              echo={echo}
              showLikedIndicator
              onPress={() => {/* Handle echo press */}}
            />
          ))}
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  listContainer: {
    gap: spacing.md,
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
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
  },
});
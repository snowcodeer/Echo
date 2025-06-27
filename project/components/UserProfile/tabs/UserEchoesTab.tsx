import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Grid3x3 as Grid3X3, List, Plus } from 'lucide-react-native';
import { UserEcho } from '@/types/user';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';
import EchoGridItem from '../EchoGridItem';
import EchoListItem from '../EchoListItem';

interface UserEchoesTabProps {
  echoes: UserEcho[];
}

export default function UserEchoesTab({ echoes }: UserEchoesTabProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sort by creation date (most recent first)
  const sortedEchoes = [...echoes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const publicEchoes = sortedEchoes.filter(echo => echo.isPublic);
  const privateEchoes = sortedEchoes.filter(echo => !echo.isPublic);

  if (echoes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No echoes yet</Text>
        <Text style={styles.emptySubtitle}>
          Share your first voice echo to get started
        </Text>
        <TouchableOpacity style={styles.createButton}>
          <Plus size={20} color={colors.textPrimary} />
          <Text style={styles.createButtonText}>Create Echo</Text>
        </TouchableOpacity>
      </View>
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
              viewMode === 'grid' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('grid')}
            accessibilityLabel="Grid view"
            accessibilityRole="button">
            <Grid3X3 size={16} color={viewMode === 'grid' ? colors.accent : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('list')}
            accessibilityLabel="List view"
            accessibilityRole="button">
            <List size={16} color={viewMode === 'list' ? colors.accent : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {viewMode === 'grid' ? (
          <View style={styles.gridContainer}>
            {sortedEchoes.map((echo, index) => (
              <EchoGridItem 
                key={echo.id} 
                echo={echo} 
                index={index}
                showPrivateIndicator
                onPress={() => {/* Handle echo press */}}
              />
            ))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {sortedEchoes.map((echo) => (
              <EchoListItem 
                key={echo.id} 
                echo={echo}
                showPrivateIndicator
                onPress={() => {/* Handle echo press */}}
              />
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
    padding: spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
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
    marginBottom: spacing.xl,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  createButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
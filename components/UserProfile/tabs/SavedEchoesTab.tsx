import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Grid3x3 as Grid3X3, List } from 'lucide-react-native';
import { UserEcho } from '@/types/user';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';
import EchoGridItem from '../EchoGridItem';
import EchoListItem from '../EchoListItem';

const { width } = Dimensions.get('window');

interface SavedEchoesTabProps {
  echoes: UserEcho[];
}

export default function SavedEchoesTab({ echoes }: SavedEchoesTabProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (echoes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No saved echoes yet</Text>
        <Text style={styles.emptySubtitle}>
          Save echoes to keep them here permanently
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* View Mode Toggle */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {echoes.length} Saved Echo{echoes.length !== 1 ? 's' : ''}
        </Text>
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
            {echoes.map((echo, index) => (
              <EchoGridItem 
                key={echo.id} 
                echo={echo} 
                index={index}
                onPress={() => {/* Handle echo press */}}
              />
            ))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {echoes.map((echo) => (
              <EchoListItem 
                key={echo.id} 
                echo={echo}
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
  headerTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
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
  },
});
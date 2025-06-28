import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Download, Trash2, Calendar, HardDrive } from 'lucide-react-native';
import { UserDownload } from '@/types/user';
import { useUserActivity } from '@/hooks/useUserActivity';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';

interface DownloadsTabProps {
  downloads: UserDownload[];
}

export default function DownloadsTab({ downloads }: DownloadsTabProps) {
  const { removeDownload, formatFileSize, getRelativeTime } = useUserActivity();

  const handleDeleteDownload = (download: UserDownload) => {
    Alert.alert(
      'Delete Download',
      `Are you sure you want to delete "${download.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeDownload(download.id)
        },
      ]
    );
  };

  if (downloads.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Download size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No downloads yet</Text>
        <Text style={styles.emptySubtitle}>
          Downloaded echoes will appear here with details about format, size, and expiration
        </Text>
      </View>
    );
  }

  // Sort by download date (most recent first)
  const sortedDownloads = [...downloads].sort((a, b) => 
    new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
  );

  const totalSize = downloads.reduce((sum, download) => sum + download.size, 0);

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{downloads.length}</Text>
            <Text style={styles.statLabel}>Downloads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatFileSize(totalSize)}</Text>
            <Text style={styles.statLabel}>Total Size</Text>
          </View>
        </View>
      </View>

      {/* Downloads Table */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.titleColumn]}>Title</Text>
          <Text style={[styles.tableHeaderText, styles.formatColumn]}>Format</Text>
          <Text style={[styles.tableHeaderText, styles.sizeColumn]}>Size</Text>
          <Text style={[styles.tableHeaderText, styles.dateColumn]}>Date</Text>
          <Text style={[styles.tableHeaderText, styles.actionColumn]}>Action</Text>
        </View>

        {/* Table Rows */}
        {sortedDownloads.map((download, index) => (
          <View 
            key={download.id} 
            style={[
              styles.tableRow,
              index % 2 === 0 && styles.tableRowEven
            ]}>
            
            {/* Title */}
            <View style={styles.titleColumn}>
              <Text style={styles.downloadTitle} numberOfLines={2}>
                {download.title}
              </Text>
              {download.expiresAt && (
                <View style={styles.expirationContainer}>
                  <Calendar size={12} color={colors.warning} />
                  <Text style={styles.expirationText}>
                    Expires {getRelativeTime(download.expiresAt)}
                  </Text>
                </View>
              )}
            </View>

            {/* Format */}
            <View style={styles.formatColumn}>
              <View style={[
                styles.formatBadge,
                download.format === 'mp3' && styles.mp3Badge,
                download.format === 'wav' && styles.wavBadge,
                download.format === 'aac' && styles.aacBadge,
              ]}>
                <Text style={styles.formatText}>
                  {download.format.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Size */}
            <View style={styles.sizeColumn}>
              <View style={styles.sizeContainer}>
                <HardDrive size={14} color={colors.textMuted} />
                <Text style={styles.sizeText}>
                  {formatFileSize(download.size)}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.dateColumn}>
              <Text style={styles.dateText}>
                {getRelativeTime(download.downloadedAt)}
              </Text>
            </View>

            {/* Action */}
            <View style={styles.actionColumn}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDownload(download)}
                accessibilityLabel={`Delete ${download.title}`}
                accessibilityRole="button">
                <Trash2 size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderText: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: colors.surfaceSecondary,
  },
  titleColumn: {
    flex: 3,
    paddingRight: spacing.md,
  },
  formatColumn: {
    flex: 1,
    paddingRight: spacing.md,
    alignItems: 'center',
  },
  sizeColumn: {
    flex: 1,
    paddingRight: spacing.md,
    alignItems: 'center',
  },
  dateColumn: {
    flex: 1,
    paddingRight: spacing.md,
    alignItems: 'center',
  },
  actionColumn: {
    flex: 1,
    alignItems: 'center',
  },
  downloadTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing.xs,
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  expirationText: {
    ...typography.caption,
    color: colors.warning,
    fontSize: 10,
  },
  formatBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.borderSecondary,
  },
  mp3Badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  wavBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  aacBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  formatText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sizeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
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
  },
});
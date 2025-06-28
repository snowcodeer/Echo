import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Bookmark, Heart, Download, Mic, Users, Grid3x3 as Grid3X3, List, Table } from 'lucide-react-native';
import { UserActivity } from '@/types/user';
import { colors, spacing, borderRadius, typography } from '@/styles/globalStyles';
import SavedEchoesTab from './tabs/SavedEchoesTab';
import LikedEchoesTab from './tabs/LikedEchoesTab';
import DownloadsTab from './tabs/DownloadsTab';
import UserEchoesTab from './tabs/UserEchoesTab';
import FriendsTab from './tabs/FriendsTab';

type TabType = 'saved' | 'liked' | 'downloads' | 'echoes' | 'friends';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface ActivityTabsProps {
  activity: UserActivity;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ActivityTabs({ 
  activity, 
  loading, 
  error, 
  onRetry 
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('saved');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading activity...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No activity data available</Text>
      </View>
    );
  }

  const tabs: Tab[] = [
    {
      id: 'saved',
      label: 'Saved',
      icon: <Bookmark size={18} color={activeTab === 'saved' ? colors.accent : colors.textMuted} />,
      count: activity.savedEchoes.length,
    },
    {
      id: 'liked',
      label: 'Liked',
      icon: <Heart size={18} color={activeTab === 'liked' ? colors.accent : colors.textMuted} />,
      count: activity.likedEchoes.length,
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: <Download size={18} color={activeTab === 'downloads' ? colors.accent : colors.textMuted} />,
      count: activity.downloads.length,
    },
    {
      id: 'echoes',
      label: 'Your Echoes',
      icon: <Mic size={18} color={activeTab === 'echoes' ? colors.accent : colors.textMuted} />,
      count: activity.userEchoes.length,
    },
    {
      id: 'friends',
      label: 'Friends',
      icon: <Users size={18} color={activeTab === 'friends' ? colors.accent : colors.textMuted} />,
      count: activity.friends.length,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'saved':
        return <SavedEchoesTab echoes={activity.savedEchoes} />;
      case 'liked':
        return <LikedEchoesTab echoes={activity.likedEchoes} />;
      case 'downloads':
        return <DownloadsTab downloads={activity.downloads} />;
      case 'echoes':
        return <UserEchoesTab echoes={activity.userEchoes} />;
      case 'friends':
        return <FriendsTab friends={activity.friends} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab.id)}
            accessibilityLabel={`${tab.label} tab, ${tab.count} items`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}>
            {tab.icon}
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === tab.id && styles.tabBadgeActive
            ]}>
              <Text style={[
                styles.tabBadgeText,
                activeTab === tab.id && styles.tabBadgeTextActive
              ]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  tabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.sm,
    minWidth: 120,
  },
  tabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  tabText: {
    ...typography.label,
    color: colors.textMuted,
    flex: 1,
  },
  tabTextActive: {
    color: colors.accent,
    fontFamily: 'Inter-SemiBold',
  },
  tabBadge: {
    backgroundColor: colors.borderSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: colors.accent,
  },
  tabBadgeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  tabBadgeTextActive: {
    color: colors.textPrimary,
  },
  contentContainer: {
    flex: 1,
  },
});
import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Volume2, Type, Shield, Bell, Palette } from 'lucide-react-native';
import { useTranscription } from '@/contexts/TranscriptionContext';
import { globalStyles, colors, gradients, spacing, borderRadius, typography, getResponsiveFontSize } from '@/styles/globalStyles';

export default function SettingsScreen() {
  const { transcriptionsEnabled, toggleTranscriptions } = useTranscription();

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Header */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>settings</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Transcription Settings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Type size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Transcription Settings
              </Text>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Show Transcriptions
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Display text content below voice posts for better accessibility
                </Text>
              </View>
              <Switch
                value={transcriptionsEnabled}
                onValueChange={toggleTranscriptions}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle transcriptions"
                accessibilityRole="switch"
                accessibilityState={{ checked: transcriptionsEnabled }}
              />
            </View>
          </View>

          {/* Audio Settings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Volume2 size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Audio Settings
              </Text>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Auto-play Audio
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Automatically play audio when scrolling through posts
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle auto-play audio"
                accessibilityRole="switch"
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  High Quality Audio
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Use higher bitrate for better audio quality (uses more data)
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle high quality audio"
                accessibilityRole="switch"
              />
            </View>
          </View>

          {/* Privacy Settings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Privacy & Security
              </Text>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Private Account
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Only approved followers can see your echoes
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle private account"
                accessibilityRole="switch"
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Allow Direct Messages
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Let other users send you direct messages
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle direct messages"
                accessibilityRole="switch"
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Notifications
              </Text>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Push Notifications
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Receive notifications for likes, comments, and new followers
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle push notifications"
                accessibilityRole="switch"
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Email Notifications
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Receive weekly digest emails about your activity
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle email notifications"
                accessibilityRole="switch"
              />
            </View>
          </View>

          {/* Appearance Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Palette size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Appearance
              </Text>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Use dark theme throughout the app
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle dark mode"
                accessibilityRole="switch"
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Reduce Motion
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Minimize animations and transitions
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.borderSecondary}
                accessibilityLabel="Toggle reduce motion"
                accessibilityRole="switch"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 20,
  },
});
import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Volume2, Type, Shield, Bell, Palette, ArrowLeft, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranscription } from '@/contexts/TranscriptionContext';
import { useUser } from '@/hooks/useUser';
import { usePlay } from '@/contexts/PlayContext';
import { useSave } from '@/contexts/SaveContext';
import { clearUserPosts } from '@/data/profile';
import { globalStyles, colors, gradients, spacing, borderRadius, typography, getResponsiveFontSize } from '@/styles/globalStyles';

export default function SettingsScreen() {
  const { transcriptionsEnabled, toggleTranscriptions } = useTranscription();
  const { signOut } = useUser();
  const { clearPlayData } = usePlay();
  const { clearSavedData } = useSave();

  const handleBack = () => {
    router.back();
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? This will clear all your local data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all context data
              await Promise.all([
                clearPlayData(),
                clearSavedData(),
              ]);
              
              // Clear user posts
              clearUserPosts();
              
              // Sign out user
              const result = await signOut();
              
              if (result.success) {
                // Navigate to login screen
                router.replace('/login');
              } else {
                Alert.alert('Error', result.error || 'Failed to sign out');
              }
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'An unexpected error occurred during sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button">
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

    
            </View>
            
            <TouchableOpacity 
              style={[styles.settingCard, styles.signOutCard]}
              onPress={handleSignOut}
              accessibilityLabel="Sign out"
              accessibilityRole="button">
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, styles.signOutTitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Sign Out
                </Text>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Sign out of your account and clear all local data
                </Text>
              </View>
              <LogOut size={20} color={colors.error} />
            </TouchableOpacity>
          </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(24),
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
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
  signOutCard: {
    borderColor: colors.error,
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
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
  signOutTitle: {
    color: colors.error,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 20,
  },
});
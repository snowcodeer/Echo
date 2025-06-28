import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { X, MessageSquare, Volume2 } from 'lucide-react-native';
import { useTranscription } from '@/contexts/TranscriptionContext';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

export default function SettingsScreen() {
  const { showTranscriptions, toggleTranscriptions, loading } = useTranscription();

  const handleClose = () => {
    router.back();
  };

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { fontSize: getResponsiveFontSize(24) }]}>
            Settings
          </Text>
          <TouchableOpacity 
            onPress={handleClose} 
            style={styles.closeButton}
            accessibilityLabel="Close settings"
            accessibilityRole="button">
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Audio & Transcription Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Volume2 size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                Audio & Transcription
              </Text>
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <MessageSquare size={18} color={colors.textSecondary} />
                  <Text style={[styles.settingTitle, { fontSize: getResponsiveFontSize(16) }]}>
                    Show Transcriptions
                  </Text>
                </View>
                <Text style={[styles.settingDescription, { fontSize: getResponsiveFontSize(14) }]}>
                  Display text content alongside voice echoes for better accessibility and comprehension
                </Text>
              </View>
              
              <View style={styles.settingControl}>
                <Switch
                  value={showTranscriptions}
                  onValueChange={toggleTranscriptions}
                  disabled={loading}
                  trackColor={{ 
                    false: colors.borderSecondary, 
                    true: colors.accent 
                  }}
                  thumbColor={colors.textPrimary}
                  ios_backgroundColor={colors.borderSecondary}
                  style={styles.switch}
                />
              </View>
            </View>
            
            {/* Status Indicator */}
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                showTranscriptions ? styles.statusActive : styles.statusInactive
              ]}>
                <Text style={[
                  styles.statusText,
                  { fontSize: getResponsiveFontSize(12) },
                  showTranscriptions ? styles.statusTextActive : styles.statusTextInactive
                ]}>
                  {showTranscriptions ? 'Transcriptions are visible' : 'Transcriptions are hidden'}
                </Text>
              </View>
            </View>
          </View>

          {/* Additional Settings Placeholder */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
              More Settings
            </Text>
            <View style={styles.placeholderCard}>
              <Text style={[styles.placeholderText, { fontSize: getResponsiveFontSize(14) }]}>
                Additional settings will appear here in future updates
              </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 20,
  },
  settingControl: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  statusContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  statusIndicator: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: colors.success,
  },
  statusInactive: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: colors.textMuted,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextInactive: {
    color: colors.textMuted,
  },
  placeholderCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
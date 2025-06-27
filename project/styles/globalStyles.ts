import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Global color palette
export const colors = {
  // Primary colors
  primary: '#8B5CF6',
  primaryLight: '#A855F7',
  primaryDark: '#7C3AED',
  
  // Background colors
  background: '#000000',
  backgroundSecondary: '#1a0f2e',
  backgroundTertiary: '#2d1b4e',
  
  // Surface colors
  surface: '#111111',
  surfaceSecondary: '#1a1a1a',
  surfaceTertiary: '#1a1a2e',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textTertiary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textDisabled: '#6B7280',
  textSubtle: '#4B5563',
  
  // Accent colors
  accent: '#8B5CF6',
  accentSecondary: '#EC4899',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#3B82F6',
  
  // Interactive colors
  like: '#FF3B5C',
  bookmark: '#8B5CF6',
  download: '#8B5CF6',
  
  // Border colors
  border: '#1a1a1a',
  borderSecondary: '#374151',
  borderAccent: 'rgba(139, 92, 246, 0.3)',
  
  // Comedy tag colors
  comedy: '#FFC107',
  comedyBackground: 'rgba(255, 193, 7, 0.15)',
  comedyBorder: 'rgba(255, 193, 7, 0.4)',
};

// Typography scale
export const typography = {
  // Headers - Smaller sizes for mobile
  headerLarge: {
    fontSize: width < 768 ? 24 : 32,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    lineHeight: width < 768 ? 30 : 40,
  },
  headerMedium: {
    fontSize: width < 768 ? 20 : 28,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    lineHeight: width < 768 ? 26 : 36,
  },
  headerSmall: {
    fontSize: width < 768 ? 18 : 24,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    lineHeight: width < 768 ? 24 : 32,
  },
  
  // Subtitles
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.accent,
    lineHeight: 16,
  },
  
  // Body text
  bodyLarge: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Labels and captions
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 16,
  },
  
  // Interactive text
  button: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  link: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
    lineHeight: 20,
  },
};

// Spacing scale (8px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

// Border radius scale
export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};

// Responsive font size helper - more aggressive scaling for mobile
export const getResponsiveFontSize = (baseFontSize: number) => {
  if (width < 768) {
    // More aggressive scaling for mobile devices
    if (baseFontSize >= 18) {
      return Math.max(baseFontSize * 0.8, 14); // Scale down larger fonts more
    } else if (baseFontSize >= 16) {
      return Math.max(baseFontSize * 0.85, 13); // Medium fonts
    } else {
      return Math.max(baseFontSize * 0.9, 12); // Small fonts, minimum 12px
    }
  }
  return baseFontSize;
};

// Global component styles
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  safeArea: {
    flex: 1,
  },
  
  // Header styles (consistent across all views) - Smaller and more compact
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: width < 768 ? spacing.md : spacing.lg, // Smaller vertical padding on mobile
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'transparent',
  },
  
  headerTitle: {
    ...typography.headerMedium,
    // No margin bottom since we're removing subtitles
  },
  
  headerSubtitle: {
    ...typography.subtitle,
  },
  
  // Post card styles
  postCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  
  postGradient: {
    padding: spacing.lg,
  },
  
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  // User info styles
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  
  displayName: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  
  username: {
    ...typography.label,
    color: colors.accent,
  },
  
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  
  // Voice style badge
  voiceStyleBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  
  originalVoiceBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  
  voiceStyleText: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  
  originalVoiceText: {
    color: colors.accent,
    fontFamily: 'Inter-SemiBold',
  },
  
  // Content styles
  postContent: {
    ...typography.bodyMedium,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  
  // Audio controls
  audioContainer: {
    marginBottom: spacing.lg,
  },
  
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accent,
  },
  
  progressContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  
  progressTrack: {
    height: 4,
    backgroundColor: colors.borderSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  currentTime: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  
  totalTime: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  
  // Tags styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  
  tagButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  
  comedyTag: {
    backgroundColor: colors.comedyBackground,
    borderColor: colors.comedyBorder,
  },
  
  tagText: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  
  comedyTagText: {
    color: colors.comedy,
  },
  
  // Actions styles
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl, // Reduced gap for mobile
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // Reduced gap for mobile
    minHeight: 24,
    minWidth: 24,
  },
  
  actionText: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: getResponsiveFontSize(14), // Apply responsive sizing
  },
  
  actionTextActive: {
    color: colors.like,
  },
  
  // Loading states
  loadingContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.accent,
    borderTopColor: 'transparent',
  },
  
  // Tab styles
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  
  tabActive: {
    borderBottomColor: colors.accent,
  },
  
  tabText: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: getResponsiveFontSize(14), // Apply responsive sizing
  },
  
  tabTextActive: {
    color: colors.accent,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  
  secondaryButton: {
    backgroundColor: colors.borderSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButtonText: {
    ...typography.label,
    color: colors.textMuted,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  
  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl * 1.5,
    paddingHorizontal: spacing.xxxxl,
  },
  
  emptyStateText: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  
  emptyStateSubtext: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
  },
});

// Gradient presets
export const gradients = {
  primary: ['#8B5CF6', '#A855F7'],
  secondary: ['#A855F7', '#EC4899'],
  surface: ['#111111', '#1a1a1a'],
  surfaceElevated: ['#1a0f2e', '#2d1b4e'],
  background: ['#000000', '#1a0f2e'],
  muted: ['#4B5563', '#6B7280'],
};

export default globalStyles;
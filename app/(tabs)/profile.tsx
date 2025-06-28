import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import UserProfileInterface from '@/components/UserProfile/UserProfileInterface';
import { globalStyles, colors, gradients, spacing, getResponsiveFontSize } from '@/styles/globalStyles';

export default function ProfileScreen() {
  const { isAuthenticated, loading } = useAuth();

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <LinearGradient colors={gradients.background} style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { fontSize: getResponsiveFontSize(16) }]}>
              Loading profile...
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // If not authenticated, show message (shouldn't happen due to redirect above)
  if (!isAuthenticated) {
    return (
      <LinearGradient colors={gradients.background} style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(16) }]}>
              Please log in to view your profile
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Render the full profile interface for authenticated users
  return <UserProfileInterface />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    color: colors.error,
    textAlign: 'center',
  },
});
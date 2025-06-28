import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Settings, RefreshCw, LogOut, User, Mail, Calendar } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { makeAuthenticatedRequest } from '@/utils/api';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

interface ApiUser {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export default function ProfileScreen() {
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading]);

  // Fetch user profile from API
  const fetchUserProfile = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      console.log('Fetching user profile from API...');
      const response = await makeAuthenticatedRequest('/api/auth/me');
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User profile fetched successfully:', userData);
        setApiUser(userData);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch user profile:', response.status, errorData);
        setError(errorData.message || `Failed to fetch profile (${response.status})`);
      }
    } catch (error) {
      console.error('Network error fetching user profile:', error);
      setError('Network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authLoading]);

  const handleRefresh = () => {
    fetchUserProfile(true);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              router.replace('/login');
            } else {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <LinearGradient colors={gradients.background} style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeArea}>
          <View style={styles.centerContainer}>
            <Text style={[styles.loadingText, { fontSize: getResponsiveFontSize(16) }]}>
              Loading...
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
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(16) }]}>
              Please log in to view your profile
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { fontSize: getResponsiveFontSize(24) }]}>
            Profile
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleRefresh}
              disabled={loading || refreshing}>
              <RefreshCw 
                size={20} 
                color={loading || refreshing ? colors.textMuted : colors.textPrimary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSettings}>
              <Settings size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSignOut}>
              <LogOut size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          showsVerticalScrollIndicator={false}>
          
          {/* Loading State */}
          {loading && !refreshing && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { fontSize: getResponsiveFontSize(16) }]}>
                Loading profile...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(16) }]}>
                {error}
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => fetchUserProfile()}>
                <Text style={[styles.retryButtonText, { fontSize: getResponsiveFontSize(14) }]}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Content */}
          {apiUser && !loading && (
            <View style={styles.profileContent}>
              
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                {apiUser.avatar ? (
                  <Image source={{ uri: apiUser.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={40} color={colors.textMuted} />
                  </View>
                )}
              </View>

              {/* User Info Section */}
              <View style={styles.userInfoSection}>
                <Text style={[styles.displayName, { fontSize: getResponsiveFontSize(24) }]}>
                  {apiUser.displayName || apiUser.username || 'Unknown User'}
                </Text>
                
                {apiUser.username && (
                  <Text style={[styles.username, { fontSize: getResponsiveFontSize(16) }]}>
                    @{apiUser.username}
                  </Text>
                )}

                {apiUser.bio && (
                  <Text style={[styles.bio, { fontSize: getResponsiveFontSize(14) }]}>
                    {apiUser.bio}
                  </Text>
                )}
              </View>

              {/* Details Section */}
              <View style={styles.detailsSection}>
                <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                  Account Details
                </Text>

                {apiUser.email && (
                  <View style={styles.detailItem}>
                    <Mail size={16} color={colors.textMuted} />
                    <Text style={[styles.detailText, { fontSize: getResponsiveFontSize(14) }]}>
                      {apiUser.email}
                    </Text>
                  </View>
                )}

                <View style={styles.detailItem}>
                  <User size={16} color={colors.textMuted} />
                  <Text style={[styles.detailText, { fontSize: getResponsiveFontSize(14) }]}>
                    ID: {apiUser.id}
                  </Text>
                </View>

                {apiUser.createdAt && (
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={colors.textMuted} />
                    <Text style={[styles.detailText, { fontSize: getResponsiveFontSize(14) }]}>
                      Joined: {new Date(apiUser.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Raw API Data Section (for debugging) */}
              <View style={styles.debugSection}>
                <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18) }]}>
                  API Response (Debug)
                </Text>
                <View style={styles.debugContainer}>
                  <Text style={[styles.debugText, { fontSize: getResponsiveFontSize(12) }]}>
                    {JSON.stringify(apiUser, null, 2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  profileContent: {
    padding: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.border,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  displayName: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  username: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    flex: 1,
  },
  debugSection: {
    marginBottom: spacing.xxl,
  },
  debugContainer: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  debugText: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 16,
  },
});
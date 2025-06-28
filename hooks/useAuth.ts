import { useState, useEffect } from 'react';
import { getAuthToken, getUserData, clearAuthData, fetchUserProfile } from '@/utils/api';

interface User {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userData] = await Promise.all([
        getAuthToken(),
        getUserData(),
      ]);

      if (token) {
        setAuthState({
          isAuthenticated: true,
          user: userData,
          token,
          loading: false,
        });

        // Optionally fetch fresh user data from API
        if (userData) {
          fetchUserProfile().then((result) => {
            if (result.success) {
              setAuthState(prev => ({
                ...prev,
                user: result.data,
              }));
            }
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
    }
  };

  const signOut = async () => {
    try {
      await clearAuthData();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Failed to sign out' };
    }
  };

  const refreshUserData = async () => {
    if (!authState.isAuthenticated) return;

    try {
      const result = await fetchUserProfile();
      if (result.success) {
        setAuthState(prev => ({
          ...prev,
          user: result.data,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return {
    ...authState,
    signOut,
    refreshUserData,
    checkAuthStatus,
  };
}
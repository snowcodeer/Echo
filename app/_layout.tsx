import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { PlayProvider } from '@/contexts/PlayContext';
import { SaveProvider } from '@/contexts/SaveContext';
import { TranscriptionProvider } from '@/contexts/TranscriptionContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Check for existing auth token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // User is logged in, navigate to main app
          router.replace('/(tabs)');
        } else {
          // No token, navigate to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, default to login screen
        router.replace('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (fontsLoaded || fontError) {
      checkAuthStatus();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isCheckingAuth) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isCheckingAuth]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isCheckingAuth) {
    return null; // Keep splash screen visible while checking auth
  }

  return (
    <TranscriptionProvider>
      <SaveProvider>
        <PlayProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </PlayProvider>
      </SaveProvider>
    </TranscriptionProvider>
  );
}
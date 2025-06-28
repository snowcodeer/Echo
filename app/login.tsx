import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Eye, EyeOff, LogIn, Mic, Volume2, Users } from 'lucide-react-native';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

const API_BASE_URL = 'https://echo-api-90zm.onrender.com';

// Function to store token securely
const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    // Animate in the content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const loginData = {
        username: username.trim(),
        password: password.trim(),
        timestamp: new Date().toISOString(),
        platform: 'react-native',
        device: Platform.OS
      };

      console.log(`Making login request to: ${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(API_BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const textResult = await response.text();
        result = { message: textResult };
      }

      console.log('API Response:', result);
      console.log('Status:', response.status);

      if (response.ok) {
        console.log('Login successful!');
        
        const token = result.token || result.access_token || result.accessToken || result.authToken;
        
        if (token) {
          await storeToken(token);
          
          // Show success and navigate
          Alert.alert(
            'Welcome to Echo!', 
            'Login successful. Get ready to share your voice with the world.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  router.replace('/(tabs)');
                }
              }
            ]
          );
        } else {
          Alert.alert('Login Error', 'No authentication token received from server.');
        }
      } else if (response.status === 401) {
        Alert.alert(
          'Invalid Credentials',
          'The username or password you entered is incorrect. Please check your credentials and try again.'
        );
      } else if (response.status === 400) {
        Alert.alert(
          'Invalid Request',
          result.message || 'Please check your input and try again.'
        );
      } else if (response.status === 403) {
        Alert.alert(
          'Access Forbidden',
          'Your account may be disabled or you do not have permission to access this service.'
        );
      } else if (response.status === 500) {
        Alert.alert(
          'Server Error',
          'Something went wrong on our end. Please try again later.'
        );
      } else {
        Alert.alert(
          'Login Failed', 
          result.message || result.error || `Server returned status: ${response.status}`
        );
      }

    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        Alert.alert(
          'Connection Error', 
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } else {
        Alert.alert(
          'Error', 
          `An error occurred during login: ${error.message}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    Alert.alert(
      'Demo Mode',
      'This will log you in with demo credentials to explore the app.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Continue',
          onPress: async () => {
            // Store a demo token
            await storeToken('demo_token_' + Date.now());
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            
            <Animated.View 
              style={[
                styles.container,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}>
              
              {/* Hero Section */}
              <View style={styles.hero}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={gradients.primary}
                    style={styles.logoGradient}>
                    <Mic size={40} color={colors.textPrimary} strokeWidth={2} />
                  </LinearGradient>
                </View>
                
                <Text style={[styles.title, { fontSize: getResponsiveFontSize(36) }]}>
                  Echo
                </Text>
                <Text style={[styles.subtitle, { fontSize: getResponsiveFontSize(18) }]}>
                  Share your voice with the world
                </Text>
                
                {/* Feature highlights */}
                <View style={styles.features}>
                  <View style={styles.feature}>
                    <Volume2 size={16} color={colors.accent} />
                    <Text style={[styles.featureText, { fontSize: getResponsiveFontSize(14) }]}>
                      Voice-first social
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <Users size={16} color={colors.accent} />
                    <Text style={[styles.featureText, { fontSize: getResponsiveFontSize(14) }]}>
                      Connect authentically
                    </Text>
                  </View>
                </View>
              </View>

              {/* Login Form */}
              <View style={styles.form}>
                {/* Username Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontSize: getResponsiveFontSize(14) }]}>
                    Username
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.username && styles.inputError,
                      { fontSize: getResponsiveFontSize(16) }
                    ]}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (errors.username) {
                        setErrors(prev => ({ ...prev, username: undefined }));
                      }
                    }}
                    placeholder="Enter your username"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                  />
                  {errors.username && (
                    <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(12) }]}>
                      {errors.username}
                    </Text>
                  )}
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontSize: getResponsiveFontSize(14) }]}>
                    Password
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.passwordInput,
                        errors.password && styles.inputError,
                        { fontSize: getResponsiveFontSize(16) }
                      ]}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      accessibilityRole="button">
                      {showPassword ? (
                        <EyeOff size={20} color={colors.textMuted} />
                      ) : (
                        <Eye size={20} color={colors.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={[styles.errorText, { fontSize: getResponsiveFontSize(12) }]}>
                      {errors.password}
                    </Text>
                  )}
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    (isLoading || !username.trim() || !password.trim()) && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading || !username.trim() || !password.trim()}
                  accessibilityLabel="Sign in"
                  accessibilityRole="button">
                  <LinearGradient
                    colors={
                      (isLoading || !username.trim() || !password.trim())
                        ? gradients.muted
                        : gradients.primary
                    }
                    style={styles.loginButtonGradient}>
                    <LogIn size={20} color={colors.textPrimary} />
                    <Text style={[styles.loginButtonText, { fontSize: getResponsiveFontSize(16) }]}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Demo Mode Button */}
                <TouchableOpacity
                  style={styles.demoButton}
                  onPress={handleDemoLogin}
                  accessibilityLabel="Try demo mode"
                  accessibilityRole="button">
                  <Text style={[styles.demoButtonText, { fontSize: getResponsiveFontSize(14) }]}>
                    Try Demo Mode
                  </Text>
                </TouchableOpacity>

                {/* API Info */}
                <View style={styles.apiInfo}>
                  <Text style={[styles.apiText, { fontSize: getResponsiveFontSize(12) }]}>
                    Connected to: {API_BASE_URL}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxxl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing.xl,
  },
  features: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  featureText: {
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    paddingRight: 50,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  passwordToggle: {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: colors.error,
    marginTop: spacing.xs,
  },
  loginButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  demoButton: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    marginBottom: spacing.xl,
  },
  demoButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
  },
  apiInfo: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  apiText: {
    fontFamily: 'Inter-Regular',
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
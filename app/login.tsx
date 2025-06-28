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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
import { globalStyles, colors, gradients, spacing, borderRadius, getResponsiveFontSize } from '@/styles/globalStyles';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid credentials
      if (username.trim() && password.trim()) {
        // Navigate to main app
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { fontSize: getResponsiveFontSize(32) }]}>
                  Welcome to Echo
                </Text>
                <Text style={[styles.subtitle, { fontSize: getResponsiveFontSize(16) }]}>
                  Share your voice with the world
                </Text>
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

                {/* Demo Credentials */}
                <View style={styles.demoCredentials}>
                  <Text style={[styles.demoTitle, { fontSize: getResponsiveFontSize(14) }]}>
                    Demo Credentials
                  </Text>
                  <Text style={[styles.demoText, { fontSize: getResponsiveFontSize(12) }]}>
                    Username: demo
                  </Text>
                  <Text style={[styles.demoText, { fontSize: getResponsiveFontSize(12) }]}>
                    Password: password
                  </Text>
                </View>
              </View>
            </View>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxxl,
  },
  title: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
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
    marginBottom: spacing.xl,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.6,
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
  demoCredentials: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    alignItems: 'center',
  },
  demoTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  demoText: {
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    marginBottom: 2,
  },
});
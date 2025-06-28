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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
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

// Function to get stored token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Function to test the token with /api/auth/users endpoint
const testTokenWithUsers = async (token: string) => {
  try {
    console.log('Testing token with /api/auth/users endpoint...');
    const response = await fetch(API_BASE_URL + '/api/auth/users', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    console.log('Users endpoint response:', result);
    console.log('Users endpoint status:', response.status);

    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    console.error('Error testing token:', error);
    return { success: false, error: error.message };
  }
};

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
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Prepare login data
      const loginData = {
        username: username.trim(),
        password: password.trim(),
        timestamp: new Date().toISOString(),
        platform: 'react-native',
        device: Platform.OS
      };

      // Use the specific login endpoint
      const endpoint = '/api/auth/login';
      console.log(`Making login request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(API_BASE_URL + endpoint, {
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
        // If response isn't JSON, treat as text
        const textResult = await response.text();
        result = { message: textResult };
      }

      console.log('API Response:', result);
      console.log('Status:', response.status);
      console.log('Endpoint used:', endpoint);

      if (response.ok) {
        // Login successful - extract and store token
        console.log('Login successful! Full response:', result);
        
        // Extract token from response (try different common field names)
        const token = result.token || result.access_token || result.accessToken || result.authToken;
        
        // Store the token
        await storeToken(token);
        
        // Test the token with users endpoint
        const testResult = await testTokenWithUsers(token);
        
        Alert.alert(
          'Login Successful!', 
          `Token received and stored!\n\nToken: ${token.substring(0, 20)}...\n\nUsers endpoint test: ${testResult.success ? 'SUCCESS' : 'FAILED'}\n\nUsers data: ${JSON.stringify(testResult.data, null, 2)}`,
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate to main app
                router.replace('/(tabs)');
              }
            }
          ]
        );
      } else if (response.status === 401) {
        // Unauthorized - Invalid credentials
        Alert.alert(
          'Invalid Credentials',
          'The username or password you entered is incorrect. Please check your credentials and try again.',
          [
            {
              text: 'Try Again',
              style: 'default'
            }
          ]
        );
      } else if (response.status === 400) {
        // Bad Request - Usually validation errors
        Alert.alert(
          'Invalid Request',
          result.message || 'The request was invalid. Please check your input and try again.'
        );
      } else if (response.status === 403) {
        // Forbidden - Account might be disabled
        Alert.alert(
          'Access Forbidden',
          'Your account may be disabled or you do not have permission to access this service.'
        );
      } else if (response.status === 500) {
        // Server Error
        Alert.alert(
          'Server Error',
          'Something went wrong on our end. Please try again later.'
        );
      } else {
        // Other errors
        Alert.alert(
          'Login Failed', 
          result.message || result.error || `Server returned status: ${response.status}`
        );
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // Check if it's a network error
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

  // Test API connection on component mount
  React.useEffect(() => {
    const testAPIConnection = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();
        console.log('API Status Check:', result);
      } catch (error) {
        console.error('API connection test failed:', error);
      }
    };

    testAPIConnection();
  }, []);

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

                {/* API Info & Demo Credentials */}
                <View style={styles.demoCredentials}>
                  <Text style={[styles.demoTitle, { fontSize: getResponsiveFontSize(14) }]}>
                    API Integration
                  </Text>
                  <Text style={[styles.demoText, { fontSize: getResponsiveFontSize(12) }]}>
                    Endpoint: {API_BASE_URL}/api/auth/login
                  </Text>
                  <Text style={[styles.demoText, { fontSize: getResponsiveFontSize(12) }]}>
                    Token will be stored and tested with /api/auth/users
                  </Text>
                </View>

                {/* Test Token Button */}
                <TouchableOpacity
                  style={styles.testTokenButton}
                  onPress={async () => {
                    const storedToken = await getToken();
                    if (storedToken) {
                      const testResult = await testTokenWithUsers(storedToken);
                      Alert.alert(
                        'Token Test Result',
                        `Status: ${testResult.success ? 'SUCCESS' : 'FAILED'}\n\nResponse: ${JSON.stringify(testResult.data, null, 2)}`
                      );
                    } else {
                      Alert.alert('No Token', 'No stored token found. Please login first.');
                    }
                  }}>
                  <Text style={styles.testTokenText}>Test Stored Token</Text>
                </TouchableOpacity>
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
  testTokenButton: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    alignItems: 'center',
  },
  testTokenText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.accent,
    fontSize: 14,
  },
});
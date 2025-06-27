import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, User, Mail, MapPin, Link as LinkIcon } from 'lucide-react-native';
import { UserProfile, EditProfileData } from '@/types/user';
import { colors, spacing, borderRadius, typography, gradients } from '@/styles/globalStyles';

interface EditProfileModalProps {
  visible: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (data: EditProfileData) => Promise<{ success: boolean; error?: string }>;
}

export default function EditProfileModal({ 
  visible, 
  user, 
  onClose, 
  onSave 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<EditProfileData>({
    displayName: user.displayName,
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    preferences: { ...user.preferences },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EditProfileData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<EditProfileData> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 30) {
      newErrors.displayName = 'Display name must be 30 characters or less';
    }

    if (formData.bio.length > 250) {
      newErrors.bio = 'Bio must be 250 characters or less';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onSave(formData);
      if (result.success) {
        onClose();
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data to original values
    setFormData({
      displayName: user.displayName,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      preferences: { ...user.preferences },
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      
      <LinearGradient colors={gradients.background} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              disabled={loading}>
              <Save size={20} color={loading ? colors.textMuted : colors.accent} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <User size={16} color={colors.textMuted} />
                  <Text style={styles.inputLabel}>Display Name</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.displayName && styles.inputError]}
                  value={formData.displayName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
                  placeholder="Enter your display name"
                  placeholderTextColor={colors.textMuted}
                  maxLength={30}
                />
                {errors.displayName && (
                  <Text style={styles.errorText}>{errors.displayName}</Text>
                )}
                <Text style={styles.characterCount}>
                  {formData.displayName.length}/30
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Bio</Text>
                </View>
                <TextInput
                  style={[styles.textArea, errors.bio && styles.inputError]}
                  value={formData.bio}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  maxLength={250}
                />
                {errors.bio && (
                  <Text style={styles.errorText}>{errors.bio}</Text>
                )}
                <Text style={styles.characterCount}>
                  {formData.bio.length}/250
                </Text>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <MapPin size={16} color={colors.textMuted} />
                  <Text style={styles.inputLabel}>Location</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                  placeholder="City, Country"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <LinkIcon size={16} color={colors.textMuted} />
                  <Text style={styles.inputLabel}>Website</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.website && styles.inputError]}
                  value={formData.website}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
                  placeholder="https://yourwebsite.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="url"
                  autoCapitalize="none"
                />
                {errors.website && (
                  <Text style={styles.errorText}>{errors.website}</Text>
                )}
              </View>
            </View>

            {/* Privacy Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy Settings</Text>
              
              <View style={styles.switchGroup}>
                <View style={styles.switchHeader}>
                  <Text style={styles.switchLabel}>Private Account</Text>
                  <Text style={styles.switchDescription}>
                    Only approved followers can see your echoes
                  </Text>
                </View>
                <Switch
                  value={formData.preferences.isPrivate}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, isPrivate: value }
                  }))}
                  trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                  thumbColor={colors.textPrimary}
                />
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchHeader}>
                  <Text style={styles.switchLabel}>Allow Direct Messages</Text>
                  <Text style={styles.switchDescription}>
                    Let other users send you direct messages
                  </Text>
                </View>
                <Switch
                  value={formData.preferences.allowDirectMessages}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, allowDirectMessages: value }
                  }))}
                  trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                  thumbColor={colors.textPrimary}
                />
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchHeader}>
                  <Text style={styles.switchLabel}>Show Email Address</Text>
                  <Text style={styles.switchDescription}>
                    Display your email address on your profile
                  </Text>
                </View>
                <Switch
                  value={formData.preferences.showEmail}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, showEmail: value }
                  }))}
                  trackColor={{ false: colors.borderSecondary, true: colors.accent }}
                  thumbColor={colors.textPrimary}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headerSmall,
    color: colors.textPrimary,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
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
  sectionTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
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
  textArea: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  characterCount: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  switchHeader: {
    flex: 1,
    marginRight: spacing.lg,
  },
  switchLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
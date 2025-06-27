import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import VoiceRecorder from '@/components/VoiceRecorder';
import VoiceStylePicker from '@/components/VoiceStylePicker';
import { Square, Play, Pause, Send, Type, X, Mic } from 'lucide-react-native';
import { globalStyles, colors, gradients, spacing, borderRadius } from '@/styles/globalStyles';

const { width } = Dimensions.get('window');

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing';

export default function PostScreen() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState('original');
  const [isPosting, setIsPosting] = useState(false);

  // Text mode states
  const [textModeVisible, setTextModeVisible] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const generateTags = async (text: string) => {
    setIsGeneratingTags(true);
    try {
      // Fallback to local tag generation only
      const mockTags = [];
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('morning') || lowerText.includes('coffee')) {
        mockTags.push('morning');
      }
      if (lowerText.includes('motivation') || lowerText.includes('inspire')) {
        mockTags.push('motivation');
      }
      if (lowerText.includes('thought') || lowerText.includes('philosophy')) {
        mockTags.push('deepthoughts');
      }
      if (lowerText.includes('confession') || lowerText.includes('secret')) {
        mockTags.push('confession');
      }
      if (lowerText.includes('energy') || lowerText.includes('positive')) {
        mockTags.push('energy');
      }
      if (lowerText.includes('relationship') || lowerText.includes('love')) {
        mockTags.push('relationshipadvice');
      }
      if (lowerText.includes('funny') || lowerText.includes('joke') || lowerText.includes('laugh')) {
        mockTags.push('comedy');
      }
      
      // Ensure we have at least 3 tags but no more than 3
      const fallbackTags = ['mindfulness', 'reflection', 'storytelling', 'wisdom', 'growth'];
      while (mockTags.length < 3) {
        const randomTag = fallbackTags[Math.floor(Math.random() * fallbackTags.length)];
        if (!mockTags.includes(randomTag)) {
          mockTags.push(randomTag);
        }
      }
      
      setGeneratedTags(mockTags.slice(0, 3)); // Limit to maximum 3 tags
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleTextModeSubmit = async () => {
    if (!textContent.trim()) {
      Alert.alert('Error', 'Please enter some text to convert to speech.');
      return;
    }

    // Generate tags first
    await generateTags(textContent);
    
    // Post the content
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setTextModeVisible(false);
      setTextContent('');
      setGeneratedTags([]);
      Alert.alert('Success!', 'Your text has been posted to the feed.', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedVoiceStyle('original');
          },
        },
      ]);
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow microphone access to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setRecordingState('recording');

      // Timer for recording duration
      const startTime = Date.now();
      const timer = setInterval(() => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        setRecordingDuration(duration);
        
        // Auto-stop at 60 seconds
        if (duration >= 60) {
          stopRecording();
          clearInterval(timer);
        }
      }, 100);

      // Store timer reference for cleanup
      (newRecording as any).timer = timer;
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Clear timer
      if ((recording as any).timer) {
        clearInterval((recording as any).timer);
      }
      
      setRecording(null);
      setRecordingState('recorded');
      
      // Load the recorded sound for playback
      if (uri) {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playRecording = async () => {
    if (!sound) return;

    try {
      setRecordingState('playing');
      await sound.replayAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setRecordingState('recorded');
        }
      });
    } catch (error) {
      console.error('Error playing sound', error);
      setRecordingState('recorded');
    }
  };

  const pauseRecording = async () => {
    if (!sound) return;
    
    try {
      await sound.pauseAsync();
      setRecordingState('recorded');
    } catch (error) {
      console.error('Error pausing sound', error);
    }
  };

  const resetRecording = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    setRecordingState('idle');
    setRecordingDuration(0);
    setSelectedVoiceStyle('original');
  };

  const postRecording = async () => {
    setIsPosting(true);
    
    // Simulate posting with voice style processing
    setTimeout(() => {
      setIsPosting(false);
      Alert.alert('Success!', 'Your voice echo has been posted to the feed.', [
        {
          text: 'OK',
          onPress: resetRecording,
        },
      ]);
    }, 2000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient colors={gradients.background} style={globalStyles.container}>
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Simplified header - no subtitle */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>create echo</Text>
        </View>

        <View style={styles.content}>
          <VoiceRecorder
            isRecording={recordingState === 'recording'}
            duration={recordingDuration}
          />

          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>
              {formatDuration(recordingDuration)} / 1:00
            </Text>
          </View>

          <View style={styles.controlsContainer}>
            {recordingState === 'idle' && (
              <TouchableOpacity
                style={styles.recordButton}
                onPress={startRecording}>
                <LinearGradient
                  colors={gradients.primary}
                  style={styles.recordButtonGradient}>
                  <Mic size={40} color={colors.textPrimary} strokeWidth={2} />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {recordingState === 'recording' && (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopRecording}>
                <Square size={32} color={colors.textPrimary} fill={colors.textPrimary} />
              </TouchableOpacity>
            )}

            {(recordingState === 'recorded' || recordingState === 'playing') && (
              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={globalStyles.playButton}
                  onPress={recordingState === 'playing' ? pauseRecording : playRecording}>
                  {recordingState === 'playing' ? (
                    <Pause size={24} color={colors.textPrimary} />
                  ) : (
                    <Play size={24} color={colors.textPrimary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={globalStyles.secondaryButton}
                  onPress={resetRecording}>
                  <Text style={globalStyles.secondaryButtonText}>Re-record</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Text to Speech Option */}
          {recordingState === 'idle' && (
            <View style={styles.textToSpeechContainer}>
              <TouchableOpacity
                style={styles.textToSpeechButton}
                onPress={() => setTextModeVisible(true)}>
                <Type size={20} color={colors.accent} />
                <Text style={styles.textToSpeechText}>Text to Speech</Text>
              </TouchableOpacity>
            </View>
          )}

          {recordingState === 'recorded' && (
            <View style={styles.voiceStyleSection}>
              <Text style={styles.sectionTitle}>Choose Voice Style</Text>
              <VoiceStylePicker
                selectedStyle={selectedVoiceStyle}
                onStyleSelect={setSelectedVoiceStyle}
              />
            </View>
          )}

          {recordingState === 'recorded' && (
            <TouchableOpacity
              style={[globalStyles.primaryButton, styles.postButton, isPosting && styles.postButtonDisabled]}
              onPress={postRecording}
              disabled={isPosting}>
              <LinearGradient
                colors={isPosting ? gradients.muted : gradients.primary}
                style={styles.postButtonGradient}>
                <Send size={20} color={colors.textPrimary} />
                <Text style={globalStyles.primaryButtonText}>
                  {isPosting ? 'Posting...' : 'Post Echo'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Text Mode Modal */}
        <Modal
          visible={textModeVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setTextModeVisible(false)}>
          <LinearGradient colors={gradients.background} style={globalStyles.container}>
            <SafeAreaView style={globalStyles.safeArea}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Text Post</Text>
                <TouchableOpacity
                  onPress={() => setTextModeVisible(false)}
                  style={styles.closeButton}>
                  <X size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.textInputContainer}>
                  <Text style={styles.inputLabel}>Enter your text</Text>
                  <TextInput
                    style={[globalStyles.input, styles.textInput]}
                    placeholder="Share your thoughts..."
                    placeholderTextColor={colors.textMuted}
                    value={textContent}
                    onChangeText={setTextContent}
                    multiline
                    numberOfLines={8}
                    maxLength={750}
                  />
                  <Text style={styles.characterCount}>
                    {textContent.length}/750 characters
                  </Text>
                </View>

                {textContent.length > 0 && (
                  <View style={styles.voiceStyleSection}>
                    <Text style={styles.sectionTitle}>Choose Voice Style</Text>
                    <VoiceStylePicker
                      selectedStyle={selectedVoiceStyle}
                      onStyleSelect={setSelectedVoiceStyle}
                    />
                  </View>
                )}

                {generatedTags.length > 0 && (
                  <View style={styles.tagsSection}>
                    <Text style={styles.sectionTitle}>Generated Tags (Max 3)</Text>
                    <View style={globalStyles.tagsContainer}>
                      {generatedTags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={globalStyles.tagButton}>
                          <Text style={globalStyles.tagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {isGeneratingTags && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Generating tags...</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[
                    globalStyles.primaryButton,
                    (!textContent.trim() || isGeneratingTags || isPosting) && styles.submitButtonDisabled
                  ]}
                  onPress={handleTextModeSubmit}
                  disabled={!textContent.trim() || isGeneratingTags || isPosting}>
                  <LinearGradient
                    colors={
                      (!textContent.trim() || isGeneratingTags || isPosting)
                        ? gradients.muted
                        : gradients.primary
                    }
                    style={styles.submitButtonGradient}>
                    <Send size={20} color={colors.textPrimary} />
                    <Text style={globalStyles.primaryButtonText}>
                      {isPosting ? 'Posting...' : 'Post'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Only keeping styles that are unique to this component and not covered by globalStyles
const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxxxl,
  },
  durationText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  recordButton: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  recordButtonGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  textToSpeechContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  textToSpeechButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    gap: spacing.sm,
  },
  textToSpeechText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  voiceStyleSection: {
    width: '100%',
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  postButton: {
    width: '100%',
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  // Modal styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 24,
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
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },
  textInputContainer: {
    marginBottom: spacing.xxl,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  textInput: {
    textAlignVertical: 'top',
    minHeight: 140,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.sm,
  },
  tagsSection: {
    marginBottom: spacing.xxl,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.accent,
  },
  modalFooter: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
});
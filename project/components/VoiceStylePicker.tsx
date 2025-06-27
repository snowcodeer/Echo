import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface VoiceStyle {
  id: string;
  name: string;
  color: string[];
}

const voiceStyles: VoiceStyle[] = [
  {
    id: 'original',
    name: 'Original',
    color: ['#4B5563', '#6B7280'],
  },
  {
    id: 'chill-narrator',
    name: 'Chill Narrator',
    color: ['#6366F1', '#8B5CF6'],
  },
  {
    id: 'energetic-host',
    name: 'Energetic Host',
    color: ['#7C3AED', '#A855F7'],
  },
  {
    id: 'wise-storyteller',
    name: 'Wise Storyteller',
    color: ['#8B5CF6', '#A855F7'],
  },
  {
    id: 'friendly-guide',
    name: 'Friendly Guide',
    color: ['#6366F1', '#8B5CF6'],
  },
  {
    id: 'dramatic-reader',
    name: 'Dramatic Reader',
    color: ['#7C2D12', '#A855F7'],
  },
  {
    id: 'whisper',
    name: 'Whisper',
    color: ['#374151', '#6B7280'],
  },
];

interface VoiceStylePickerProps {
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
}

export default function VoiceStylePicker({
  selectedStyle,
  onStyleSelect,
}: VoiceStylePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {voiceStyles.map((style) => (
        <TouchableOpacity
          key={style.id}
          style={[
            styles.styleCard,
            selectedStyle === style.id && styles.styleCardSelected,
          ]}
          onPress={() => onStyleSelect(style.id)}>
          <LinearGradient
            colors={style.color}
            style={[
              styles.gradient,
              selectedStyle === style.id && styles.gradientSelected,
            ]}>
            <Text style={styles.styleName}>{style.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    gap: 12,
  },
  styleCard: {
    width: 120,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  styleCardSelected: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  gradientSelected: {
    opacity: 1,
  },
  styleName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
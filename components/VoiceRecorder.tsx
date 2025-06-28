import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface VoiceRecorderProps {
  isRecording: boolean;
  duration: number;
}

export default function VoiceRecorder({ isRecording, duration }: VoiceRecorderProps) {
  const pulseAnimation = useSharedValue(0);
  const waveAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (isRecording) {
      // Pulse animation for the outer ring
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );

      // Wave animation for visual feedback
      waveAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 300 }),
          withTiming(0.8, { duration: 200 }),
          withTiming(0.1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      pulseAnimation.value = withTiming(0, { duration: 300 });
      waveAnimation.value = withTiming(0, { duration: 300 });
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.3]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.3, 0]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const waveStyle = useAnimatedStyle(() => {
    const scale = interpolate(waveAnimation.value, [0, 1], [0.8, 1.2]);
    
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Outer pulse ring */}
      <Animated.View style={[styles.pulseRing, pulseStyle]}>
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.pulseGradient}
        />
      </Animated.View>

      {/* Recording indicator */}
      <Animated.View style={[styles.recordingIndicator, waveStyle]}>
        <LinearGradient
          colors={isRecording ? ['#DC2626', '#EF4444'] : ['#374151', '#4B5563']}
          style={styles.indicatorGradient}>
          <View style={styles.innerCircle} />
        </LinearGradient>
      </Animated.View>

      {/* Visual waves around the recorder */}
      {isRecording && (
        <View style={styles.wavesContainer}>
          {[...Array(5)].map((_, index) => (
            <WaveRing key={index} delay={index * 200} />
          ))}
        </View>
      )}
    </View>
  );
}

interface WaveRingProps {
  delay: number;
}

function WaveRing({ delay }: WaveRingProps) {
  const waveValue = useSharedValue(0);

  React.useEffect(() => {
    const startAnimation = () => {
      waveValue.value = withRepeat(
        withSequence(
          withTiming(0, { duration: delay }),
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const waveStyle = useAnimatedStyle(() => {
    const scale = interpolate(waveValue.value, [0, 1], [0.5, 2]);
    const opacity = interpolate(waveValue.value, [0, 0.2, 1], [0, 0.3, 0]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.waveRing, waveStyle]}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.waveGradient}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  pulseGradient: {
    flex: 1,
    borderRadius: 70,
  },
  recordingIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  wavesContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  waveGradient: {
    flex: 1,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
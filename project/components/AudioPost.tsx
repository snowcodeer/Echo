import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';
import { Post } from '@/data/postsDatabase';
import { globalStyles, colors, spacing, borderRadius } from '@/styles/globalStyles';

const { width } = Dimensions.get('window');

interface AudioPostProps {
  post: Post;
  isActive: boolean;
  onPlayToggle: (postId: string) => void;
}

export default function AudioPost({ post, isActive, onPlayToggle }: AudioPostProps) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Simulate progress for demo
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= post.duration) {
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setCurrentTime(0);
    }
  }, [isActive, post.duration]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentTime / post.duration;

  return (
    <View style={[styles.container, isActive && styles.containerActive]}>
      <LinearGradient
        colors={isActive ? ['#1a0f2e', '#2d1b4e'] : ['#111111', '#1a1a1a']}
        style={globalStyles.postGradient}>
        
        <View style={globalStyles.postHeader}>
          <View style={globalStyles.userInfo}>
            <View style={styles.avatar}>
              <User size={16} color={colors.accent} />
            </View>
            <View>
              <Text style={globalStyles.displayName}>{post.displayName}</Text>
              <Text style={globalStyles.username}>{post.username}</Text>
            </View>
          </View>
          <Text style={globalStyles.timestamp}>{post.timestamp}</Text>
        </View>

        {/* Voice Style Badge - using globalStyles */}
        <View style={styles.voiceStyleContainer}>
          <View style={globalStyles.voiceStyleBadge}>
            <Text style={globalStyles.voiceStyleText}>{post.voiceStyle}</Text>
          </View>
        </View>

        {/* Content Text - using globalStyles */}
        <Text style={globalStyles.postContent}>{post.content}</Text>

        {/* Progress Bar - using globalStyles */}
        <View style={globalStyles.audioContainer}>
          <View style={globalStyles.progressContainer}>
            <View style={globalStyles.progressTrack}>
              <View 
                style={[
                  globalStyles.progressFill, 
                  { 
                    width: `${progress * 100}%`,
                    backgroundColor: isActive ? colors.accent : colors.borderSecondary
                  }
                ]} 
              />
            </View>
            <View style={globalStyles.timeContainer}>
              <Text style={globalStyles.currentTime}>
                {formatDuration(currentTime)}
              </Text>
              <Text style={globalStyles.totalTime}>
                {formatDuration(post.duration)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tags Section - using globalStyles */}
        <View style={globalStyles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={globalStyles.tagButton}>
              <Text style={globalStyles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          {/* Footer content if needed */}
        </View>
      </LinearGradient>
    </View>
  );
}

// Only keeping styles that are unique to this component and not covered by globalStyles
const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  containerActive: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceStyleContainer: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
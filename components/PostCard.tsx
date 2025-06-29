import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Headphones, 
  Share, 
  Download, 
  Play, 
  Pause, 
  X, 
  Bookmark,
  BookmarkCheck,
} from 'lucide-react-native';
import { Post } from '@/data/postsDatabase';
import { usePlay } from '@/contexts/PlayContext';
import { useSave } from '@/contexts/SaveContext';
import { useTranscription } from '@/contexts/TranscriptionContext';
import { globalStyles, colors, gradients, spacing, borderRadius } from '@/styles/globalStyles';

interface PostCardProps {
  post: Post;
  playProgress?: number;
  onPlay?: (postId: string, duration: number) => void;
  onStop?: (postId: string) => void;
  isFeatured?: boolean;
}

export default function PostCard({
  post,
  playProgress = 0,
  onPlay,
  onStop,
  isFeatured = false,
}: PostCardProps) {
  const { currentlyPlaying, getPlayCount } = usePlay();
  const { transcriptionsEnabled } = useTranscription();
  const { 
    downloadPost, 
    removeDownload, 
    savePost, 
    unsavePost,
    savedPosts,
    isDownloaded, 
    isDownloading 
  } = useSave();

  const handleSave = async () => {
    const isInSavedPosts = savedPosts.some(p => p.id === post.id);
    
    if (isInSavedPosts) {
      await unsavePost(post.id);
    } else {
      await savePost(post, true);
    }
  };

  const handleDownload = async () => {
    if (isDownloaded(post.id)) {
      await removeDownload(post.id);
    } else {
      await downloadPost(post);
    }
  };

  const handlePlay = () => {
    if (currentlyPlaying === post.id) {
      onStop?.(post.id);
    } else {
      onPlay?.(post.id, post.duration);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if post is in saved posts (not commute queue)
  const isInSavedPosts = savedPosts.some(p => p.id === post.id);

  // Use purple gradient for featured posts, regular gradient for others
  const gradientColors = isFeatured ? gradients.surfaceElevated : gradients.surface;

  return (
    <View style={[globalStyles.postCard, { marginHorizontal: spacing.xl }]}>
      <LinearGradient
        colors={gradientColors}
        style={globalStyles.postGradient}>
        
        <View style={globalStyles.postHeader}>
          <View style={globalStyles.userInfo}>
            <Image source={{ uri: post.avatar }} style={globalStyles.avatar} />
            <View>
              <Text style={globalStyles.displayName}>{post.displayName}</Text>
              <Text style={globalStyles.username}>{post.username}</Text>
            </View>
          </View>
          <Text style={globalStyles.timestamp}>{post.timestamp}</Text>
        </View>

        {/* Voice Style Badge */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={[
            globalStyles.voiceStyleBadge,
            post.voiceStyle === 'Original' && globalStyles.originalVoiceBadge
          ]}>
            <Text style={[
              globalStyles.voiceStyleText,
              post.voiceStyle === 'Original' && globalStyles.originalVoiceText
            ]}>
              {post.voiceStyle}
            </Text>
          </View>
        </View>

        {/* Content - Only show if transcriptions are enabled */}
        {transcriptionsEnabled && (
          <Text style={globalStyles.postContent}>
            {post.content}
          </Text>
        )}

        {/* Simple Audio Controls - Just Play Button and Duration */}
        <View style={globalStyles.audioContainer}>
          <View style={globalStyles.audioControls}>
            <TouchableOpacity
              style={globalStyles.playButton}
              onPress={handlePlay}>
              {currentlyPlaying === post.id ? (
                <Pause size={20} color={colors.textPrimary} />
              ) : (
                <Play size={20} color={colors.textPrimary} />
              )}
            </TouchableOpacity>
            
            <View style={globalStyles.progressContainer}>
              <Text style={globalStyles.totalTime}>{formatDuration(post.duration)}</Text>
            </View>
          </View>
        </View>

        {/* Tags Section - Limited to 3 tags maximum */}
        <View style={globalStyles.tagsContainer}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                globalStyles.tagButton,
                tag === 'comedy' && globalStyles.comedyTag
              ]}
              activeOpacity={0.7}>
              <Text style={[
                globalStyles.tagText,
                tag === 'comedy' && globalStyles.comedyTagText
              ]}>
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions Container - Single Row */}
        <View style={globalStyles.actionsContainer}>
          {/* Listen Count Display */}
          <View style={globalStyles.actionButton}>
            <Headphones
              size={20}
              color={colors.textMuted}
            />
            <Text style={globalStyles.actionText}>
              {getPlayCount(post.id)}
            </Text>
          </View>

          <TouchableOpacity style={globalStyles.actionButton}>
            <Share size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Independent Save Button - Only affects saved posts, NOT commute queue */}
          <TouchableOpacity 
            style={globalStyles.actionButton}
            onPress={handleSave}>
            {isInSavedPosts ? (
              <BookmarkCheck size={20} color={colors.bookmark} fill={colors.bookmark} />
            ) : (
              <Bookmark size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {/* Independent Download Button - Only affects commute queue */}
          <TouchableOpacity 
            style={globalStyles.actionButton}
            onPress={handleDownload}>
            {isDownloading(post.id) ? (
              <View style={globalStyles.loadingContainer}>
                <View style={globalStyles.loadingSpinner} />
              </View>
            ) : isDownloaded(post.id) ? (
              <View style={{ 
                width: 20, 
                height: 20, 
                borderRadius: 10, 
                backgroundColor: 'rgba(220, 38, 38, 0.15)', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <X size={20} color={colors.error} />
              </View>
            ) : (
              <Download size={20} color={colors.download} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
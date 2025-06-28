import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Download, 
  Play, 
  Pause, 
  X, 
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import { Post } from '@/data/postsDatabase';
import { useLike } from '@/contexts/LikeContext';
import { usePlay } from '@/contexts/PlayContext';
import { useSave } from '@/contexts/SaveContext';
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
  const [showReplies, setShowReplies] = useState(false);
  
  const { toggleLike, isLiked } = useLike();
  const { currentlyPlaying } = usePlay();
  const { 
    downloadPost, 
    removeDownload, 
    savePost, 
    unsavePost,
    savedPosts,
    commuteQueue,
    isDownloaded, 
    isDownloading 
  } = useSave();

  const handleLike = () => {
    const currentlyLiked = isLiked(post.id);
    
    toggleLike(post.id, {
      id: post.id,
      username: post.username,
      displayName: post.displayName,
      avatar: post.avatar,
      content: post.content,
      likes: currentlyLiked ? post.likes - 1 : post.likes + 1,
      replies: post.replies,
      timestamp: post.timestamp,
      tags: post.tags,
      voiceStyle: post.voiceStyle,
      duration: post.duration,
    });
  };

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

  const formatCurrentTime = (progress: number, duration: number) => {
    const currentSeconds = Math.floor(progress * duration);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
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

        {/* Content */}
        <Text style={globalStyles.postContent}>
          {post.content}
        </Text>

        {/* Audio Progress with Play Button */}
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
              <View style={globalStyles.progressTrack}>
                <View style={[
                  globalStyles.progressFill, 
                  { width: `${playProgress * 100}%` }
                ]} />
              </View>
              <View style={globalStyles.timeContainer}>
                <Text style={globalStyles.currentTime}>
                  {formatCurrentTime(playProgress, post.duration)}
                </Text>
                <Text style={globalStyles.totalTime}>{formatDuration(post.duration)}</Text>
              </View>
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
          <TouchableOpacity
            style={globalStyles.actionButton}
            onPress={handleLike}>
            <Heart
              size={20}
              color={isLiked(post.id) ? colors.like : colors.textMuted}
              fill={isLiked(post.id) ? colors.like : 'transparent'}
            />
            <Text style={[
              globalStyles.actionText, 
              isLiked(post.id) && globalStyles.actionTextActive
            ]}>
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.actionButton}
            onPress={() => post.hasReplies && setShowReplies(!showReplies)}>
            <MessageCircle size={20} color={colors.textMuted} />
            <Text style={globalStyles.actionText}>
              {post.hasReplies ? post.replyPosts?.length || 0 : post.replies}
            </Text>
            {post.hasReplies && (
              showReplies ? (
                <ChevronUp size={16} color={colors.textMuted} />
              ) : (
                <ChevronDown size={16} color={colors.textMuted} />
              )
            )}
          </TouchableOpacity>

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

        {/* Replies Section - Threads-style interface */}
        {post.hasReplies && showReplies && post.replyPosts && (
          <View style={{ marginTop: spacing.xl }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: spacing.lg, 
              gap: spacing.md 
            }}>
              <View style={{ height: 1, flex: 1, backgroundColor: colors.borderSecondary }} />
              <Text style={{ 
                fontSize: 14, 
                fontFamily: 'Inter-SemiBold', 
                color: colors.textMuted, 
                paddingHorizontal: spacing.md 
              }}>
                Replies
              </Text>
            </View>
            
            {post.replyPosts.map((reply, index) => (
              <View key={reply.id} style={{ flexDirection: 'row', marginBottom: spacing.md }}>
                <View style={{ 
                  width: 24, 
                  alignItems: 'center', 
                  marginRight: spacing.md 
                }}>
                  <View style={{ 
                    width: 2, 
                    height: '100%', 
                    backgroundColor: colors.borderSecondary, 
                    position: 'absolute', 
                    top: 0 
                  }} />
                  <View style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: 4, 
                    backgroundColor: colors.accent, 
                    marginTop: spacing.sm 
                  }} />
                </View>
                
                <View style={{ flex: 1, borderRadius: borderRadius.md, overflow: 'hidden' }}>
                  <LinearGradient
                    colors={['#0a0a0a', '#1a1a1a']}
                    style={{ padding: spacing.md }}>
                    
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: spacing.sm 
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Image source={{ uri: reply.avatar }} style={{ width: 28, height: 28, borderRadius: 14 }} />
                        <View>
                          <Text style={{ fontSize: 14, fontFamily: 'Inter-SemiBold', color: colors.textPrimary }}>
                            {reply.displayName}
                          </Text>
                          <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: colors.accent }}>
                            {reply.username}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 11, fontFamily: 'Inter-Regular', color: colors.textMuted }}>
                        {reply.timestamp}
                      </Text>
                    </View>

                    <Text style={{ 
                      fontSize: 14, 
                      fontFamily: 'Inter-Regular', 
                      color: colors.textSecondary, 
                      lineHeight: 20, 
                      marginBottom: spacing.md 
                    }}>
                      {reply.content}
                    </Text>

                    {/* Reply Audio Controls */}
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      gap: spacing.sm, 
                      marginBottom: spacing.sm 
                    }}>
                      <TouchableOpacity
                        style={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: 14, 
                          backgroundColor: colors.accent, 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                        onPress={() => onPlay?.(reply.id, reply.duration)}>
                        {currentlyPlaying === reply.id ? (
                          <Pause size={16} color={colors.textPrimary} />
                        ) : (
                          <Play size={16} color={colors.textPrimary} />
                        )}
                      </TouchableOpacity>
                      <Text style={{ 
                        fontSize: 12, 
                        fontFamily: 'Inter-Medium', 
                        color: colors.textMuted 
                      }}>
                        {formatDuration(reply.duration)}
                      </Text>
                    </View>

                    {/* Reply Tags */}
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
                      {reply.tags.slice(0, 2).map((tag, tagIndex) => (
                        <View key={tagIndex} style={{ 
                          backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                          paddingHorizontal: spacing.sm, 
                          paddingVertical: 2, 
                          borderRadius: spacing.sm 
                        }}>
                          <Text style={{ 
                            fontSize: 10, 
                            fontFamily: 'Inter-Medium', 
                            color: colors.accent 
                          }}>
                            #{tag}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Reply Actions */}
                    <View style={{ flexDirection: 'row', gap: spacing.lg }}>
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                        <Heart size={16} color={colors.textMuted} />
                        <Text style={{ 
                          fontSize: 12, 
                          fontFamily: 'Inter-Medium', 
                          color: colors.textMuted 
                        }}>
                          {reply.likes}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                        <Share size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
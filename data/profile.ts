// Profile data management for user posts and activity
import { Post } from './postsDatabase';

export interface UserPost extends Post {
  isUserPost: boolean;
  createdVia: 'voice' | 'text-to-speech';
  originalText?: string; // For text-to-speech posts
}

// In-memory storage for user posts (in a real app, this would be in a database)
let userPosts: UserPost[] = [];

// Get all user posts
export function getUserPosts(): UserPost[] {
  return [...userPosts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Add a new user post
export function addUserPost(post: Omit<UserPost, 'id' | 'createdAt' | 'listenCount'>): UserPost {
  const newPost: UserPost = {
    ...post,
    id: `user_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    listenCount: 0, // Start with 0 listens for new posts
  };
  
  userPosts.unshift(newPost); // Add to beginning of array
  return newPost;
}

// Get user post count
export function getUserPostCount(): number {
  return userPosts.length;
}

// Remove a user post
export function removeUserPost(postId: string): boolean {
  const initialLength = userPosts.length;
  userPosts = userPosts.filter(post => post.id !== postId);
  return userPosts.length < initialLength;
}

// Update a user post
export function updateUserPost(postId: string, updates: Partial<UserPost>): UserPost | null {
  const postIndex = userPosts.findIndex(post => post.id === postId);
  if (postIndex === -1) return null;
  
  userPosts[postIndex] = { ...userPosts[postIndex], ...updates };
  return userPosts[postIndex];
}

// Get user stats
export function getUserStats() {
  const totalPosts = userPosts.length;
  const totalListens = userPosts.reduce((sum, post) => sum + (post.listenCount || 0), 0);
  const totalReplies = userPosts.reduce((sum, post) => sum + post.replies, 0);
  
  return {
    totalPosts,
    totalListens,
    totalReplies,
    averageListensPerPost: totalPosts > 0 ? Math.round(totalListens / totalPosts) : 0,
  };
}

// Clear all user posts (for testing/reset purposes)
export function clearUserPosts(): void {
  userPosts = [];
}
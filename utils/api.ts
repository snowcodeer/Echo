import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://echo-api-90zm.onrender.com';

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
};

// Get stored authentication token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Get stored user data
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Clear authentication data
export const clearAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Make authenticated API request
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

// Get user profile from API
export const fetchUserProfile = async () => {
  try {
    const response = await makeAuthenticatedRequest('/api/auth/me');
    
    if (response.ok) {
      const userData = await response.json();
      console.log('User profile fetched successfully:', userData);
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      return { success: true, data: userData };
    } else {
      const errorData = await response.json();
      console.error('Failed to fetch user profile:', response.status, errorData);
      return { success: false, error: errorData.message || 'Failed to fetch profile' };
    }
  } catch (error) {
    console.error('Network error fetching user profile:', error);
    return { success: false, error: 'Network error occurred' };
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};

// Login function
export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      const token = result.token || result.access_token || result.accessToken;
      
      if (token) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        
        if (result.user) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.user));
        }
        
        return { success: true, token, user: result.user };
      } else {
        return { success: false, error: 'No token received' };
      }
    } else {
      return { success: false, error: result.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error occurred' };
  }
};

// Logout function
export const logout = async () => {
  try {
    await clearAuthData();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
};

// Example of other authenticated API calls (using mock data for now)
export const fetchUserPosts = async () => {
  try {
    // For now, return mock data as requested
    // In the future, this would make a real API call:
    // const response = await makeAuthenticatedRequest('/api/user/posts');
    
    console.log('fetchUserPosts called - using mock data for now');
    return { success: true, data: [] }; // Mock empty array
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { success: false, error: 'Failed to fetch posts' };
  }
};

export const createPost = async (postData: any) => {
  try {
    // For now, return mock success as requested
    // In the future, this would make a real API call:
    // const response = await makeAuthenticatedRequest('/api/posts', {
    //   method: 'POST',
    //   body: JSON.stringify(postData),
    // });
    
    console.log('createPost called with data:', postData, '- using mock success for now');
    return { success: true, data: { id: Date.now().toString(), ...postData } };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
};
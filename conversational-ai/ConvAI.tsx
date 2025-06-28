"use dom";
import { useCallback } from "react";
import { useConversation } from "@11labs/react";
import { View, Pressable, StyleSheet, Platform, Alert } from "react-native";
import { Audio } from 'expo-av';
import type { Message } from "../conversational-ai/ChatMessage";
import { Mic } from "lucide-react-native";

async function requestMicrophonePermission() {
  try {
    if (Platform.OS === 'web') {
      // Web platform - use navigator.mediaDevices
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } else {
      // Native platforms (iOS/Android) - use expo-av
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        return true;
      } else {
        // Show platform-appropriate error message
        if (Platform.OS === 'ios') {
          Alert.alert(
            'Microphone Permission Required',
            'Please enable microphone access in Settings > Privacy & Security > Microphone to use voice features.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => {
                // On iOS, we can't directly open settings, but we can show instructions
                Alert.alert(
                  'Enable Microphone Access',
                  '1. Go to Settings\n2. Tap Privacy & Security\n3. Tap Microphone\n4. Find your app and toggle it on'
                );
              }}
            ]
          );
        } else {
          Alert.alert(
            'Microphone Permission Required',
            'Please enable microphone access in your device settings to use voice features.'
          );
        }
        return false;
      }
    }
  } catch (error) {
    console.error('Microphone permission error:', error);
    
    if (Platform.OS === 'web') {
      Alert.alert(
        'Microphone Access Denied',
        'Please allow microphone access in your browser to use voice features.'
      );
    } else {
      Alert.alert(
        'Permission Error',
        'Unable to access microphone. Please check your device settings.'
      );
    }
    return false;
  }
}

export default function ConvAiDOMComponent({
  platform,
  onMessage,
}: {
  dom?: import("expo/dom").DOMProps;
  platform: string;
  onMessage: (message: Message) => void;
}) {
  const conversation = useConversation({
    onConnect: () => console.log("Connected to AI conversation"),
    onDisconnect: () => console.log("Disconnected from AI conversation"),
    onMessage: message => {
      console.log("AI message received:", message);
      onMessage(message);
    },
    onError: error => {
      console.error("AI conversation error:", error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to AI assistant. Please try again.'
      );
    },
  });
  
  const startConversation = useCallback(async () => {
    try {
      console.log(`Requesting microphone permission on ${Platform.OS}...`);
      
      // Request microphone permission with platform-specific handling
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        console.log('Microphone permission denied');
        return;
      }

      console.log('Microphone permission granted, starting AI session...');
      
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_01jyps63m8f6m900dy1j0hhzg8", // Replace with your agent ID
        dynamicVariables: {
          platform: Platform.OS,
          appVersion: '1.0.0',
        },
        clientTools: {
          logMessage: async ({ message }) => {
            console.log('AI Tool Log:', message);
          },
        },
      });
      
      console.log('AI conversation session started successfully');
    } catch (error) {
      console.error("Failed to start AI conversation:", error);
      Alert.alert(
        'Connection Failed',
        'Unable to start voice conversation. Please check your internet connection and try again.'
      );
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      console.log('Ending AI conversation session...');
      await conversation.endSession();
      console.log('AI conversation session ended');
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";

  return (
    <Pressable
      style={[
        styles.micButton,
        isConnected && styles.micButtonActive,
        isConnecting && styles.micButtonConnecting,
      ]}
      onPress={isConnected ? stopConversation : startConversation}
      disabled={isConnecting}
      accessibilityLabel={
        isConnected 
          ? "Stop voice conversation" 
          : isConnecting 
            ? "Connecting to AI assistant"
            : "Start voice conversation"
      }
      accessibilityRole="button"
    >
      <Mic
        size={24}
        color={isConnected ? "#FFFFFF" : "#8B5CF6"}
        strokeWidth={2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    // Smooth transition for state changes
    ...Platform.select({
      web: {
        transition: "all 0.2s ease-in-out",
      },
      default: {},
    }),
  },
  micButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
    // Add subtle pulse effect when active
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  micButtonConnecting: {
    backgroundColor: "rgba(139, 92, 246, 0.5)",
    borderColor: "#8B5CF6",
    opacity: 0.7,
  },
});
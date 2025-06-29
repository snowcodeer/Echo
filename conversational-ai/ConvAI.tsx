"use dom";
import { useCallback, useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { View, Pressable, StyleSheet } from "react-native";
import type { Message } from "../conversational-ai/ChatMessage";
import { Mic } from "lucide-react-native";

async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately since we just needed permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error("Microphone permission error:", error);
    
    if (error.name === 'NotAllowedError') {
      console.error("User denied microphone permission");
      // Show user-friendly message about going to Settings
      alert("Please enable microphone access in Settings > Privacy & Security > Microphone");
    } else if (error.name === 'NotFoundError') {
      alert("No microphone found on this device");
    } else if (error.name === 'NotReadableError') {
      alert("Microphone is already in use by another application");
    } else {
      alert("Unable to access microphone. Please check your device settings.");
    }
    
    return false;
  }
}

// Function to extract content after "echo me"
function extractEchoContent(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') {
    return null;
  }
  
  // Convert to lowercase for case-insensitive matching
  const lowerMessage = userMessage.toLowerCase();
  const trigger = 'echo me';
  
  // Find the position of "echo me"
  const triggerIndex = lowerMessage.indexOf(trigger);
  
  if (triggerIndex === -1) {
    return null; // "echo me" not found
  }
  
  // Extract content after "echo me" (including the space after)
  const startIndex = triggerIndex + trigger.length;
  const extractedContent = userMessage.substring(startIndex).trim();
  
  return extractedContent || null; // Return null if empty after trimming
}

export default function ConvAiDOMComponent({
  platform,
  onMessage,
  onEchoContentExtracted,
}: {
  dom?: import("expo/dom").DOMProps;
  platform: string;
  onMessage: (message: Message) => void;
  onEchoContentExtracted?: (content: string) => void;
}) {
  // State to store extracted echo content
  const [echoContent, setEchoContent] = useState(null);

  // Watch for changes in echoContent and notify parent
  useEffect(() => {
    if (echoContent && onEchoContentExtracted) {
      console.log("🚀 Notifying parent of echo content:", echoContent);
      onEchoContentExtracted(echoContent);
    }
  }, [echoContent, onEchoContentExtracted]);

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: message => {
      console.log("Received message:", message);
      
      // Try to extract text from different possible message formats
      const messageText = message.message || message.text || message.content || (typeof message === 'string' ? message : '');
      
      // Extract echo content if present
      const extractedEcho = extractEchoContent(messageText);
      
      if (extractedEcho) {
        console.log("🔊 Echo content extracted:", extractedEcho);
        setEchoContent(extractedEcho);
      } else {
        console.log("No echo content found in message");
      }
      
      // Call the original onMessage callback
      onMessage(message);
    },
    onError: error => console.error("Error:", error),
  });
  
  // Define clientTools object with all your tools
  const clientTools = {
    logMessage: async ({ message }) => {
      console.log(message);
    },
    echoMe: async ({ "post-content": postContent }) => {
      console.log("🔧 echoMe tool called with post-content:", postContent);
      
      if (postContent && postContent.trim()) {
        console.log("🔊 Echo content from tool:", postContent);
        setEchoContent(postContent.trim());
      }
      
      return "Post content received and processed";
    },
    getPostContent: async () => {
      console.log("🚀 getPostContent called - starting to fetch post content");
      
      // Fetch post content (e.g., from an API)
      const postContent = {
        text: "Test post content",
      };
      
      console.log("📦 Post content fetched successfully:");
      console.log("📝 Content:", postContent);
      console.log("🔍 Content type:", typeof postContent);
      console.log("📊 Content keys:", Object.keys(postContent));
      console.log("✅ Returning post content to agent");
      
      // Return data directly to the agent.
      return postContent;
    }
  };
  
  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        console.log("Microphone permission denied, cannot start conversation");
        return;
      }

      // Start the conversation with your agent
      console.log("calling startSession");
      await conversation.startSession({
        agentId: "agent_01jyps63m8f6m900dy1j0hhzg8",
        dynamicVariables: {
          platform,
        },
        clientTools, // Pass the complete clientTools object
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  }, [conversation, platform]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      // Clear echo content when conversation stops
      setEchoContent(null);
    } catch (error) {
      console.error("Failed to stop conversation:", error);
    }
  }, [conversation]);

  // Log current echo content for debugging
  console.log("Current echo content variable:", echoContent);

  return (
    <Pressable
      style={[
        styles.micButton,
        conversation.status === "connected" && styles.micButtonActive,
      ]}
      onPress={
        conversation.status === "disconnected"
          ? startConversation
          : stopConversation
      }
    >
      <Mic
        size={24}
        color={conversation.status === "connected" ? "#FFFFFF" : "#8B5CF6"}
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
  },
  micButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
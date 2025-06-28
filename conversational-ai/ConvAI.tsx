"use dom";
import { useCallback } from "react";
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

export default function ConvAiDOMComponent({
  platform,
  onMessage,
}: {
  dom?: import("expo/dom").DOMProps;
  platform: string;
  onMessage: (message: Message) => void;
}) {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: message => {
      onMessage(message);
    },
    onError: error => console.error("Error:", error),
  });
  
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
        clientTools: {
          logMessage: async ({ message }) => {
            console.log(message);
          },
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  }, [conversation, platform]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to stop conversation:", error);
    }
  }, [conversation]);

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
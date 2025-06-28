"use dom";
import { useCallback } from "react";
import { useConversation } from "@11labs/react";
import { View, Pressable, StyleSheet } from "react-native";
import type { Message } from "../conversational-ai/ChatMessage";
import { Mic } from "lucide-react-native";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.log(error);
    console.error("Microphone permission denied");
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
        alert("No permission");
        return;
      }
      //   const signedUrl = await getSignedUrl(); TODO
      // Start the conversation with your agent
      console.log("calling startSession");
      await conversation.startSession({
        agentId: "agent_01jyps63m8f6m900dy1j0hhzg8", // Replace with your agent ID
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
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
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
    // Smooth transition for state changes
    transition: "all 0.2s ease-in-out",
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
});
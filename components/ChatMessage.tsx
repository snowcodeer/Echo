import { View, Text, StyleSheet } from "react-native";

export type Message = {
  source: string;
  message: string;
  timestamp?: Date;
  id?: string;
};

type Props = {
  message: Message;
};

export function ChatMessage({ message }: Props) {
  const isAI = message.source === "ai";

  return (
    <View
      style={[
        styles.messageContainer,
        isAI ? styles.aiMessage : styles.userMessage,
      ]}
    >
      <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
        <Text
          style={[styles.messageText, isAI ? styles.aiText : styles.userText]}
        >
          {message.message}
        </Text>
        {message.timestamp && (
          <Text style={[styles.timestamp, isAI ? styles.aiTimestamp : styles.userTimestamp]}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  aiBubble: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  userBubble: {
    backgroundColor: "#8B5CF6",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },
  aiText: {
    color: "#E2E8F0",
  },
  userText: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
  aiTimestamp: {
    color: "rgba(226, 232, 240, 0.6)",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
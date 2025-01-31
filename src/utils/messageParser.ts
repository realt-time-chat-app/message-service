import { Message } from "../types/message";

// Type guard to validate the raw message structure
function isValidMessage(rawMessage: any): rawMessage is Message {
  return (
    typeof rawMessage.id === "string" &&
    typeof rawMessage.senderId === "string" &&
    typeof rawMessage.recipientId === "string" &&
    typeof rawMessage.content === "string" &&
    typeof rawMessage.conversationId === "string" &&
    typeof rawMessage.timestamp === "string"
  );
}

// Parses a single raw message into a Message object
export function parseMessage(rawMessage: any): Message {
  if (!isValidMessage(rawMessage)) {
    throw new Error(`Invalid message format: ${JSON.stringify(rawMessage)}`);
  }
  return {
    id: rawMessage.id,
    senderId: rawMessage.senderId,
    recipientId: rawMessage.recipientId,
    content: rawMessage.content,
    conversationId: rawMessage.conversationId,
    timestamp: new Date(rawMessage.timestamp),
  };
}

// Parses an array of raw messages into Message objects
export function parseMessages(rawMessages: any[]): Message[] {
  return rawMessages.map((msg) => parseMessage(msg));
}

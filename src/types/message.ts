export interface Message {
  id: string;              // Unique ID for the message
  senderId: string;
  recipientId: string;
  content: string;
  conversationId: string;  // This links the message to a specific conversation
  timestamp: Date;         // This allows us to order messages by time
}

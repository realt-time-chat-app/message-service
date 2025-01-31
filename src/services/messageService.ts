import { BaseRepository } from "../repositories/baseRepository";
import { Message } from "../types/message";
import { v4 as uuid } from "uuid";

export class MessageService {
  constructor(private repository: BaseRepository) { }

  // Function to generate a consistent conversation ID
  private generateConversationId(senderId: string, recipientId: string): string {
    return [senderId, recipientId].sort().join("-");
  }

  sendMessage(senderId: string, recipientId: string, content: string): Message {
    // Use the extracted function to generate the conversation ID
    const conversationId = this.generateConversationId(senderId, recipientId);

    const message: Message = {
      id: uuid(),            // Unique ID for the message
      senderId,
      recipientId,
      content,
      conversationId,        // Use conversationId for grouping
      timestamp: new Date(), // Timestamp for chronological order
    };

    // Save the message in the repository
    this.repository.saveMessage(message);

    // Return the message to the caller (optional)
    return message;
  }

  getMessages(senderId: string, recipientId: string): Message[] {
    // Use the extracted function to generate the conversation ID
    const conversationId = this.generateConversationId(senderId, recipientId);

    // Retrieve messages for the conversation
    return this.repository.getMessagesByConversationId(conversationId);
  }
}

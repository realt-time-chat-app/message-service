import { BaseRepository } from "./baseRepository";
import { Message } from "../types/message";

export class InMemoryRepository implements BaseRepository {
  // Store messages by conversationId
  private conversations: { [conversationId: string]: Message[] } = {};

  saveMessage(message: Message): void {
    const { conversationId } = message;

    // If no messages exist for this conversation, initialize an empty array
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = [];
    }

    // Push the message into the appropriate conversation array
    this.conversations[conversationId].push(message);
  }

  getMessagesByConversationId(conversationId: string): Message[] {
    // Return messages for the given conversationId, or an empty array if none exist
    return this.conversations[conversationId] || [];
  }
}

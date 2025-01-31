import { Message } from "../types/message";

export interface BaseRepository {
  // Save a message to the repository, now with conversation ID
  saveMessage(message: Message): void;

  // Get messages by conversation ID (not just by recipient)
  getMessagesByConversationId(conversationId: string): Message[];
}

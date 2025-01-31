import { Message } from "../../src/types/message";
import { BaseRepository } from "../../src/repositories/baseRepository";

export class MockRepository implements BaseRepository {
  private messages: Message[] = [];

  constructor(testData?: Message[]) {
    if (testData) {
      this.messages = testData;
    }
  }

  saveMessage(message: Message): void {
    this.messages.push(message);
  }

  getMessagesByConversationId(conversationId: string): Message[] {
    return this.messages.filter(
      (msg) => msg.conversationId === conversationId
    );
  }
}

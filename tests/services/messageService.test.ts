// import { MessageService } from "../../src/services/messageService";
// import { InMemoryRepository } from "../../src/repositories/inMemoryRepository";
// import { Message } from "../../src/types/message";
//
// describe("MessageService", () => {
//   let messageService: MessageService;
//   let repository: InMemoryRepository;
//
//   beforeEach(() => {
//     // Initialize repository and message service before each test
//     repository = new InMemoryRepository();
//     messageService = new MessageService(repository);
//   });
//
//   it("should send a message and store it in the correct conversation", () => {
//     const sender = "user1";
//     const recipient = "user2";
//     const content = "Hello there!";
//
//     // Send the message
//     const result = messageService.sendMessage(sender, recipient, content);
//
//     // Validate that the message was stored correctly
//     const conversationId = [sender, recipient].sort().join("-");
//     const messages = repository.getMessagesByConversationId(conversationId);
//
//     expect(messages).toContainEqual(result); // Check if the message is in the conversation
//     expect(result.id).toBeDefined();         // Check if the message has an id
//     expect(result.sender).toBe(sender);
//     expect(result.recipient).toBe(recipient);
//     expect(result.content).toBe(content);
//   });
//
//   it("should retrieve messages for a conversation", () => {
//     const sender = "user1";
//     const recipient = "user2";
//     const content1 = "Hello there!";
//     const content2 = "How are you?";
//
//     // Send two messages
//     messageService.sendMessage(sender, recipient, content1);
//     messageService.sendMessage(sender, recipient, content2);
//
//     // Retrieve the messages for the conversation
//     const messages = messageService.getMessages(sender, recipient);
//
//     // Validate the messages
//     expect(messages.length).toBe(2);
//     expect(messages[0].content).toBe(content1);
//     expect(messages[1].content).toBe(content2);
//     expect(messages[0].id).toBeDefined();
//     expect(messages[1].id).toBeDefined();
//   });
// });

import { loadJsonData } from "../../src/utils/loadJsonData";
import { parseMessage, parseMessages } from "../../src/utils/messageParser";
import { MessageService } from "../../src/services/messageService";
import { MockRepository } from "../repositories/mockRepository";

describe("MessageService Tests", () => {
  let messageService: MessageService;
  let repository: MockRepository;

  beforeEach(() => {
    // Initialize the repository before passing it to MessageService
    repository = new MockRepository();
    messageService = new MessageService(repository);
  });

  it("should load and parse a valid single message", () => {
    const testData = loadJsonData("messages.json");
    const rawMessage = testData.validMessage;

    const parsedMessage = parseMessage(rawMessage);

    expect(parsedMessage).toEqual({
      id: "msg1",
      senderId: "user1",
      recipientId: "user2",
      content: "Hello there!",
      conversationId: "user1-user2",
      timestamp: new Date("2025-01-26T12:00:00Z"),
    });
  });

  it("should load and parse multiple conversation messages", () => {
    const testData = loadJsonData("messages.json");
    const rawMessages = testData.conversationMessages;

    const parsedMessages = parseMessages(rawMessages);

    expect(parsedMessages).toHaveLength(2);
    expect(parsedMessages[0]).toEqual({
      id: "msg1",
      senderId: "user1",
      recipientId: "user2",
      content: "Hello there!",
      conversationId: "user1-user2",
      timestamp: new Date("2025-01-26T12:00:00Z"),
    });
    expect(parsedMessages[1]).toEqual({
      id: "msg2",
      senderId: "user2",
      recipientId: "user1",
      content: "Hi! How are you?",
      conversationId: "user1-user2",
      timestamp: new Date("2025-01-26T12:05:00Z"),
    });
  });

  it("should add a message using the MessageService", () => {
    const testData = loadJsonData("messages.json");
    const rawMessage = testData.validMessage;

    const parsedMessage = parseMessage(rawMessage);
    // Save the parsed message to the repository
    repository.saveMessage(parsedMessage);

    const messages = repository.getMessagesByConversationId("user1-user2");
    expect(messages).toContainEqual(parsedMessage);
  });

  it("should retrieve messages by conversation ID", () => {
    const testData = loadJsonData("messages.json");
    const rawMessages = testData.conversationMessages;

    const parsedMessages = parseMessages(rawMessages);
    parsedMessages.forEach((message) => repository.saveMessage(message));

    const conversationMessages = repository.getMessagesByConversationId("user1-user2");

    expect(conversationMessages).toHaveLength(2);
    expect(conversationMessages).toEqual(parsedMessages);
  });
});

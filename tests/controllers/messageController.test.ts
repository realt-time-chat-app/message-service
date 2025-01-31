import { JSONRPCServer } from "json-rpc-2.0";
import { createMessageServer } from "../../src/api/controllers/messageController";
import { MessageService } from "../../src/services/messageService";
import { MockRepository } from "../repositories/mockRepository";
import { SocketService } from "../../src/services/socketService";
import { Server } from "socket.io";
import { loadJsonData } from "../../src/utils/loadJsonData";

describe("Message Controller (JSON-RPC)", () => {
  let rpcServer: JSONRPCServer;
  let messageService: MessageService;
  let repository: MockRepository;
  let socketService: SocketService;
  let io: Server;
  let testData: any;

  beforeEach(() => {
    // Load test data from messages.json
    testData = loadJsonData("messages.json");

    // Initialize repository, services, and server
    repository = new MockRepository();
    messageService = new MessageService(repository);
    io = new Server();
    socketService = new SocketService(io);
    rpcServer = createMessageServer(messageService, socketService);
  });

  it("should send a message via JSON-RPC", async () => {
    const rawMessage = testData.validMessage;

    // Extract sender, recipient, and content
    const { senderId, recipientId, content } = rawMessage;

    // Make JSON-RPC request to send message
    const result = await rpcServer.receive({
      jsonrpc: "2.0",
      method: "sendMessage",
      params: { senderId, recipientId, content },
      id: 1,
    });

    // Validate the result
    expect(result?.result.senderId).toBe(senderId);
    expect(result?.result.recipientId).toBe(recipientId);
    expect(result?.result.content).toBe(content);

    // Check that the message was saved in the repository
    const conversationId = rawMessage.conversationId;
    const messages = repository.getMessagesByConversationId(conversationId);
    expect(messages).toContainEqual(result?.result);
  });

  it("should retrieve messages for a conversation via JSON-RPC", async () => {
    const rawMessages = testData.conversationMessages;

    // Save the conversation messages in the repository
    rawMessages.forEach((message: any) => repository.saveMessage(message));

    // Extract sender and recipient from the first message
    const { senderId, recipientId } = rawMessages[0];

    // Make JSON-RPC request to get messages
    const result = await rpcServer.receive({
      jsonrpc: "2.0",
      method: "getMessages",
      params: { senderId, recipientId },
      id: 1,
    });

    // Validate the result
    expect(result?.result.length).toBe(rawMessages.length);
    expect(result?.result).toEqual(rawMessages);
  });
});

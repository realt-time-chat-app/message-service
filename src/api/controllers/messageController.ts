import { JSONRPCServer } from "json-rpc-2.0";
import { MessageService } from "../../services/messageService";
import { SocketService } from "../../services/socketService";

export const createMessageServer = (
  messageService: MessageService,
  socketService: SocketService // Pass the new service
): JSONRPCServer => {
  const server = new JSONRPCServer();

  server.addMethod("sendMessage", ({ senderId, recipientId, content }) => {
    console.log("sendMessage on server:", senderId, recipientId, content);
    const result = messageService.sendMessage(senderId, recipientId, content);
    console.log("Message saved, delegating broadcast to SocketService");

    // Delegate the broadcasting to SocketService
    const roomId = [senderId, recipientId].sort().join("-");
    console.log("we are about to broadCast message");
    socketService.broadcastMessage(roomId, result);

    return result;
  });

  server.addMethod("getMessages", ({ senderId, recipientId }) => {
    return messageService.getMessages(senderId, recipientId);
  });

  return server;
};

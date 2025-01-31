import MockedSocket from "socket.io-mock";
import { setupSocketListeners } from "../../src/api/controllers/socketController";
import { SocketService } from "../../src/services/socketService";

describe("SocketController", () => {
  let socketService: SocketService;
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = new MockedSocket();
    socketService = new SocketService(mockSocket);
    setupSocketListeners(socketService);
  });

  it("should handle connection and emit events", (done) => {
    mockSocket.on("newMessage", (data: any) => {
      expect(data).toEqual({ content: "Hello, world!" });
      done();
    });

    mockSocket.emit("connection");
    socketService.broadcastMessage("room1", { content: "Hello, world!" });
  });
});

import { Server, Socket } from "socket.io";
import { SocketService } from "../../src/services/socketService";

describe("SocketService", () => {
  let socketService: SocketService;
  let io: Server;
  let socket: Socket;

  beforeAll(() => {
    // Initialize the Server instance
    io = new Server();
    socketService = new SocketService(io);

    // Create a mock socket object
    const mockSocket = {
      id: "socketId",
      join: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    // Simulate the socket being added to the server
    io.sockets.sockets.set(mockSocket.id, mockSocket);

    // Set the socket to be used in tests
    socket = mockSocket;
    socketService.handleConnection(socket);
  });

  it("should broadcast message to the correct room", () => {
    const broadcastSpy = jest.spyOn(socketService.getSocketIO(), "to").mockReturnThis();
    const emitSpy = jest.spyOn(socketService.getSocketIO(), "emit").mockReturnValue(true);

    const roomId = "room1";
    const message = { content: "Test message" };

    socketService.broadcastMessage(roomId, message);

    // Ensure `to` was called with the correct room
    expect(broadcastSpy).toHaveBeenCalledWith(roomId);

    // Ensure `emit` was called with the right event and message
    expect(emitSpy).toHaveBeenCalledWith("newMessage", message);
  });
});

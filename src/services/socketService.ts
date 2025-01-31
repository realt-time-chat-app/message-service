import { Server, Socket } from "socket.io";

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  broadcastMessage(roomId: string, message: any): void {
    console.log(`Broadcasting message to room: ${roomId}`);
    this.io.to(roomId).emit("newMessage", message);
  }

  handleConnection(socket: Socket): void {
    console.log(`User connected: ${socket.id}`);

    // Handle room joins
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    // Handle typing
    socket.on("typing", (roomId: string) => {
      socket.to(roomId).emit("userTyping", socket.id);
    });

    // Handle disconnects
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  }

  // Expose the io instance for external use (if necessary)
  getSocketIO(): Server {
    return this.io;
  }
}

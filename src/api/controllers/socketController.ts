import { SocketService } from "../../services/socketService";

export const setupSocketListeners = (socketService: SocketService) => {
  const io = socketService.getSocketIO();

  io.on("connection", (socket) => {
    socketService.handleConnection(socket);
  });
};

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { createMessageServer } from "./controllers/messageController";
import { setupSocketListeners } from "./controllers/socketController";
import { MessageService } from "../services/messageService";
import { SocketService } from "../services/socketService";
import { corsMiddleware } from "../middleware/corsMiddleware";
import { socketCorsConfig } from "../config/socketCorsConfig";

// Function to configure Express app
const configureExpress = (app: express.Application, rpcServer: any) => {
  app.use(corsMiddleware);
  app.use(express.json());

  app.post("/rpc", (req: Request, res: Response) => {
    Promise.resolve(rpcServer.receive(req.body))
      .then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
          res.json(jsonRPCResponse);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((error) => {
        console.error("Error processing JSON-RPC request:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};

// Main function to create the server
export const createServer = (
  messageService: MessageService,
  socketService?: SocketService // Make SocketService injectable
) => {
  const app = express();
  const httpServer = http.createServer(app);

  // Set up Socket.IO with modularized CORS config
  const io = new Server(httpServer, { cors: socketCorsConfig });

  // Initialize SocketService if not provided
  const socketServiceInstance = socketService || new SocketService(io);

  // Create the JSON-RPC message server, passing the SocketService
  const messageServer = createMessageServer(messageService, socketServiceInstance);

  // Configure Express app
  configureExpress(app, messageServer);

  // Set up Socket.IO listeners
  setupSocketListeners(socketServiceInstance);

  return httpServer;
};

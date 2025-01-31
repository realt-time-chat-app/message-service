import { InMemoryRepository } from "./repositories/inMemoryRepository";
import { MessageService } from "./services/messageService";
import { createServer } from "./api/server";
import { PORT, HOST } from "./config";

const startServer = async () => {
  try {
    // Initialize repositories
    const repository = new InMemoryRepository();
    // Initialize the services
    const messageService = new MessageService(repository);
    // Pass dependencies to the server
    const server = createServer(messageService);

    // Start the server
    server.listen(PORT, () => {
      console.log(`Message service running on ${HOST}:${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("Shutting down server...");
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      console.log("Server terminated.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();

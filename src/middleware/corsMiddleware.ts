import cors from "cors";

export const corsMiddleware = cors({
  origin: "*", // Allow all origins (or specify allowed origins)
  methods: ["GET", "POST"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Allowed headers
});

import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3002;
export const HOST = process.env.HOST || "http://localhost";

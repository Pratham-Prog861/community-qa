import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(error, "Failed to connect to MongoDB");
    throw error;
  }
}


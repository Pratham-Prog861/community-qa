import { createServer } from "http";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { loadEnv } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  loadEnv();

  const port = Number(process.env.PORT ?? 5000);
  const app = createApp();
  const server = createServer(app);

  await connectDatabase();

  server.listen(port, () => {
    logger.info({ port }, "API server is running");
  });

  const shutdown = async (signal) => {
    logger.info({ signal }, "Received shutdown signal");
    server.close(() => {
      logger.info("HTTP server closed");
    });

    await mongoose.connection.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((error) => {
  logger.error(error, "Failed to start server");
  process.exit(1);
});


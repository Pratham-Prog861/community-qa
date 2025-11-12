import { logger } from "../utils/logger.js";

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status ?? 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (status >= 500) {
    logger.error({ err }, "Unhandled error");
  } else {
    logger.warn({ err }, "Handled error");
  }

  res.status(status).json({
    message: !isProduction ? err.message : "Something went wrong",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
};


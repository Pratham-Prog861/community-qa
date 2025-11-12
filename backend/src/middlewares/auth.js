import createError from "http-errors";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export async function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw createError.Unauthorized("Authorization token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub).lean();
    if (!user) {
      throw createError.Unauthorized("User not found");
    }
    if (user.isBanned) {
      throw createError.Forbidden("Account banned");
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    next();
  } catch (error) {
    next(createError.Unauthorized(error.message));
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(createError.Unauthorized("Authentication required"));
    }
    if (req.user.role !== role) {
      return next(createError.Forbidden("Insufficient permissions"));
    }
    return next();
  };
}


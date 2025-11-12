import createError from "http-errors";
import crypto from "node:crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9-_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(64)
});

const loginSchema = z.object({
  usernameOrEmail: z.string().min(3),
  password: z.string().min(8)
});

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    reputation: user.reputation,
    badges: user.badges,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function setRefreshCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

export const authController = {
  async register(req, res, next) {
    try {
      const payload = registerSchema.parse(req.body);

      const existing = await User.findOne({
        $or: [{ email: payload.email.toLowerCase() }, { username: payload.username.toLowerCase() }]
      });
      if (existing) {
        throw createError.Conflict("Email or username already taken");
      }

      const user = await User.create({
        name: payload.name,
        username: payload.username,
        email: payload.email,
        passwordHash: payload.password
      });

      const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
      const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });
      user.refreshTokens = [hashToken(refreshToken)];
      await user.save();

      setRefreshCookie(res, refreshToken);

      res.status(201).json({
        user: serializeUser(user),
        accessToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async login(req, res, next) {
    try {
      const payload = loginSchema.parse(req.body);

      const identifier = payload.usernameOrEmail.toLowerCase();
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
      });

      if (!user) {
        throw createError.Unauthorized("Invalid credentials");
      }
      if (user.isBanned) {
        throw createError.Forbidden("Account banned");
      }

      const isValid = await user.comparePassword(payload.password);
      if (!isValid) {
        throw createError.Unauthorized("Invalid credentials");
      }

      const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
      const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });
      user.refreshTokens = [...user.refreshTokens, hashToken(refreshToken)].slice(-5);
      await user.save();

      setRefreshCookie(res, refreshToken);

      res.json({
        user: serializeUser(user),
        accessToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.clearCookie("refreshToken");
        return res.status(204).send();
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch {
        res.clearCookie("refreshToken");
        return res.status(204).send();
      }

      const user = await User.findById(decoded.sub);
      if (user) {
        const hashed = hashToken(refreshToken);
        user.refreshTokens = user.refreshTokens.filter((stored) => stored !== hashed);
        await user.save();
      }

      res.clearCookie("refreshToken");
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw createError.Unauthorized("Missing refresh token");
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch {
        throw createError.Unauthorized("Invalid refresh token");
      }

      const user = await User.findById(decoded.sub);
      if (!user) {
        throw createError.Unauthorized("User not found");
      }
      if (user.isBanned) {
        throw createError.Forbidden("Account banned");
      }

      const hashed = hashToken(refreshToken);
      if (!user.refreshTokens.includes(hashed)) {
        user.refreshTokens = [];
        await user.save();
        throw createError.Unauthorized("Refresh token revoked");
      }

      const newAccessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
      const newRefreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });

      user.refreshTokens = user.refreshTokens.filter((stored) => stored !== hashed);
      user.refreshTokens.push(hashToken(newRefreshToken));
      await user.save();

      setRefreshCookie(res, newRefreshToken);

      res.json({
        user: serializeUser(user),
        accessToken: newAccessToken
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        throw createError.NotFound("User not found");
      }
      res.json({
        user: serializeUser(user)
      });
    } catch (error) {
      next(error);
    }
  }
};


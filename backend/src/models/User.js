import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BadgeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true, lowercase: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    reputation: { type: Number, default: 0 },
    badges: { type: [BadgeSchema], default: [] },
    refreshTokens: { type: [String], default: [] },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    isBanned: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

UserSchema.methods.addRefreshToken = function addRefreshToken(token) {
  this.refreshTokens.push(token);
  return this.save();
};

UserSchema.methods.removeRefreshToken = function removeRefreshToken(token) {
  this.refreshTokens = this.refreshTokens.filter((stored) => stored !== token);
  return this.save();
};

UserSchema.methods.clearRefreshTokens = function clearRefreshTokens() {
  this.refreshTokens = [];
  return this.save();
};

UserSchema.pre("save", function preSave(next) {
  if (!this.isModified("passwordHash")) return next();
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(this.passwordHash, salt))
    .then((hash) => {
      this.passwordHash = hash;
      next();
    })
    .catch(next);
});

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export const User = mongoose.model("User", UserSchema);


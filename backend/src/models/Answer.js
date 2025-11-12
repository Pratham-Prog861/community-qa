import mongoose from "mongoose";

const { Schema } = mongoose;

const AnswerSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true },
    voteScore: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

AnswerSchema.index({ createdAt: -1 });
AnswerSchema.index({ voteScore: -1 });

export const Answer = mongoose.model("Answer", AnswerSchema);


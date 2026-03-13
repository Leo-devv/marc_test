import mongoose, { Schema, Model } from "mongoose";
import { IConversation } from "@/types";

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, required: true, index: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant", "system"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        metadata: { type: Schema.Types.Mixed, default: {} },
      },
    ],
    parsedIntent: { type: Schema.Types.Mixed, default: {} },
    matchedProviders: [{ type: Schema.Types.ObjectId, ref: "Provider" }],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;

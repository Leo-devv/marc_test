import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    alias: { type: String, required: true },
    preferences: { type: Schema.Types.Mixed, default: {} },
    savedProviders: [{ type: Schema.Types.ObjectId, ref: "Provider" }],
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

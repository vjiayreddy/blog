import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ROLES, USER_STATUSES } from "@/lib/constants";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "AUTHOR", required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    status: { type: String, enum: USER_STATUSES, default: "active" },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

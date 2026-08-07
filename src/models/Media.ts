import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MediaSchema = new Schema(
  {
    cloudinaryPublicId: { type: String, required: true },
    url: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    format: { type: String, default: "" },
    alt: { type: String, default: "" },
    bytes: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export type MediaDocument = InferSchemaType<typeof MediaSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Media: Model<MediaDocument> =
  mongoose.models.Media || mongoose.model<MediaDocument>("Media", MediaSchema);

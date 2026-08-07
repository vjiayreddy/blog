import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export type TagDocument = InferSchemaType<typeof TagSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Tag: Model<TagDocument> =
  mongoose.models.Tag || mongoose.model<TagDocument>("Tag", TagSchema);

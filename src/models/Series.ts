import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SeriesSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SeriesDocument = InferSchemaType<typeof SeriesSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Series: Model<SeriesDocument> =
  mongoose.models.Series || mongoose.model<SeriesDocument>("Series", SeriesSchema);

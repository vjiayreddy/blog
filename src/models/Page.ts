import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { CONTENT_STATUSES } from "@/lib/constants";

const SeoSchema = new Schema(
  {
    title: String,
    description: String,
    ogImage: String,
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    lexicalJSON: { type: String, default: "" },
    html: { type: String, default: "" },
    status: { type: String, enum: CONTENT_STATUSES, default: "draft", index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    editorId: { type: Schema.Types.ObjectId, ref: "User" },
    coverImage: { type: String, default: "" },
    seo: { type: SeoSchema, default: {} },
    publishedAt: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type PageDocument = InferSchemaType<typeof PageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page: Model<PageDocument> =
  mongoose.models.Page || mongoose.model<PageDocument>("Page", PageSchema);

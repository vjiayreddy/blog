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

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    lexicalJSON: { type: String, default: "" },
    html: { type: String, default: "" },
    plaintext: { type: String, default: "" },
    status: { type: String, enum: CONTENT_STATUSES, default: "draft", index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    editorId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    seriesId: { type: Schema.Types.ObjectId, ref: "Series", default: null },
    seriesOrder: { type: Number, default: 0 },
    coverImage: { type: String, default: "" },
    seo: { type: SeoSchema, default: {} },
    publishedAt: { type: Date, default: null, index: true },
    scheduledAt: { type: Date, default: null, index: true },
    readingTime: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ title: "text", excerpt: "text", plaintext: "text" });

export type PostDocument = InferSchemaType<typeof PostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Post: Model<PostDocument> =
  mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);

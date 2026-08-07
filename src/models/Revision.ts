import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const RevisionSchema = new Schema(
  {
    documentId: { type: Schema.Types.ObjectId, required: true, index: true },
    documentType: { type: String, enum: ["post", "page"], required: true },
    lexicalJSON: { type: String, required: true },
    html: { type: String, default: "" },
    title: { type: String, default: "" },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type RevisionDocument = InferSchemaType<typeof RevisionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Revision: Model<RevisionDocument> =
  mongoose.models.Revision ||
  mongoose.model<RevisionDocument>("Revision", RevisionSchema);

import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AnalyticsEventSchema = new Schema(
  {
    type: { type: String, enum: ["page_view"], required: true },
    path: { type: String, required: true, index: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null, index: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AnalyticsEventSchema.index({ createdAt: -1 });

export type AnalyticsEventDocument = InferSchemaType<typeof AnalyticsEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AnalyticsEvent: Model<AnalyticsEventDocument> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<AnalyticsEventDocument>("AnalyticsEvent", AnalyticsEventSchema);

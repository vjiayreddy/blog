import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SettingsSchema = new Schema(
  {
    siteTitle: { type: String, default: "Blog Portal" },
    siteDescription: { type: String, default: "A Ghost-like publishing platform" },
    logo: { type: String, default: "" },
    socialLinks: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    defaultSeo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type SettingsDocument = InferSchemaType<typeof SettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Settings: Model<SettingsDocument> =
  mongoose.models.Settings ||
  mongoose.model<SettingsDocument>("Settings", SettingsSchema);

export async function getSettings() {
  let settings = await Settings.findOne().lean();
  if (!settings) {
    const created = await Settings.create({});
    settings = created.toObject();
  }
  return settings;
}

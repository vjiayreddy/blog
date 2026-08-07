import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blog-portal";

async function main() {
  await mongoose.connect(MONGODB_URI);

  const { User } = await import("../src/models/User");
  const { Category } = await import("../src/models/Category");
  const { Tag } = await import("../src/models/Tag");
  const { Series } = await import("../src/models/Series");
  const { Post } = await import("../src/models/Post");
  const { Page } = await import("../src/models/Page");
  const { Settings } = await import("../src/models/Settings");

  const email = (process.env.SEED_OWNER_EMAIL || "owner@example.com").toLowerCase();
  const password = process.env.SEED_OWNER_PASSWORD || "ChangeMe123!";

  let owner = await User.findOne({ email });
  if (!owner) {
    owner = await User.create({
      name: "Site Owner",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "OWNER",
      bio: "Founder and publisher",
    });
    console.log(`Created OWNER: ${email}`);
  } else {
    console.log(`OWNER already exists: ${email}`);
  }

  await Settings.findOneAndUpdate(
    {},
    {
      siteTitle: "Blog Portal",
      siteDescription: "A Ghost-like publishing platform built with Next.js",
      defaultSeo: {
        title: "Blog Portal",
        description: "Stories, guides, and ideas from the Blog Portal team",
      },
    },
    { upsert: true }
  );

  const category =
    (await Category.findOne({ slug: "product" })) ||
    (await Category.create({
      name: "Product",
      slug: "product",
      description: "Product updates and launches",
    }));

  const tag =
    (await Tag.findOne({ slug: "getting-started" })) ||
    (await Tag.create({ name: "Getting Started", slug: "getting-started" }));

  const series =
    (await Series.findOne({ slug: "welcome-series" })) ||
    (await Series.create({
      name: "Welcome Series",
      slug: "welcome-series",
      description: "An introduction to Blog Portal",
    }));

  const existingPost = await Post.findOne({ slug: "hello-blog-portal" });
  if (!existingPost) {
    const html =
      "<p>Welcome to <strong>Blog Portal</strong> — a Ghost-like publishing platform.</p><p>Use the admin dashboard to write with Lexical, schedule posts, and manage media on Cloudinary.</p>";
    await Post.create({
      title: "Hello, Blog Portal",
      slug: "hello-blog-portal",
      excerpt: "Your first published post on Blog Portal.",
      html,
      plaintext: "Welcome to Blog Portal — a Ghost-like publishing platform.",
      lexicalJSON: "",
      status: "published",
      authorId: owner._id,
      categoryIds: [category._id],
      tagIds: [tag._id],
      seriesId: series._id,
      seriesOrder: 1,
      featured: true,
      publishedAt: new Date(),
      readingTime: 1,
      seo: {
        title: "Hello, Blog Portal",
        description: "Your first published post on Blog Portal.",
      },
    });
    console.log("Created sample post: hello-blog-portal");
  }

  const about = await Page.findOne({ slug: "about" });
  if (!about) {
    await Page.create({
      title: "About",
      slug: "about",
      excerpt: "About this publication",
      html: "<p>Blog Portal is a Phase 1 MVP publishing system inspired by Ghost.</p>",
      status: "published",
      authorId: owner._id,
      publishedAt: new Date(),
    });
    console.log("Created about page");
  }

  console.log("Seed complete.");
  console.log(`Login: ${email} / ${password}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});

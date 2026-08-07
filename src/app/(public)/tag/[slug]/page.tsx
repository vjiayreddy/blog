import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Tag } from "@/models/Tag";
import { Post } from "@/models/Post";
import { PostCard } from "@/components/public/post-card";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) return {};
  return buildMetadata({
    title: `#${tag.name}`,
    description: `Posts tagged ${tag.name}`,
    path: `/tag/${tag.slug}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) notFound();

  const posts = await Post.find({ status: "published", tagIds: tag._id })
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-semibold tracking-tight">#{tag.name}</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={String(post._id)}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt || undefined}
            coverImage={post.coverImage || undefined}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
          />
        ))}
      </div>
    </div>
  );
}

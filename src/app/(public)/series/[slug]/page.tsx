import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Series } from "@/models/Series";
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
  const series = await Series.findOne({ slug }).lean();
  if (!series) return {};
  return buildMetadata({
    title: series.name,
    description: series.description || `Posts in series ${series.name}`,
    path: `/series/${series.slug}`,
    image: series.coverImage,
  });
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const series = await Series.findOne({ slug }).lean();
  if (!series) notFound();

  const posts = await Post.find({ status: "published", seriesId: series._id })
    .sort({ seriesOrder: 1, publishedAt: 1 })
    .lean();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-semibold tracking-tight">{series.name}</h1>
      {series.description ? (
        <p className="mt-2 text-stone-600">{series.description}</p>
      ) : null}
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

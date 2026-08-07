import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { PostCard } from "@/components/public/post-card";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "All published posts",
  path: "/blog",
});

export default async function BlogIndexPage() {
  await connectDB();
  const posts = await Post.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .populate("authorId", "name")
    .lean();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">Blog</h1>
      <p className="mt-2 text-stone-600">All published articles</p>
      <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={String(post._id)}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt || undefined}
            coverImage={post.coverImage || undefined}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
            authorName={
              typeof post.authorId === "object" && post.authorId && "name" in post.authorId
                ? String(post.authorId.name)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

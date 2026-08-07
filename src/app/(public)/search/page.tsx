import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { PostCard } from "@/components/public/post-card";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search published posts",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  await connectDB();

  let posts: Array<{
    _id: unknown;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    publishedAt?: Date | null;
    readingTime?: number;
  }> = [];

  if (q?.trim()) {
    try {
      posts = await Post.find(
        { status: "published", $text: { $search: q.trim() } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(30)
        .lean();
    } catch {
      const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      posts = await Post.find({
        status: "published",
        $or: [{ title: regex }, { excerpt: regex }, { plaintext: regex }],
      })
        .sort({ publishedAt: -1 })
        .limit(30)
        .lean();
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-semibold tracking-tight">Search</h1>
      <form className="mt-6">
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="Search posts…"
          className="w-full max-w-xl rounded-full border border-stone-300 bg-white px-5 py-3 text-sm outline-none focus:border-stone-900"
        />
      </form>
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
      {q && posts.length === 0 ? (
        <p className="mt-6 text-stone-500">No results for “{q}”.</p>
      ) : null}
    </div>
  );
}

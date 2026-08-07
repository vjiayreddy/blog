import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { blogPostingJsonLd, buildMetadata } from "@/lib/seo";
import { TrackPageView } from "@/components/public/track-page-view";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, status: "published" }).lean();
  if (!post) return {};
  return buildMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.seo?.ogImage || post.coverImage,
    type: "article",
    publishedAt: post.publishedAt,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, status: "published" })
    .populate("authorId", "name bio")
    .populate("categoryIds", "name slug")
    .populate("tagIds", "name slug")
    .populate("seriesId", "name slug")
    .lean();

  if (!post) notFound();

  let seriesNav: { prev?: { slug: string; title: string }; next?: { slug: string; title: string } } =
    {};
  if (post.seriesId) {
    const seriesId =
      typeof post.seriesId === "object" ? post.seriesId._id : post.seriesId;
    const seriesPosts = await Post.find({
      seriesId,
      status: "published",
    })
      .sort({ seriesOrder: 1, publishedAt: 1 })
      .select("slug title seriesOrder")
      .lean();
    const idx = seriesPosts.findIndex((p) => String(p._id) === String(post._id));
    if (idx > 0) seriesNav.prev = seriesPosts[idx - 1];
    if (idx >= 0 && idx < seriesPosts.length - 1) seriesNav.next = seriesPosts[idx + 1];
  }

  const tagIds = (post.tagIds || []).map((t) =>
    typeof t === "object" && t && "_id" in t ? t._id : t
  );
  const related = tagIds.length
    ? await Post.find({
        status: "published",
        _id: { $ne: post._id },
        tagIds: { $in: tagIds as mongoose.Types.ObjectId[] },
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select("title slug excerpt coverImage publishedAt")
        .lean()
    : [];

  const authorName =
    typeof post.authorId === "object" && post.authorId && "name" in post.authorId
      ? String(post.authorId.name)
      : undefined;

  const jsonLd = blogPostingJsonLd({
    title: post.title,
    description: post.excerpt || "",
    slug: post.slug,
    coverImage: post.coverImage || undefined,
    publishedAt: post.publishedAt,
    authorName,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <TrackPageView path={`/blog/${post.slug}`} postId={String(post._id)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm text-stone-500">
        {post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : ""}
        {post.readingTime ? ` · ${post.readingTime} min read` : ""}
        {authorName ? ` · ${authorName}` : ""}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-source-serif)] text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        {post.title}
      </h1>
      {post.excerpt ? <p className="mt-4 text-lg text-stone-600">{post.excerpt}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {((post.categoryIds || []) as unknown as Array<{ _id: string; name: string; slug: string }>).map(
          (c) => (
            <Link
              key={String(c._id)}
              href={`/category/${c.slug}`}
              className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700"
            >
              {c.name}
            </Link>
          )
        )}
        {((post.tagIds || []) as unknown as Array<{ _id: string; name: string; slug: string }>).map(
          (t) => (
            <Link
              key={String(t._id)}
              href={`/tag/${t.slug}`}
              className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600"
            >
              #{t.name}
            </Link>
          )
        )}
      </div>

      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt="" className="mt-8 aspect-[16/9] w-full object-cover" />
      ) : null}

      <div
        className="prose-blog mt-10"
        dangerouslySetInnerHTML={{ __html: post.html || "" }}
      />

      {(() => {
        const series =
          typeof post.seriesId === "object" && post.seriesId
            ? (post.seriesId as unknown as { _id: string; name: string; slug: string })
            : null;
        if (!series?.slug) return null;
        return (
          <div className="mt-12 rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-medium text-stone-500">Series</p>
            <Link
              href={`/series/${series.slug}`}
              className="text-lg font-semibold hover:underline"
            >
              {series.name}
            </Link>
            <div className="mt-4 flex justify-between gap-4 text-sm">
              {seriesNav.prev ? (
                <Link href={`/blog/${seriesNav.prev.slug}`} className="text-teal-800 hover:underline">
                  ← {seriesNav.prev.title}
                </Link>
              ) : (
                <span />
              )}
              {seriesNav.next ? (
                <Link href={`/blog/${seriesNav.next.slug}`} className="text-teal-800 hover:underline">
                  {seriesNav.next.title} →
                </Link>
              ) : null}
            </div>
          </div>
        );
      })()}

      {related.length > 0 ? (
        <section className="mt-14 border-t border-stone-200 pt-10">
          <h2 className="text-xl font-semibold">Related</h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={String(r._id)}>
                <Link href={`/blog/${r.slug}`} className="font-medium hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

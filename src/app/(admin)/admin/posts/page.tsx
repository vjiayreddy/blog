import Link from "next/link";
import { listPosts } from "@/app/actions/content";
import { format } from "date-fns";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const posts = await listPosts({ status: params.status, q: params.q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-stone-500">{posts.length} posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          New post
        </Link>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search posts"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={params.status || ""}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="rounded-full bg-stone-200 px-4 py-2 text-sm font-medium">
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {posts.map(
              (post: {
                _id: string;
                title: string;
                status: string;
                updatedAt: string;
                slug: string;
              }) => (
                <tr key={post._id} className="border-b border-stone-100">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${post._id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                    <p className="text-xs text-stone-400">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{post.status}</td>
                  <td className="px-4 py-3 text-stone-500">
                    {format(new Date(post.updatedAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeletePostButton id={post._id} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {posts.length === 0 ? (
          <p className="px-4 py-8 text-sm text-stone-500">No posts found.</p>
        ) : null}
      </div>
    </div>
  );
}

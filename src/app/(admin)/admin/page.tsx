import Link from "next/link";
import { getDashboardStats } from "@/app/actions/content";
import { format } from "date-fns";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500">Overview of your publishing pipeline</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          New post
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Drafts", value: stats.drafts },
          { label: "Scheduled", value: stats.scheduled },
          { label: "Published", value: stats.published },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-stone-900">Recent drafts</h2>
          <ul className="mt-4 space-y-3">
            {stats.recentDrafts.map((post: { _id: string; title: string; updatedAt: string }) => (
              <li key={post._id}>
                <Link href={`/admin/posts/${post._id}`} className="text-sm font-medium hover:underline">
                  {post.title}
                </Link>
                <p className="text-xs text-stone-500">
                  Updated {format(new Date(post.updatedAt), "MMM d, yyyy")}
                </p>
              </li>
            ))}
            {stats.recentDrafts.length === 0 ? (
              <li className="text-sm text-stone-500">No drafts yet.</li>
            ) : null}
          </ul>
        </section>
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-stone-900">Scheduled queue</h2>
          <ul className="mt-4 space-y-3">
            {stats.scheduledQueue.map(
              (post: { _id: string; title: string; scheduledAt?: string }) => (
                <li key={post._id}>
                  <Link
                    href={`/admin/posts/${post._id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-stone-500">
                    {post.scheduledAt
                      ? format(new Date(post.scheduledAt), "MMM d, yyyy HH:mm")
                      : "No date"}
                  </p>
                </li>
              )
            )}
            {stats.scheduledQueue.length === 0 ? (
              <li className="text-sm text-stone-500">Nothing scheduled.</li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}

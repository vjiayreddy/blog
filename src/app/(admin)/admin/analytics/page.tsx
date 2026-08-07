import { getAnalyticsSummary } from "@/app/actions/media-settings";
import Link from "next/link";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = Number(params.days || 30);
  const data = await getAnalyticsSummary(days);

  const max = Math.max(...data.viewsByDay.map((d: { count: number }) => d.count), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-stone-500">Page views over the last {days} days</p>
        </div>
        <div className="flex gap-2">
          {[7, 30].map((d) => (
            <Link
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                days === d ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-800"
              }`}
            >
              {d}d
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm text-stone-500">Total views</p>
        <p className="mt-1 text-3xl font-semibold">{data.totalViews}</p>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="font-semibold">Views by day</h2>
        <div className="mt-4 flex h-40 items-end gap-1">
          {data.viewsByDay.map((d: { date: string; count: number }) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-teal-800"
                style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 0 }}
                title={`${d.date}: ${d.count}`}
              />
            </div>
          ))}
          {data.viewsByDay.length === 0 ? (
            <p className="text-sm text-stone-500">No views yet.</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="font-semibold">Top posts</h2>
        <ul className="mt-4 space-y-2">
          {data.topPosts.map(
            (p: { postId: string; title: string; slug: string; count: number }) => (
              <li key={p.postId} className="flex justify-between text-sm">
                <span>
                  {p.slug ? (
                    <Link href={`/blog/${p.slug}`} className="hover:underline">
                      {p.title}
                    </Link>
                  ) : (
                    p.title
                  )}
                </span>
                <span className="text-stone-500">{p.count}</span>
              </li>
            )
          )}
          {data.topPosts.length === 0 ? (
            <li className="text-sm text-stone-500">No post views yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}

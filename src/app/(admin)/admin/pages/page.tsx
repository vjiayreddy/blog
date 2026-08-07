import Link from "next/link";
import { listPages } from "@/app/actions/content";
import { format } from "date-fns";

export default async function AdminPagesPage() {
  const pages = await listPages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          New page
        </Link>
      </div>
      <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        {pages.map((page: { _id: string; title: string; slug: string; status: string; updatedAt: string }) => (
          <li key={page._id} className="flex items-center justify-between px-4 py-3">
            <div>
              <Link href={`/admin/pages/${page._id}`} className="font-medium hover:underline">
                {page.title}
              </Link>
              <p className="text-xs text-stone-500">
                /{page.slug} · {page.status} · {format(new Date(page.updatedAt), "MMM d, yyyy")}
              </p>
            </div>
          </li>
        ))}
        {pages.length === 0 ? (
          <li className="px-4 py-8 text-sm text-stone-500">No pages yet.</li>
        ) : null}
      </ul>
    </div>
  );
}

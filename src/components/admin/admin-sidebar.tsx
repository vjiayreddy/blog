"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/constants";
import { hasMinRole } from "@/lib/rbac";

const NAV = [
  { href: "/admin", label: "Dashboard", minRole: "AUTHOR" as Role },
  { href: "/admin/posts", label: "Posts", minRole: "AUTHOR" as Role },
  { href: "/admin/pages", label: "Pages", minRole: "EDITOR" as Role },
  { href: "/admin/media", label: "Media", minRole: "AUTHOR" as Role },
  { href: "/admin/categories", label: "Categories", minRole: "EDITOR" as Role },
  { href: "/admin/tags", label: "Tags", minRole: "EDITOR" as Role },
  { href: "/admin/series", label: "Series", minRole: "EDITOR" as Role },
  { href: "/admin/users", label: "Users", minRole: "ADMIN" as Role },
  { href: "/admin/analytics", label: "Analytics", minRole: "ADMIN" as Role },
  { href: "/admin/settings", label: "Settings", minRole: "ADMIN" as Role },
];

export function AdminSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; role: Role };
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-stone-200 bg-stone-50">
      <div className="border-b border-stone-200 px-4 py-5">
        <Link href="/admin" className="text-lg font-semibold tracking-tight text-stone-900">
          Blog Portal
        </Link>
        <p className="mt-1 text-xs text-stone-500">Admin</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.filter((item) => hasMinRole(user.role, item.minRole)).map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-stone-900 text-white"
                  : "text-stone-700 hover:bg-stone-200"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-stone-200 p-4">
        <p className="truncate text-sm font-medium text-stone-900">{user.name}</p>
        <p className="truncate text-xs text-stone-500">{user.email}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-stone-400">{user.role}</p>
        <div className="mt-3 flex gap-2">
          <Link href="/" className="text-xs font-medium text-teal-800 hover:underline">
            View site
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-medium text-stone-600 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

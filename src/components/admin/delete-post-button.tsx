"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/content";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-xs text-red-700 hover:underline"
      onClick={() => {
        if (!confirm("Delete this post?")) return;
        startTransition(async () => {
          await deletePost(id);
          router.refresh();
        });
      }}
    >
      Delete
    </button>
  );
}

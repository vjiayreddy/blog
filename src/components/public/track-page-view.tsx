"use client";

import { useEffect } from "react";

export function TrackPageView({ path, postId }: { path: string; postId?: string }) {
  useEffect(() => {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        path,
        postId,
        referrer: document.referrer || undefined,
      }),
    });
  }, [path, postId]);

  return null;
}

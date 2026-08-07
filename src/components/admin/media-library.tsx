"use client";

import { useState, useTransition } from "react";
import { deleteMedia, updateMediaAlt } from "@/app/actions/media-settings";

type MediaItem = {
  _id: string;
  url: string;
  alt?: string;
  format?: string;
  width?: number;
  height?: number;
};

export function MediaLibrary({
  initialItems,
  canDelete,
}: {
  initialItems: MediaItem[];
  canDelete: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  async function onUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", file.name);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setItems((prev) => [
        {
          _id: data.id,
          url: data.url,
          alt: data.alt,
          width: data.width,
          height: data.height,
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Media library</h1>
          <p className="text-sm text-stone-500">Upload images to Cloudinary</p>
        </div>
        <label className="cursor-pointer rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white">
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
        </label>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <figure key={item._id} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt || ""} className="aspect-square w-full object-cover" />
            <figcaption className="space-y-2 p-3">
              <input
                defaultValue={item.alt || ""}
                placeholder="Alt text"
                className="w-full rounded border border-stone-200 px-2 py-1 text-xs"
                onBlur={(e) => {
                  const alt = e.target.value;
                  startTransition(async () => {
                    await updateMediaAlt(item._id, alt);
                    setItems((prev) =>
                      prev.map((m) => (m._id === item._id ? { ...m, alt } : m))
                    );
                  });
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-teal-800"
                  onClick={() => navigator.clipboard.writeText(item.url)}
                >
                  Copy URL
                </button>
                {canDelete ? (
                  <button
                    type="button"
                    disabled={pending}
                    className="text-xs font-medium text-red-700"
                    onClick={() =>
                      startTransition(async () => {
                        await deleteMedia(item._id);
                        setItems((prev) => prev.filter((m) => m._id !== item._id));
                      })
                    }
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-stone-500">No media yet. Upload your first image.</p>
      ) : null}
    </div>
  );
}

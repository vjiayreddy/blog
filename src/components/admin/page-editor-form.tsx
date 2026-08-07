"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LexicalEditor } from "@/components/editor/lexical-editor";
import { createPage, updatePage } from "@/app/actions/content";
import type { ContentStatus } from "@/lib/constants";

type PageFormProps = {
  mode: "create" | "edit";
  pageId?: string;
  initial?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    lexicalJSON?: string;
    html?: string;
    status?: ContentStatus;
    coverImage?: string;
    scheduledAt?: string | null;
    seo?: { title?: string; description?: string };
  };
};

export function PageEditorForm({ mode, pageId, initial }: PageFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [status, setStatus] = useState<ContentStatus>(initial?.status || "draft");
  const [message, setMessage] = useState("");
  const contentRef = useRef({
    lexicalJSON: initial?.lexicalJSON || "",
    html: initial?.html || "",
  });
  const currentId = useRef(pageId);

  const persist = useCallback(
    async (nextStatus?: ContentStatus) => {
      const payload = {
        title: title || "Untitled",
        slug: slug || undefined,
        excerpt,
        lexicalJSON: contentRef.current.lexicalJSON,
        html: contentRef.current.html,
        status: nextStatus || status,
        coverImage,
        seo: { title: title || undefined, description: excerpt || undefined },
      };
      try {
        if (mode === "create" && !currentId.current) {
          const created = await createPage(payload);
          currentId.current = created._id;
          router.replace(`/admin/pages/${created._id}`);
        } else if (currentId.current) {
          await updatePage(currentId.current, payload, { createRevision: true });
        }
        setMessage("Saved");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Save failed");
      }
    },
    [title, slug, excerpt, status, coverImage, mode, router]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (!title && !contentRef.current.lexicalJSON) return;
      startTransition(() => void persist());
    }, 10000);
    return () => clearInterval(timer);
  }, [persist, title]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{mode === "create" ? "New page" : "Edit page"}</h1>
          <p className="text-sm text-stone-500">{message || "Autosave every 10s"}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(async () => persist("draft"))}
            className="rounded-full bg-stone-200 px-4 py-2 text-sm font-medium"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setStatus("published");
                await persist("published");
              })
            }
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
          >
            Publish
          </button>
        </div>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page title"
        className="w-full border-0 border-b border-stone-200 bg-transparent pb-3 text-3xl font-semibold outline-none"
      />
      <LexicalEditor
        initialJSON={initial?.lexicalJSON}
        onChange={(payload) => {
          contentRef.current = payload;
        }}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Cover image URL</span>
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm lg:col-span-2">
          <span className="mb-1 block font-medium">Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
      </div>
    </div>
  );
}

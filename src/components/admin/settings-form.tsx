"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/actions/media-settings";

type Settings = {
  siteTitle: string;
  siteDescription?: string;
  logo?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  defaultSeo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          try {
            await updateSettings(form);
            setMessage("Settings saved");
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h1 className="text-2xl font-semibold">Site settings</h1>
      {(
        [
          ["siteTitle", "Site title"],
          ["siteDescription", "Site description"],
          ["logo", "Logo URL"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block text-sm">
          <span className="mb-1 block font-medium">{label}</span>
          <input
            value={(form[key] as string) || ""}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
      ))}
      <div className="grid gap-3 sm:grid-cols-2">
        {(["twitter", "github", "linkedin", "website"] as const).map((key) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium capitalize">{key}</span>
            <input
              value={form.socialLinks?.[key] || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  socialLinks: { ...f.socialLinks, [key]: e.target.value },
                }))
              }
              className="w-full rounded-md border border-stone-300 px-3 py-2"
            />
          </label>
        ))}
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Default SEO title</span>
        <input
          value={form.defaultSeo?.title || ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              defaultSeo: { ...f.defaultSeo, title: e.target.value },
            }))
          }
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Default SEO description</span>
        <textarea
          value={form.defaultSeo?.description || ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              defaultSeo: { ...f.defaultSeo, description: e.target.value },
            }))
          }
          rows={3}
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
      >
        Save settings
      </button>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
    </form>
  );
}

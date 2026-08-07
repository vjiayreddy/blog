import { notFound } from "next/navigation";
import { PageEditorForm } from "@/components/admin/page-editor-form";
import { getPage } from "@/app/actions/content";
import type { ContentStatus } from "@/lib/constants";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let page;
  try {
    page = await getPage(id);
  } catch {
    notFound();
  }

  return (
    <PageEditorForm
      mode="edit"
      pageId={page._id}
      initial={{
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        lexicalJSON: page.lexicalJSON,
        html: page.html,
        status: page.status as ContentStatus,
        coverImage: page.coverImage,
        scheduledAt: page.scheduledAt,
        seo: page.seo,
      }}
    />
  );
}

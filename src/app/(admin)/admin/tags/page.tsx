import { createTag, deleteTag, listTags, updateTag } from "@/app/actions/content";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

export default async function TagsPage() {
  const items = await listTags();
  return (
    <TaxonomyManager
      title="Tags"
      items={items.map((i: { _id: string; name: string; slug: string }) => ({
        _id: String(i._id),
        name: i.name,
        slug: i.slug,
      }))}
      onCreate={createTag}
      onUpdate={updateTag}
      onDelete={deleteTag}
    />
  );
}

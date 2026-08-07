import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/app/actions/content";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

export default async function CategoriesPage() {
  const items = await listCategories();
  return (
    <TaxonomyManager
      title="Categories"
      items={items.map((i: { _id: string; name: string; slug: string; description?: string }) => ({
        _id: String(i._id),
        name: i.name,
        slug: i.slug,
        description: i.description,
      }))}
      withDescription
      onCreate={createCategory}
      onUpdate={updateCategory}
      onDelete={deleteCategory}
    />
  );
}

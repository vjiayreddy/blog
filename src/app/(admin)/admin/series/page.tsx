import {
  createSeries,
  deleteSeries,
  listSeries,
  updateSeries,
} from "@/app/actions/content";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

export default async function SeriesPage() {
  const items = await listSeries();
  return (
    <TaxonomyManager
      title="Series"
      items={items.map((i: { _id: string; name: string; slug: string; description?: string }) => ({
        _id: String(i._id),
        name: i.name,
        slug: i.slug,
        description: i.description,
      }))}
      withDescription
      onCreate={createSeries}
      onUpdate={updateSeries}
      onDelete={deleteSeries}
    />
  );
}

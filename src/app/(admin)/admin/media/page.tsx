import { listMedia } from "@/app/actions/media-settings";
import { MediaLibrary } from "@/components/admin/media-library";
import { auth } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";
import type { Role } from "@/lib/constants";

export default async function MediaPage() {
  const session = await auth();
  const items = await listMedia();
  return (
    <MediaLibrary
      initialItems={items.map((m: { _id: string; url: string; alt?: string; format?: string; width?: number; height?: number }) => ({
        _id: m._id,
        url: m.url,
        alt: m.alt,
        format: m.format,
        width: m.width,
        height: m.height,
      }))}
      canDelete={hasMinRole(session!.user.role as Role, "ADMIN")}
    />
  );
}

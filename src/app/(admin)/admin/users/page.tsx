import { listUsers } from "@/app/actions/content";
import { UsersManager } from "@/components/admin/users-manager";
import { auth } from "@/lib/auth";
import type { Role } from "@/lib/constants";

export default async function UsersPage() {
  const session = await auth();
  const users = await listUsers();
  return <UsersManager users={users} actorRole={session!.user.role as Role} />;
}

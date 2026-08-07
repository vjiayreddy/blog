"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/app/actions/content";
import { ROLES, type Role } from "@/lib/constants";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
};

export function UsersManager({
  users,
  actorRole,
}: {
  users: UserRow[];
  actorRole: Role;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("AUTHOR");
  const [error, setError] = useState("");

  const assignable = ROLES.filter((r) => {
    if (r === "READER") return false;
    if (actorRole === "OWNER") return true;
    return r !== "OWNER" && r !== "ADMIN";
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <form
        className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          startTransition(async () => {
            try {
              await createUser({ name, email, password, role });
              setName("");
              setEmail("");
              setPassword("");
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed");
            }
          });
        }}
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        >
          {assignable.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white md:col-span-2"
        >
          Create user
        </button>
        {error ? <p className="text-sm text-red-700 md:col-span-2">{error}</p> : null}
      </form>

      <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
        {users.map((user) => (
          <li key={user._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-stone-500">
                {user.email} · {user.role} · {user.status}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                defaultValue={user.role}
                className="rounded border border-stone-300 px-2 py-1 text-xs"
                onChange={(e) => {
                  const next = e.target.value as Role;
                  startTransition(async () => {
                    await updateUser(user._id, { role: next });
                    router.refresh();
                  });
                }}
              >
                {assignable.concat(user.role === "OWNER" ? (["OWNER"] as Role[]) : []).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-xs text-stone-600 hover:underline"
                onClick={() =>
                  startTransition(async () => {
                    await updateUser(user._id, {
                      status: user.status === "active" ? "disabled" : "active",
                    });
                    router.refresh();
                  })
                }
              >
                {user.status === "active" ? "Disable" : "Enable"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-full rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <Suspense fallback={<p>Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

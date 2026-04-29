import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin · Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-6 px-4 py-20">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Admin sign-in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Single password — set via <code>ADMIN_PASSWORD</code>.
        </p>
      </header>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

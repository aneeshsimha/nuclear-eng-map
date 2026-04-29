import { AdminConsole } from "@/components/admin/AdminConsole";

export const metadata = { title: "Admin · Add company" };

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:py-14">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add a company</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Submit a name (and optional URL or notes). The agent researches the
          company on the open web and opens a pull request adding it to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[12px]">
            data/companies.ts
          </code>
          . Review the PR and merge to publish.
        </p>
      </header>
      <AdminConsole />
    </main>
  );
}

"use client";

import { useState } from "react";

interface JobOk {
  id: string;
  status: "ok";
  name: string;
  prUrl: string;
  prNumber: number;
  description: string;
  bucket: string;
  subsector: string;
}

interface JobErr {
  id: string;
  status: "error";
  name: string;
  error: string;
  stage?: "research" | "pr";
}

interface JobPending {
  id: string;
  status: "pending";
  name: string;
  startedAt: number;
}

type Job = JobOk | JobErr | JobPending;

export function AdminConsole() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = crypto.randomUUID();
    const trimmedName = name.trim();
    setJobs((prev) => [
      { id, status: "pending", name: trimmedName, startedAt: Date.now() },
      ...prev,
    ]);
    setSubmitting(true);
    setName("");
    setUrl("");
    setNotes("");

    try {
      const res = await fetch("/api/admin/research-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          url: url.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | {
            ok: boolean;
            stage?: "research" | "pr";
            error?: string;
            prUrl?: string;
            prNumber?: number;
            company?: {
              description: string;
              bucket: string;
              subsector: string;
            };
          }
        | null;

      setJobs((prev) =>
        prev.map((j) => {
          if (j.id !== id) return j;
          if (!data || !data.ok) {
            return {
              id,
              status: "error",
              name: trimmedName,
              error: data?.error ?? `HTTP ${res.status}`,
              stage: data?.stage,
            };
          }
          return {
            id,
            status: "ok",
            name: trimmedName,
            prUrl: data.prUrl!,
            prNumber: data.prNumber!,
            description: data.company?.description ?? "",
            bucket: data.company?.bucket ?? "",
            subsector: data.company?.subsector ?? "",
          };
        }),
      );
    } catch (err) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? {
                id,
                status: "error",
                name: trimmedName,
                error: err instanceof Error ? err.message : String(err),
              }
            : j,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Company name <span className="text-red-600">*</span>
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Last Energy"
            required
            className="rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Website (optional)</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://lastenergy.com"
            className="rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Notes for the agent (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="anything you want the agent to verify or look for"
            className="rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="self-start rounded bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {submitting ? "Researching…" : "Research and open PR"}
        </button>
        <p className="text-[12px] text-muted-foreground">
          Research takes ~30–90 seconds. Don&apos;t close the tab — jobs only
          live in this browser session.
        </p>
      </form>

      {jobs.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Jobs this session
          </h2>
          <ul className="flex flex-col gap-2">
            {jobs.map((j) => (
              <li
                key={j.id}
                className="rounded border border-border bg-card px-3 py-2 text-sm"
              >
                <JobRow job={j} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
  if (job.status === "pending") {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{job.name}</span>
        <span className="text-xs text-muted-foreground">researching…</span>
      </div>
    );
  }
  if (job.status === "error") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{job.name}</span>
          <span className="text-xs text-red-600">
            failed{job.stage ? ` at ${job.stage}` : ""}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{job.error}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{job.name}</span>
        <a
          href={job.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline underline-offset-2"
        >
          PR #{job.prNumber} ↗
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        {job.bucket} → {job.subsector}
      </p>
      {job.description && (
        <p className="text-xs text-muted-foreground">{job.description}</p>
      )}
    </div>
  );
}

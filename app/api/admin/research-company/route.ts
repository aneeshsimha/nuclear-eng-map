import { z } from "zod";
import { researchCompany } from "@/lib/ai/research";
import { openCompanyPr } from "@/lib/github/open-pr";

export const runtime = "nodejs";
export const maxDuration = 300;

const RequestSchema = z.object({
  name: z.string().min(1).max(120),
  url: z.string().url().optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "bad request", detail: parsed.error.format() },
      { status: 400 },
    );
  }

  const research = await researchCompany(parsed.data);
  if (!research.ok) {
    return Response.json(
      { ok: false, stage: "research", error: research.error, detail: research.detail },
      { status: 502 },
    );
  }

  const pr = await openCompanyPr({
    research: research.company,
    notes: parsed.data.notes,
    modelId: research.modelId,
  });
  if (!pr.ok) {
    return Response.json(
      {
        ok: false,
        stage: "pr",
        error: pr.error,
        company: research.company,
      },
      { status: 502 },
    );
  }

  return Response.json({
    ok: true,
    prUrl: pr.prUrl,
    prNumber: pr.prNumber,
    branch: pr.branch,
    company: research.company,
  });
}

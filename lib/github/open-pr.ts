import { Octokit } from "@octokit/rest";
import type { CompanyResearch } from "@/lib/ai/schema";
import { insertCompany } from "@/lib/insert";
import type { Company } from "@/lib/types";

const COMPANIES_PATH = "data/companies.ts";

export interface PrInput {
  research: CompanyResearch;
  notes?: string;
  modelId?: string;
}

export type PrResult =
  | { ok: true; prUrl: string; prNumber: number; branch: string }
  | { ok: false; error: string };

export async function openCompanyPr(input: PrInput): Promise<PrResult> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_BASE_BRANCH || "main";
  if (!token || !owner || !repo) {
    return { ok: false, error: "GITHUB_TOKEN/OWNER/REPO not set" };
  }
  const octokit = new Octokit({ auth: token });
  const { research, notes, modelId } = input;
  const { sources: _sources, ...companyFields } = research;
  void _sources;
  const company = companyFields as Company;

  let existing: string;
  let sha: string;
  try {
    const file = await octokit.repos.getContent({
      owner,
      repo,
      path: COMPANIES_PATH,
      ref: baseBranch,
    });
    if (Array.isArray(file.data) || file.data.type !== "file") {
      return { ok: false, error: `${COMPANIES_PATH} is not a regular file` };
    }
    existing = Buffer.from(file.data.content, "base64").toString("utf8");
    sha = file.data.sha;
  } catch (err) {
    return {
      ok: false,
      error: `read ${COMPANIES_PATH} failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  let next: string;
  try {
    next = insertCompany(existing, company);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  const ts = Date.now();
  const branch = `ai/add-${research.slug}-${ts}`;

  try {
    const baseRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: baseRef.data.object.sha,
    });
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: COMPANIES_PATH,
      branch,
      sha,
      message: `Add ${research.name} to nuclear map`,
      content: Buffer.from(next, "utf8").toString("base64"),
    });
    const pr = await octokit.pulls.create({
      owner,
      repo,
      head: branch,
      base: baseBranch,
      title: `Add ${research.name} to nuclear map`,
      body: renderPrBody(research, notes, modelId),
    });
    return {
      ok: true,
      prUrl: pr.data.html_url,
      prNumber: pr.data.number,
      branch,
    };
  } catch (err) {
    return {
      ok: false,
      error: `github: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

function renderPrBody(
  c: CompanyResearch,
  notes: string | undefined,
  modelId: string | undefined,
): string {
  const lines: (string | null)[] = [
    "🤖 Auto-drafted by the nuclear-map admin agent. Review the fields below before merging.",
    "",
    "## Filled fields",
    `- **Bucket:** ${c.bucket} → ${c.subsector}`,
    `- **Stage:** ${c.stage}`,
    `- **Domain:** ${c.domain}${c.reactorType ? ` (reactor: ${c.reactorType})` : ""}`,
    `- **Region:** ${c.region}`,
    `- **Types:** ${c.types.join(", ")}`,
    c.funding
      ? `- **Funding:** ${[c.funding.amount, c.funding.round, c.funding.lead].filter(Boolean).join(" · ")}`
      : null,
    c.badge ? `- **Badge:** ${c.badge}` : null,
    `- **Description:** ${c.description}`,
    "",
    "## Sources",
    ...c.sources.map((s) => `- ${s}`),
    notes ? `\n## Submitter notes\n${notes}` : null,
    "",
    "## Review checklist",
    "- [ ] Bucket and subsector are correct",
    "- [ ] Stage matches public funding info",
    "- [ ] Description is accurate and grounded in the cited sources",
    "- [ ] Logo URL renders",
    "- [ ] No duplicate slug exists in `data/companies.ts`",
    modelId ? `\n_Model: \`${modelId}\`_` : null,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

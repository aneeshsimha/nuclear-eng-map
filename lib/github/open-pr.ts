import { Octokit } from "@octokit/rest";
import type { CompanyResearch } from "@/lib/ai/schema";
import { insertCompany } from "@/lib/insert";
import type { Company } from "@/lib/types";

function pathFor(energyType: CompanyResearch["energyType"]): string {
  return `data/${energyType}.ts`;
}

export interface PrInput {
  research: CompanyResearch;
  notes?: string;
  modelId?: string;
}

export type PrResult =
  | { ok: true; prUrl: string; prNumber: number; branch: string; path: string }
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
  // strip `sources` (PR-body only) and `energyType` (file's .map adds it back).
  const {
    sources: _sources,
    energyType: _energyType,
    ...companyFields
  } = research;
  void _sources;
  void _energyType;
  const company = companyFields as Omit<Company, "energyType"> as Company;

  const filePath = pathFor(research.energyType);

  let existing: string;
  let sha: string;
  try {
    const file = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: baseBranch,
    });
    if (Array.isArray(file.data) || file.data.type !== "file") {
      return { ok: false, error: `${filePath} is not a regular file` };
    }
    existing = Buffer.from(file.data.content, "base64").toString("utf8");
    sha = file.data.sha;
  } catch (err) {
    return {
      ok: false,
      error: `read ${filePath} failed: ${err instanceof Error ? err.message : String(err)}`,
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
      path: filePath,
      branch,
      sha,
      message: `Add ${research.name} (${research.energyType})`,
      content: Buffer.from(next, "utf8").toString("base64"),
    });
    const pr = await octokit.pulls.create({
      owner,
      repo,
      head: branch,
      base: baseBranch,
      title: `Add ${research.name} (${research.energyType})`,
      body: renderPrBody(research, notes, modelId),
    });
    return {
      ok: true,
      prUrl: pr.data.html_url,
      prNumber: pr.data.number,
      branch,
      path: filePath,
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
    "🤖 Auto-drafted by the energy-map admin agent. Review the fields below before merging.",
    "",
    "## Filled fields",
    `- **Energy:** ${c.energyType}`,
    `- **Bucket:** ${c.bucket} → ${c.subsector}`,
    `- **Stage:** ${c.stage}`,
    c.domain
      ? `- **Domain:** ${c.domain}${c.reactorType ? ` (reactor: ${c.reactorType})` : ""}`
      : null,
    c.maturity ? `- **Maturity:** ${c.maturity}` : null,
    c.customer ? `- **Customer:** ${c.customer}` : null,
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
    "- [ ] Energy type, bucket, and subsector are correct",
    "- [ ] Stage matches public funding info",
    "- [ ] Description is accurate and grounded in the cited sources",
    "- [ ] Logo URL renders",
    `- [ ] No duplicate slug exists in \`data/${c.energyType}.ts\``,
    modelId ? `\n_Model: \`${modelId}\`_` : null,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

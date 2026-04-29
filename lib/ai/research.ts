import { generateObject } from "ai";
import { CompanyResearchSchema, type CompanyResearch } from "./schema";
import { RESEARCH_SYSTEM_PROMPT } from "./prompts";

const DEFAULT_MODEL = "perplexity/sonar-pro";

export interface ResearchInput {
  name: string;
  url?: string;
  notes?: string;
}

export type ResearchResult =
  | { ok: true; company: CompanyResearch; modelId: string }
  | { ok: false; error: string; detail?: unknown };

export async function researchCompany(
  input: ResearchInput,
): Promise<ResearchResult> {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return {
      ok: false,
      error:
        "AI_GATEWAY_API_KEY not set (or deploy to Vercel where OIDC token is auto-injected)",
    };
  }

  const modelId = process.env.AI_MODEL_ID || DEFAULT_MODEL;

  const prompt = [
    "Research this company and produce its profile entry for the energy market map.",
    `Name: ${input.name}`,
    input.url ? `Website (caller-provided): ${input.url}` : null,
    input.notes ? `Caller notes: ${input.notes}` : null,
    "",
    "Use live web search. Pick the right energyType + bucket + subsector from the taxonomy. Cite your sources.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await generateObject({
      model: modelId,
      system: RESEARCH_SYSTEM_PROMPT,
      prompt,
      schema: CompanyResearchSchema,
      abortSignal: AbortSignal.timeout(180_000),
    });
    return { ok: true, company: result.object, modelId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      detail: err,
    };
  }
}

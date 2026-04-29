import { generateText, Output, stepCountIs } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { CompanyResearchSchema, type CompanyResearch } from "./schema";
import { webSearch, fetchUrl } from "./tools";
import { RESEARCH_SYSTEM_PROMPT } from "./prompts";

const HF_BASE_URL = "https://router.huggingface.co/v1";
const DEFAULT_MODEL = "meta-llama/Llama-3.3-70B-Instruct";

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
  const apiKey = process.env.HF_TOKEN;
  if (!apiKey) return { ok: false, error: "HF_TOKEN not set" };
  if (!process.env.EXA_API_KEY) return { ok: false, error: "EXA_API_KEY not set" };

  const provider = createOpenAICompatible({
    name: "huggingface",
    baseURL: HF_BASE_URL,
    apiKey,
  });

  const modelId = process.env.HF_MODEL_ID || DEFAULT_MODEL;

  const prompt = [
    "Research this company and produce its profile entry for the nuclear engineering market map.",
    `Name: ${input.name}`,
    input.url ? `Website (caller-provided): ${input.url}` : null,
    input.notes ? `Caller notes: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await generateText({
      model: provider(modelId),
      system: RESEARCH_SYSTEM_PROMPT,
      prompt,
      tools: { web_search: webSearch, fetch_url: fetchUrl },
      stopWhen: stepCountIs(8),
      output: Output.object({ schema: CompanyResearchSchema }),
      abortSignal: AbortSignal.timeout(270_000),
    });

    const out = (result as { output?: unknown }).output;
    if (!out) {
      return { ok: false, error: "agent returned no structured output" };
    }
    return { ok: true, company: out as CompanyResearch, modelId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      detail: err,
    };
  }
}

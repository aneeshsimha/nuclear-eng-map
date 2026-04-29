import { tool } from "ai";
import { z } from "zod";
import Exa from "exa-js";

let _exa: Exa | null = null;
function exa(): Exa {
  if (!_exa) {
    if (!process.env.EXA_API_KEY) throw new Error("EXA_API_KEY not set");
    _exa = new Exa(process.env.EXA_API_KEY);
  }
  return _exa;
}

export const webSearch = tool({
  description:
    "Search the web for information about a company. Returns up to 5 results with cleaned page text. Use this to ground every factual claim.",
  inputSchema: z.object({
    query: z
      .string()
      .describe('Natural-language query, e.g. "Last Energy reactor company funding"'),
    numResults: z.number().int().min(1).max(8).optional(),
  }),
  execute: async ({ query, numResults }) => {
    const { results } = await exa().searchAndContents(query, {
      numResults: numResults ?? 5,
      text: true,
      livecrawl: "preferred",
    });
    return {
      results: results.map((r) => ({
        title: r.title ?? null,
        url: r.url,
        publishedDate: r.publishedDate ?? null,
        text: (r.text ?? "").slice(0, 4000),
      })),
    };
  },
});

export const fetchUrl = tool({
  description:
    "Fetch a single URL and return its plain text content. Use only when you have a specific URL (e.g., a company homepage) that web_search did not surface.",
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ url }) => {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "NuclearMapBot/0.1" },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        return { ok: false as const, status: res.status, error: `HTTP ${res.status}` };
      }
      const html = await res.text();
      const text = stripHtml(html).slice(0, 8000);
      return { ok: true as const, status: res.status, text };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

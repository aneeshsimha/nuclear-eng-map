import type { Company } from "@/lib/types";

export function renderCompanyLiteral(c: Company, indent = 2): string {
  const json = JSON.stringify(c, null, 2);
  const unquoted = json.replace(/^(\s*)"([a-zA-Z_][\w]*)":/gm, "$1$2:");
  const pad = " ".repeat(indent);
  const indented = unquoted
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
  return indented + ",";
}

export function insertCompany(source: string, company: Company): string {
  const lines = source.split("\n");
  let closingIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^\s*\];/.test(lines[i])) {
      closingIdx = i;
      break;
    }
  }
  if (closingIdx === -1) {
    throw new Error("could not find closing `];` of COMPANIES array");
  }
  const literal = renderCompanyLiteral(company);
  lines.splice(closingIdx, 0, literal);
  return lines.join("\n");
}

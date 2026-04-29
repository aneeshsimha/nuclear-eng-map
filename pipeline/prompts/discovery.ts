export function buildDiscoveryQueries(category: string): string[] {
  return [
    `${category} energy startup company venture backed funding 2020 2021 2022 2023 2024 2025`,
    `${category} energy technology startup seed Series A Series B funding round`,
    `emerging ${category} energy company crunchbase pitchbook venture capital`,
  ];
}

export const DISCOVERY_EXCLUDE_DOMAINS = [
  'ge.com',
  'siemens.com',
  'shell.com',
  'bp.com',
  'exxon.com',
  'chevron.com',
  'totalenergies.com',
  'equinor.com',
  'vestas.com',
  'orsted.com',
];

export const DISCOVERY_INCLUDE_DOMAINS = [
  'crunchbase.com',
  'pitchbook.com',
  'techcrunch.com',
  'bloomberg.com',
  'reuters.com',
  'axios.com',
  'electrek.co',
  'greentechmedia.com',
  'canary.media',
];

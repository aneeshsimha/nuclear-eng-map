# Energy Map — To-Do

## Pipeline / Enrichment

- [ ] **Better input to Perplexity** — currently passing a thin Exa snippet; explicitly instruct Perplexity to search the web for the company's homepage, Crunchbase profile, and recent funding news before classifying
- [ ] **Compute confidence ourselves** — don't trust the model's self-reported score; derive it from how many fields came back non-null / valid
- [ ] **Fix silent fallback defaults** — `rd_concept` and `utility_grid` fallbacks are wrong more often than right; route invalid/empty classifications to the review queue instead
- [ ] **Improve `devPhase` prompt guidance** — add concrete real-world examples to anchor each phase (`rd_concept` / `pilot_beta` / `commercial` / `public_ipo`)
- [ ] **Tighten deduplication** — domain-based dedup misses cases where the Exa source URL (e.g. crunchbase.com/...) differs from the company's canonical website

## Frontend

*(nothing yet)*

## Data

*(nothing yet)*

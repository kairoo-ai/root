// Offline-safe eval runner for the Kairoo AI engine.
// Usage: npm run evals
// If the provider is unavailable (no key / offline), cases are reported as
// SKIP rather than FAIL so the scaffold is safe to run in CI without live keys.

import { generate } from "../generate";
import { cases } from "./cases";

type Outcome = "PASS" | "FAIL" | "SKIP";

async function runOne(
  c: (typeof cases)[number]
): Promise<{ outcome: Outcome; detail: string }> {
  let text: string;
  try {
    text = await generate(c.featureId, c.inputs);
  } catch (e) {
    return {
      outcome: "SKIP",
      detail: `generation unavailable (${e instanceof Error ? e.message : String(e)})`,
    };
  }

  const lower = text.toLowerCase();
  const fails: string[] = [];

  if (c.minLength && text.length < c.minLength) {
    fails.push(`too short (${text.length} < ${c.minLength})`);
  }

  if (
    c.expectIncludesAny &&
    !c.expectIncludesAny.some((k) => lower.includes(k.toLowerCase()))
  ) {
    fails.push(`missing any of [${c.expectIncludesAny.join(", ")}]`);
  }

  if (c.bannedPhrases) {
    const hit = c.bannedPhrases.filter((p) =>
      lower.includes(p.toLowerCase())
    );
    if (hit.length) fails.push(`banned phrase(s): ${hit.join(", ")}`);
  }

  return fails.length
    ? { outcome: "FAIL", detail: fails.join("; ") }
    : { outcome: "PASS", detail: "ok" };
}

async function main() {
  console.log(`Running ${cases.length} eval case(s)...\n`);

  let pass = 0,
    fail = 0,
    skip = 0;

  for (const c of cases) {
    const r = await runOne(c);
    if (r.outcome === "PASS") pass++;
    else if (r.outcome === "FAIL") fail++;
    else skip++;
    console.log(`[${r.outcome}] ${c.name} - ${r.detail}`);
  }

  console.log(
    `\n${pass} passed, ${fail} failed, ${skip} skipped (of ${cases.length}).`
  );
  process.exit(fail > 0 ? 1 : 0);
}

main();

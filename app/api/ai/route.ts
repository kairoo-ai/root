import { NextRequest, NextResponse } from "next/server";
import { getTool } from "@/lib/ai-tools";
import { generate } from "@/lib/ai/gateway";
import { compose } from "@/lib/ai/prompts/compose";
import { noopRetriever } from "@/lib/ai/retrieval/noop";
import { validateInput } from "@/lib/ai/guardrails/input";
import { rateLimit } from "@/lib/ai/guardrails/rateLimit";
import { sanitizeOutput } from "@/lib/ai/guardrails/output";

const COMING_SOON_MESSAGE =
  "This feature isn't built yet — it needs user accounts and saved data the app doesn't have today. It's marked \"Coming soon\" rather than faked.";

export async function POST(request: NextRequest) {
  const id = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const rl = rateLimit(id);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } }
    );
  }

  const parsed = validateInput(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 });

  const tool = getTool(parsed.value.toolId);
  if (!tool) return NextResponse.json({ error: `Unknown tool: ${parsed.value.toolId}` }, { status: 400 });
  if (tool.status === "coming-soon") return NextResponse.json({ result: COMING_SOON_MESSAGE });

  const userPrompt = tool.buildUserPrompt(parsed.value.inputs);
  const context = await noopRetriever.retrieve(userPrompt);
  const messages = compose({ systemAddendum: tool.systemAddendum, userPrompt, context });

  const result = await generate({ messages, tier: tool.tier, maxOutputTokens: 2048 });
  if (!result.ok) {
    return NextResponse.json(
      { error: "AI is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }
  return NextResponse.json({ result: sanitizeOutput(result.value.text) || "AI response unavailable." });
}

import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/engines/ai";
import { rateLimit, validateInput } from "@/services/ai";
import { AppError } from "@/lib/errors";

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

  try {
    const result = await generate(parsed.value.toolId, parsed.value.inputs);
    return NextResponse.json({ result });
  } catch (e) {
    const status = e instanceof AppError ? e.httpStatus ?? 500 : 500;
    const message =
      status >= 500 ? "AI is temporarily unavailable. Please try again." : (e instanceof Error ? e.message : "Request failed.");
    return NextResponse.json({ error: message }, { status });
  }
}

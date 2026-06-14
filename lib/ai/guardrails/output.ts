export function sanitizeOutput(text: string): string {
  return text.replace(/^\s*(system:|SYSTEM PROMPT)[\s\S]*?\n/i, "").trim();
}

export function safeParseJson<T = unknown>(text: string): { ok: true; data: T } | { ok: false } {
  try {
    const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
    return { ok: true, data: JSON.parse(cleaned) as T };
  } catch {
    return { ok: false };
  }
}

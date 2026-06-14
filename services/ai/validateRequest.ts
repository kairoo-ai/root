import { z } from "zod";

const MAX_FIELD = 4000;
const MAX_TOTAL = 12000;

export const requestSchema = z.object({
  toolId: z.string().min(1).max(64),
  inputs: z.record(z.string(), z.string().max(MAX_FIELD)).default({}),
});

export type ParsedRequest = z.infer<typeof requestSchema>;

export function validateInput(body: unknown): { ok: true; value: ParsedRequest } | { ok: false; message: string } {
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return { ok: false, message: "Invalid request." };
  const total = Object.values(parsed.data.inputs).join("").length;
  if (total > MAX_TOTAL) return { ok: false, message: "Input too large." };
  return { ok: true, value: parsed.data };
}

import { sql } from "drizzle-orm";
import { db } from "@/data/client";
import { RATE_WINDOW_MS, RATE_MAX_REQ } from "./window";

export async function rateLimit(
  id: string,
  windowMs: number = RATE_WINDOW_MS,
  maxReq: number = RATE_MAX_REQ,
): Promise<{ ok: boolean; retryAfter?: number }> {
  const key = `ai:${id}`;
  const interval = `${windowMs} milliseconds`;
  try {
    const rows = (await db.execute(sql`
      INSERT INTO rate_limit_buckets (key, window_start, count)
      VALUES (${key}, now(), 1)
      ON CONFLICT (key) DO UPDATE SET
        window_start = CASE
          WHEN rate_limit_buckets.window_start < now() - ${interval}::interval
          THEN now() ELSE rate_limit_buckets.window_start END,
        count = CASE
          WHEN rate_limit_buckets.window_start < now() - ${interval}::interval
          THEN 1 ELSE rate_limit_buckets.count + 1 END
      RETURNING count,
        GREATEST(1, CEIL(EXTRACT(EPOCH FROM
          (window_start + ${interval}::interval - now()))))::int AS retry_after
    `)) as unknown as { rows: { count: number; retry_after: number }[] };

    const row = rows.rows[0];
    if (row && row.count > maxReq) {
      return { ok: false, retryAfter: row.retry_after };
    }
    return { ok: true };
  } catch (e) {
    console.error("[rateLimit] db error, failing open:", e);
    return { ok: true };
  }
}

import { describe, it, expect, vi, beforeEach } from "vitest";

const ORIGINAL = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = {
    ...ORIGINAL,
    COMPUTE_SERVICE_URL: "https://x.hf.space",
    COMPUTE_SHARED_SECRET: "s",
  };
});

describe("embed()", () => {
  it("sends bearer auth and returns parsed vectors", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ model: "m", dim: 2, vectors: [[1, 2]] }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const { embed } = await import("./client");
    const out = await embed(["hi"]);
    expect(out).toEqual([[1, 2]]);
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer s",
    );
  });

  it("throws on malformed response shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ nope: true }), { status: 200 }),
        ),
    );
    const { embed } = await import("./client");
    await expect(embed(["hi"])).rejects.toThrow();
  });
});

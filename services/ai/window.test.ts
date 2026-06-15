import { describe, it, expect } from "vitest";
import { nextBucketState, computeRetryAfterSec } from "./window";

describe("nextBucketState", () => {
  it("starts a fresh bucket when none exists", () => {
    expect(nextBucketState(null, 1000, 5000)).toEqual({
      windowStart: 1000,
      count: 1,
    });
  });

  it("increments within the window", () => {
    const prev = { windowStart: 1000, count: 3 };
    expect(nextBucketState(prev, 2000, 5000)).toEqual({
      windowStart: 1000,
      count: 4,
    });
  });

  it("rolls over when the window has elapsed", () => {
    const prev = { windowStart: 1000, count: 19 };
    expect(nextBucketState(prev, 7000, 5000)).toEqual({
      windowStart: 7000,
      count: 1,
    });
  });

  it("rolls over exactly at the window boundary", () => {
    const prev = { windowStart: 1000, count: 10 };
    expect(nextBucketState(prev, 6000, 5000)).toEqual({
      windowStart: 6000,
      count: 1,
    });
  });
});

describe("computeRetryAfterSec", () => {
  it("returns whole seconds remaining in the window", () => {
    expect(computeRetryAfterSec(1000, 5000, 2000)).toBe(4);
  });
  it("never returns less than 1", () => {
    expect(computeRetryAfterSec(1000, 5000, 5999)).toBe(1);
    expect(computeRetryAfterSec(1000, 5000, 9000)).toBe(1);
  });
});

# services

Per-user **orchestration + policy** layer. Each subfolder owns one concern and
exposes typed, side-effect-free stubs that compose `@/lib`, `@/config`, and
`@/types`. Route handlers and server actions call into `services/*`; they never
talk to upstreams directly.

> Reserved skeleton — no business logic yet. Every export is a typed
> placeholder that throws `Error("Not implemented")` or returns a typed default.

## Layers

| Layer                    | Responsibility                                                            |
| ------------------------ | ------------------------------------------------------------------------- |
| `services/auth`          | Session / identity resolution for the current request.                    |
| `services/billing`       | Plan + subscription state (Stripe-shaped, no SDK yet).                    |
| `services/entitlements`  | What a user is *allowed* to do (feature gates derived from plan).         |
| `services/usage`         | Metering + cost accounting; the read side of the AI cost-cap.             |
| `services/ai`            | AI feature orchestration; the enforcement side of the AI cost-cap.        |
| `services/notifications` | Outbound user notifications (email / in-app), no transport wired yet.     |

## Where AI cost-caps live

Cost-capping is split across two layers on purpose:

1. **`services/usage`** — the *source of truth*. Tracks per-user spend/quota and
   answers "how much budget is left?" (`getRemainingBudget`, `recordUsage`).
2. **`services/ai`** — the *enforcement point*. Before running a feature,
   `runAiFeature` is responsible for consulting `services/usage` (and
   `services/entitlements`) and refusing once a cap is hit.

Keeping the ledger (`usage`) separate from the gate (`ai`) means billing,
analytics, and other callers can read budget without importing the AI runtime.

## Conventions

- Config-as-code: `export const x = { ... } as const; export type X = typeof x`.
- Functions are typed stubs only — no network/DB/AI calls at module scope.
- Cross-area imports from `@/types`, `@/config`, and `@/lib` only.

# services/usage

Metering + cost accounting - the **read side** (source of truth) of the AI
cost-cap. Tracks per-user spend/quota and answers "how much budget is left?".
`services/ai` enforces the cap by consulting this layer.

Reserved skeleton - no business logic yet.

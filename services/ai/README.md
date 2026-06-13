# services/ai

AI feature orchestration and the **enforcement side** of the AI cost-cap.
`runAiFeature` is the single entry point: it resolves entitlements, checks the
remaining budget via `services/usage`, runs the feature, and records spend.

Reserved skeleton — no business logic yet. The Gemini call, prompt assembly,
and quota enforcement are all `// TODO`.

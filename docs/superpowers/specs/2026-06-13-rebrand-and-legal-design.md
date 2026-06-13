# Rebrand & Legal Foundation — Design Doc

**Date:** 2026-06-13
**Owner:** Eshank Tyagi (eshank@matters.ai)
**Current name:** AstraPath AI (to be replaced)
**Status:** In progress — Section 1 (Strategy) locked; Naming, Brand Identity, and Legal pending.

> This document is the single source of truth for the rebrand. Nothing decided in
> brainstorming should be lost — every decision is recorded here with its reasoning.

---

## 1. Audience & Monetization Strategy — ✅ LOCKED

### 1.1 The product (context)
An AI-powered career development & learning platform. Capabilities today: AI career
tools (interview coaching, salary negotiation, etc.), AI-curated learning paths,
team/workforce analytics, and strategic/market intelligence views. Built on Next.js 16,
React 19, TypeScript, Google Gemini. Currently mid-pivot from "bragging about
capabilities" toward shipping real, usable features.

### 1.2 Audience model — one platform, three doors, tiered

The product is **a single platform with tiered gating** (NOT three separate products).
The brand must "grow with the user": **free → pro → team**.

| Tier | Segment | Role in strategy | Monetization |
|------|---------|------------------|--------------|
| **Free** | Students, early-career, job seekers, career switchers | Acquisition engine / land-grab / word-of-mouth; solves cold-start | Free (funnel) |
| **Pro (paid, self-serve)** | Working professionals upskilling | Self-serve revenue, no sales call | Individual subscription |
| **Primary (revenue ceiling)** | Enterprises / teams (B2B) | Highest revenue, predictable contracts; land-and-expand from individual usage inside a company | Team/enterprise contracts |

**Primary audience = Enterprises/teams.** The brand is deliberately designed to *also*
welcome the individual working professional, with a genuine free tier underneath for
students / early-career / job seekers.

### 1.3 Why this strategy (reasoning captured)
- **Free tier** solves the cold-start problem: cheap acquisition, virality, and a pool of
  users who *become* paid professionals as their careers progress.
- **Pro tier** monetizes self-serve with premium/aspirational pricing and low churn.
- **Enterprise** is the revenue ceiling; individual/free usage *inside* a company becomes
  the wedge ("12 people at Acme already use this → here's a team plan"). Classic
  **freemium land-and-expand** (cf. Gloat, Torch, BetterUp).

### 1.4 Trade-offs acknowledged
- Enterprise-primary means **slower validation** (needs design partners + a sales motion),
  so the brand must stay usable by an *individual* (land-and-expand, not top-down only).
- B2B buyers will eventually require **DPA, security/compliance, GDPR specifics,
  sub-processor lists** — heavier legal than a consumer app (see Section 4).

### 1.5 Guardrails / things to improve (carry into build)
1. **Free must be a funnel, not a cost sink.** Design free around the moments users
   outgrow it (usage caps on AI tools, no analytics, no team features) so they *graduate*:
   job seeker → lands job → working professional → upsell.
2. **One product, three doors — not three products.** Single platform, tiered gating, to
   avoid fragmenting build effort (supports the "build real features" pivot).
3. **Name/identity must sit across all three** — must not scream "enterprise" OR "students."
   This is the core naming constraint.
4. **Free needs a guardrail** — student-email verification and/or usage caps, or Gemini/AI
   costs balloon. Pricing & brand pages must account for this.

### 1.6 Brand direction implied by strategy
A name + identity that feels **credible + aspirational, professional yet personal** —
premium enough for enterprises and pros, warm/approachable enough for individuals and
students. The unifying brand story is **"grows with you"** (free → pro → team).

---

## 2. Product Name — ⏳ PENDING

_To be filled in next._

---

## 3. Brand Identity — ⏳ PENDING

_Logo concept, color palette, typography, voice/tone, tagline. To be filled in._

---

## 4. Legal Pages — ⏳ PENDING

_Privacy Policy, Terms of Service, and B2B/freemium-specific docs (Cookie Policy, DPA stub,
sub-processors, acceptable-use). To be scoped. Note: observability + GA are being handled
separately by the owner later._

---

## Decisions log
- 2026-06-13: Scope = new name + full brand identity + legal pages. (Observability/GA out of scope — owner handling later.)
- 2026-06-13: Audience strategy locked (Section 1): Enterprise-primary, pro self-serve, free funnel for students/job seekers. One tiered platform, "grows with you."

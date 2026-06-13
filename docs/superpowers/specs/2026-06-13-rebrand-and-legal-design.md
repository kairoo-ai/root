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

## 2. Product Name — ✅ LOCKED: **Kairoo**

### 2.1 The name
**Kairoo** (replaces "AstraPath AI"). Style: invented/coined word (per owner preference —
fully ownable, trademarkable, meaning we control; drops the literal "AI" suffix per the
"stop bragging, build real features" pivot).

### 2.2 Meaning & story
Derived from Greek **_kairos_** — "the opportune moment," the right time to act. For a
career platform this reads as **"the right moment to grow / your next move."** The doubled
vowel ("-oo") makes the mark distinct and ownable while preserving the sound of the
original "Kairo" the owner was drawn to.

### 2.3 Why Kairoo (reasoning)
- **Spans all three audiences:** premium to enterprises, hopeful to job seekers, neither
  juvenile nor stiff.
- **Built-in brand story** = *"the right moment to grow,"* which dovetails with the
  "grows with you" thesis (free → pro → team) from Section 1.
- **Clear in our industry:** an availability scan (2026-06-13) found **no collision** in
  careers / HR-tech / edtech / learning / self-development.

### 2.4 Availability bar used
A name passes if: (1) **no collision in our industry** (careers / HR-tech / edtech /
learning / self-development), and (2) a **strong domain variant** is obtainable
(`kairoo.com`, `kairoo.io`, `getkairoo.com`, `usekairoo.com` — exact `.com` is a bonus,
not a requirement). Rationale: short "pretty" coined words from common roots are heavily
claimed; out-of-industry existence (e.g. a foreign health app) is a far smaller brand/legal
risk than an in-industry collision. **TODO before public launch:** formal trademark search
+ confirm chosen domain registration.

### 2.5 Candidates considered & rejected (2026-06-13 scan)
| Candidate | Verdict | Reason |
|-----------|---------|--------|
| Kairo | ❌ | Taken (owner found existing). |
| Lumora | ❌ | Lumora.io = personality-assessment / gamified self-dev — direct competitor collision. |
| Lunova | ❌ | Multiple AI software cos (Lunova Labs/Digital/Group) + Lumenova AI. |
| Veyra | ❌ | Swamped — many AI startups. |
| Cresca | ❌ | Cresça Brasil = UOL EdTech (distance education) — edtech adjacency. |
| Kaelo | ❌ | Kaelo Healthcare (SA) — well-being/psycho-social adjacency. |
| Aurelo | ❌ | Church-translation AI + ERP + studios — crowded. |
| Trayve | ❌ | Phonetically "thrive"; Thrive Career Wellness / Thryve exist in career-wellness. |
| Lumevo | ❌ | "Lum-" learning space crowded (Lumivero, Lumos Learning, Luminovo). |
| Ascentra | ❌ | Ascentis (talent management, now UKG) — essentially our exact space. |
| **Kairoo** | ✅ | **No in-industry collision; preserves loved "Kairo" sound; strong story.** |

### 2.6 Rebrand transition requirement (NEW)
Ship a **"AstraPath AI is now Kairoo" announcement banner / visual** so existing visitors
understand the rebrand. Scope to define in implementation:
- A dismissible site banner (top-of-page) with the rebrand message + optional "why we
  renamed" link.
- Optional shareable social/OG visual asset announcing the change.
- Persist dismissal (localStorage) so it doesn't nag returning users.
- Sunset the banner after a set period (e.g. 30–60 days) — candidate for a scheduled
  cleanup once a date is chosen.

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
- 2026-06-13: Name LOCKED = **Kairoo** (Section 2). 10 candidates scanned for in-industry collisions; Kairoo the only clean one that preserved the loved "Kairo" sound. Trademark + domain registration still TODO before public launch.
- 2026-06-13: Added requirement — "AstraPath AI is now Kairoo" rebrand announcement banner/visual (Section 2.6).

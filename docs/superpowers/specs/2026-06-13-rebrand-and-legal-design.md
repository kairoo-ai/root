# Rebrand & Legal Foundation - Design Doc

**Date:** 2026-06-13
**Owner:** Eshank Tyagi (eshank@matters.ai)
**Current name:** AstraPath AI (to be replaced)
**Status:** Design complete - Strategy ✅, Name ✅ (Kairoo), Brand Identity ✅ (color/themes/glyph/type/voice/tagline), Rebrand banner ✅ (requirement), Legal pages 🟡 scoped (drafting + legal review pending). Ready for user review → implementation plan.

> This document is the single source of truth for the rebrand. Nothing decided in
> brainstorming should be lost - every decision is recorded here with its reasoning.

---

## 1. Audience & Monetization Strategy - ✅ LOCKED

### 1.1 The product (context)

An AI-powered career development & learning platform. Capabilities today: AI career
tools (interview coaching, salary negotiation, etc.), AI-curated learning paths,
team/workforce analytics, and strategic/market intelligence views. Built on Next.js 16,
React 19, TypeScript, Google Gemini. Currently mid-pivot from "bragging about
capabilities" toward shipping real, usable features.

### 1.2 Audience model - one platform, three doors, tiered

The product is **a single platform with tiered gating** (NOT three separate products).
The brand must "grow with the user": **free → pro → team**.

| Tier                          | Segment                                               | Role in strategy                                                                               | Monetization              |
| ----------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------- |
| **Free**                      | Students, early-career, job seekers, career switchers | Acquisition engine / land-grab / word-of-mouth; solves cold-start                              | Free (funnel)             |
| **Pro (paid, self-serve)**    | Working professionals upskilling                      | Self-serve revenue, no sales call                                                              | Individual subscription   |
| **Primary (revenue ceiling)** | Enterprises / teams (B2B)                             | Highest revenue, predictable contracts; land-and-expand from individual usage inside a company | Team/enterprise contracts |

**Primary audience = Enterprises/teams.** The brand is deliberately designed to _also_
welcome the individual working professional, with a genuine free tier underneath for
students / early-career / job seekers.

### 1.3 Why this strategy (reasoning captured)

- **Free tier** solves the cold-start problem: cheap acquisition, virality, and a pool of
  users who _become_ paid professionals as their careers progress.
- **Pro tier** monetizes self-serve with premium/aspirational pricing and low churn.
- **Enterprise** is the revenue ceiling; individual/free usage _inside_ a company becomes
  the wedge ("12 people at Acme already use this → here's a team plan"). Classic
  **freemium land-and-expand** (cf. Gloat, Torch, BetterUp).

### 1.4 Trade-offs acknowledged

- Enterprise-primary means **slower validation** (needs design partners + a sales motion),
  so the brand must stay usable by an _individual_ (land-and-expand, not top-down only).
- B2B buyers will eventually require **DPA, security/compliance, GDPR specifics,
  sub-processor lists** - heavier legal than a consumer app (see Section 4).

### 1.5 Guardrails / things to improve (carry into build)

1. **Free must be a funnel, not a cost sink.** Design free around the moments users
   outgrow it (usage caps on AI tools, no analytics, no team features) so they _graduate_:
   job seeker → lands job → working professional → upsell.
2. **One product, three doors - not three products.** Single platform, tiered gating, to
   avoid fragmenting build effort (supports the "build real features" pivot).
3. **Name/identity must sit across all three** - must not scream "enterprise" OR "students."
   This is the core naming constraint.
4. **Free needs a guardrail** - student-email verification and/or usage caps, or Gemini/AI
   costs balloon. Pricing & brand pages must account for this.

### 1.6 Brand direction implied by strategy

A name + identity that feels **credible + aspirational, professional yet personal** -
premium enough for enterprises and pros, warm/approachable enough for individuals and
students. The unifying brand story is **"grows with you"** (free → pro → team).

---

## 2. Product Name - ✅ LOCKED: **Kairoo**

### 2.1 The name

**Kairoo** (replaces "AstraPath AI"). Style: invented/coined word (per owner preference -
fully ownable, trademarkable, meaning we control; drops the literal "AI" suffix per the
"stop bragging, build real features" pivot).

### 2.2 Meaning & story

Derived from Greek **_kairos_** - "the opportune moment," the right time to act. For a
career platform this reads as **"the right moment to grow / your next move."** The doubled
vowel ("-oo") makes the mark distinct and ownable while preserving the sound of the
original "Kairo" the owner was drawn to.

### 2.3 Why Kairoo (reasoning)

- **Spans all three audiences:** premium to enterprises, hopeful to job seekers, neither
  juvenile nor stiff.
- **Built-in brand story** = _"the right moment to grow,"_ which dovetails with the
  "grows with you" thesis (free → pro → team) from Section 1.
- **Clear in our industry:** an availability scan (2026-06-13) found **no collision** in
  careers / HR-tech / edtech / learning / self-development.

### 2.4 Availability bar used

A name passes if: (1) **no collision in our industry** (careers / HR-tech / edtech /
learning / self-development), and (2) a **strong domain variant** is obtainable
(`kairoo.mreshank.com`, `kairoo.io`, `getkairoo.mreshank.com`, `usekairoo.mreshank.com` - exact `.com` is a bonus,
not a requirement). Rationale: short "pretty" coined words from common roots are heavily
claimed; out-of-industry existence (e.g. a foreign health app) is a far smaller brand/legal
risk than an in-industry collision. **TODO before public launch:** formal trademark search

- confirm chosen domain registration.

### 2.5 Candidates considered & rejected (2026-06-13 scan)

| Candidate  | Verdict | Reason                                                                                |
| ---------- | ------- | ------------------------------------------------------------------------------------- |
| Kairo      | ❌      | Taken (owner found existing).                                                         |
| Lumora     | ❌      | Lumora.io = personality-assessment / gamified self-dev - direct competitor collision. |
| Lunova     | ❌      | Multiple AI software cos (Lunova Labs/Digital/Group) + Lumenova AI.                   |
| Veyra      | ❌      | Swamped - many AI startups.                                                           |
| Cresca     | ❌      | Cresça Brasil = UOL EdTech (distance education) - edtech adjacency.                   |
| Kaelo      | ❌      | Kaelo Healthcare (SA) - well-being/psycho-social adjacency.                           |
| Aurelo     | ❌      | Church-translation AI + ERP + studios - crowded.                                      |
| Trayve     | ❌      | Phonetically "thrive"; Thrive Career Wellness / Thryve exist in career-wellness.      |
| Lumevo     | ❌      | "Lum-" learning space crowded (Lumivero, Lumos Learning, Luminovo).                   |
| Ascentra   | ❌      | Ascentis (talent management, now UKG) - essentially our exact space.                  |
| **Kairoo** | ✅      | **No in-industry collision; preserves loved "Kairo" sound; strong story.**            |

### 2.6 Rebrand transition requirement (NEW)

Ship a **"AstraPath AI is now Kairoo" announcement banner / visual** so existing visitors
understand the rebrand. Scope to define in implementation:

- A dismissible site banner (top-of-page) with the rebrand message + optional "why we
  renamed" link.
- Optional shareable social/OG visual asset announcing the change.
- Persist dismissal (localStorage) so it doesn't nag returning users.
- Sunset the banner after a set period (e.g. 30–60 days) - candidate for a scheduled
  cleanup once a date is chosen.

---

## 3. Brand Identity - 🟡 IN PROGRESS

Overall direction: **blend of "Trusted Premium" (B) + "Warm Human" (C)** - navy anchor for
trust/enterprise, teal as the signature, amber for warmth. Personality: credible +
aspirational, professional yet personal. The palette itself signals tier ("grows with you").

### 3.1 Color system - ✅ LOCKED

| Token       | Hex       | Role                                                 |
| ----------- | --------- | ---------------------------------------------------- |
| Navy        | `#0B1F3A` | Brand anchor - text, enterprise tier, trust          |
| Teal        | `#0D9488` | Primary action color (signature), light mode         |
| Teal-Bright | `#2DD4BF` | Primary action color, dark mode (contrast)           |
| Amber       | `#F59E0B` | Warmth + Free tier accent                            |
| Gold        | `#CBA34A` | Enterprise-premium accent (used sparingly; optional) |
| Mist        | `#F8FAFC` | Light background / surfaces                          |

**Tier accents (palette signals where you are):**

- **Free** → Amber (`#F59E0B`; badge bg `#FEF3C7`, text `#92400E`)
- **Pro** → Teal (`#0D9488`; badge bg `#CCFBF1`, text `#0F766E`)
- **Enterprise** → Navy + Gold (`#0B1F3A` / `#CBA34A`)

### 3.2 Themes - ✅ LOCKED

- **Light:** mostly white (`#FFFFFF`), mist surfaces (`#F8FAFC`), navy text, teal actions,
  hairline borders `#E2E8F0`.
- **Dark:** **navy-derived, NOT pure black** - bg `#071426`, surfaces `#0F2740`, borders
  `#16314F`, text `#F8FAFC` / muted `#94A3B8`, actions teal-bright `#2DD4BF`. Rationale:
  pure black reads generic; deep navy keeps the dark theme unmistakably Kairoo.

### 3.3 Typography - ✅ LOCKED

Driven by owner's ranked preference (DM Sans > Mona Sans > Satoshi > Geist Sans >
Space Grotesk > Open Sans). Principle: **one clear, non-overlapping job per font** so the
system has range without becoming a mishmash.

| Role                                                                                | Font              | Weights   | Purpose / why                                                                                                                                                         |
| ----------------------------------------------------------------------------------- | ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wordmark + headings (site & app)                                                    | **DM Sans**       | 700 / 800 | Owner's #1; geometric warmth matches the rounded, all-curves glyph; "Kairoo" wordmark reads great at 700/800                                                          |
| Body + product UI                                                                   | **DM Sans**       | 400 / 500 | Single-family everywhere = cohesive + fast to ship; excellent UI legibility                                                                                           |
| Marketing hero / display headlines (landing only)                                   | **Space Grotesk** | 500 / 700 | Distinctive character on marketing pages without fighting DM Sans; NOT used inside the app                                                                            |
| Data surfaces - dashboards, team analytics, metrics, pricing numbers, reports/decks | **Mona Sans**     | 400–700   | Strong tabular figures + slightly corporate tone; fits **enterprise/B2B** surfaces while DM Sans stays the warm individual/product face - mirrors the tiered audience |
| Global fallback / alternate                                                         | **Satoshi**       | -         | Drop-in alternate for DM Sans (similar geometric feel) if DM Sans feels too common or hits a licensing/loading snag. **Not loaded by default** - on standby           |

**Audience mapping:** DM Sans = personal / product face (individuals, Pro). Mona Sans =
enterprise / data face (analytics, reports, Enterprise tier).

**Performance rules (carry into implementation):**

- Load only the weights listed above - no full-family imports.
- Load **Mona Sans only on routes that use it** (dashboards / analytics / reports), not site-wide.
- Space Grotesk loads on marketing routes only.
- Satoshi is documented but not bundled unless swapping in for DM Sans.
- All are free / web-ready (DM Sans, Space Grotesk, Open Sans = Google Fonts; Mona Sans = GitHub/OFL; Satoshi = Fontshare; Geist = Vercel).

### 3.4 Logo / glyph - ✅ LOCKED (variant "B3")

The owner's original arc sweep with a small curved stem (reads as **K** on a second look)
and **two teal dots**: a small "waypoint" on the journey at the elbow, and the larger
"o" / _kairos_ **moment** dot at the top of the arc. **All curves - no straight or edgy
lines** (hard requirement from owner). Origin: owner's own sketch, chosen over ~64 candidates.

SVG (viewBox `0 0 92 92`, stroke `#0B1F3A` light / `#F8FAFC` dark, width `8.05`, round caps;
dots `#0D9488` light / `#2DD4BF` dark):

```svg
<svg viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.1016 71.2999C28.3682 68.2332 39.8682 59.0332 50.6016 43.6999C61.3349 28.3666 69.7682 19.9332 75.9016 18.3999" stroke="#0B1F3A" stroke-width="8.05" stroke-linecap="round"/>
  <path d="M32.0476 21C32.0476 39.55 30.9762 39.2 39 42" stroke="#0B1F3A" stroke-width="8.05" stroke-linecap="round"/>
  <circle cx="58" cy="51" r="5" fill="#0D9488"/>
  <circle cx="75.9016" cy="18.4" r="9.2" fill="#0D9488"/>
</svg>
```

- **Lockup:** glyph + "Kairoo" wordmark (bold, ~ -1.5px letter-spacing). Glyph also works standalone.
- **Favicon:** thicken stroke as size drops (8.05 → ~11 at 16px) so the mark survives; verified at 48/32/24/16.
- **App icon:** white/teal mark on navy tile, or white/amber on a navy→teal gradient tile.
- Asset work for implementation: export `public/` SVGs (light, dark, mono), favicon set, OG image, app-icon PNGs.

### 3.5 Voice & tone - ✅ LOCKED

**Confident mentor, not hype-man.** Plain-spoken, specific, encouraging. We name the next
concrete step instead of promising the moon.

- **Do:** "Here's your next step." · "Based on your last 3 interviews, focus here." · concrete, second-person, calm.
- **Don't:** "Unlock your limitless potential!" · hype, exclamation-spam, vague superlatives, "AI-powered" as a brag.
- **Why:** credible enough for enterprise buyers, warm enough for individuals/students; directly supports the "stop bragging, build real features" pivot. Works across all three tiers.

### 3.6 Tagline - ✅ LOCKED

**Primary:** "The right moment to grow." - ties straight to the name's meaning (_kairos_)
and the "grows with you" thesis.
**Secondary / descriptor (for meta, app stores, longer contexts):** "AI career development
that grows with you."
**Alternates considered (kept on file):** "Career growth, perfectly timed." · "Grow into
who you're becoming." · "Your next move starts here."

### 3.7 Brand identity status - ✅ COMPLETE

Color system, themes, glyph, typography, voice, and tagline all locked. Assets backed up in
[`../../brand/`](../../brand/) ([`README.md`](../../brand/README.md), light/dark/mono/favicon SVGs, exploration archive).

---

## 4. Legal Pages - 🟡 SCOPED (drafting pending)

> ⚠️ **Legal-review caveat (must stay in the doc):** Claude can _draft_ these pages, but
> AI-generated legal text is a starting point only. Anything published and relied upon -
> especially Privacy, Terms, DPA, GDPR/CCPA specifics - should get a qualified lawyer's
> review. Drafts will carry a visible "DRAFT - pending legal review" note until cleared.

### 4.1 Why now

The product collects personal data (accounts, career/profile data, usage) and sends user
content to **Google Gemini** for AI features. That triggers a baseline legal need
(privacy, terms, cookie/consent, AI disclosure) even before enterprise. B2B-primary
positioning adds enterprise-grade docs that can ship as stubs now and harden before the
first enterprise deal.

### 4.2 Document set

**Ship now (public, required):**
| Doc | Purpose / key contents |
|-----|------------------------|
| **Privacy Policy** | What's collected (account, profile/career data, usage), why, legal bases, retention, user rights (access/delete/export), GDPR + CCPA sections, **AI processing disclosure** (content sent to Google Gemini), third-party sub-processors, contact. |
| **Terms of Service** | Account rules, acceptable use ref, tiers (Free/Pro/Enterprise), billing/auto-renewal/refunds for paid, IP ownership, **AI-output disclaimer** (not professional/career/legal advice; no guaranteed outcomes), liability limits, termination, governing law. |
| **Cookie Policy + consent banner** | Cookie categories, purposes; EU/UK consent banner (needed once analytics/GA go in - owner adding observability/GA later, so build consent-ready now). |
| **Acceptable Use Policy** | Prohibited uses of the AI tools (abuse, scraping, generating harmful content, reverse-engineering), enforcement. |
| **AI Disclosure / Disclaimer** | Plain-language: AI assists, can be wrong, isn't professional advice; how user data is used with Gemini; human-in-the-loop expectation. (May live inside Privacy + Terms rather than a separate page - decide in implementation.) |

**Stub now, harden before first enterprise deal:**
| Doc | Purpose |
|-----|---------|
| **DPA (Data Processing Agreement)** | Controller/processor terms for B2B; GDPR Art. 28. Stub + "available on request." |
| **Sub-processors list** | Public list (Google Gemini, hosting/Vercel, email, etc.) with purpose + region; enterprises expect this. |
| **Security / Trust page** | Overview of security practices (even if light now); B2B buyers look for it. |

**Explicitly out of scope (owner handling separately):** observability + analytics (GA)
instrumentation. Legal pages will be **consent-banner-ready** so GA can drop in cleanly later.

### 4.3 Open decisions (resolve before/at drafting)

1. **Operating legal entity + governing-law jurisdiction** (country/state) - needed for Terms/Privacy. (Owner email is `@matters.ai` - confirm the entity that owns Kairoo.)
2. **Contact channel** for privacy/legal requests (e.g. privacy@…).
3. **Data residency / retention specifics** (how long career data is kept; deletion flow).
4. **Confirm Gemini data-handling terms** (does Google train on the data under the API plan in use?) - drives the privacy/AI-disclosure wording.

### 4.4 Implementation notes

- Routes: `/privacy`, `/terms`, `/cookies`, `/acceptable-use`, (`/dpa`, `/sub-processors`, `/security` as stubs). Footer links + sitemap entries.
- Shared simple legal-page layout (title, last-updated date, prose styling via existing Tailwind typography).
- Each page carries a `Last updated` date and the DRAFT note until legal-cleared.

---

## Decisions log

- 2026-06-13: Scope = new name + full brand identity + legal pages. (Observability/GA out of scope - owner handling later.)
- 2026-06-13: Audience strategy locked (Section 1): Enterprise-primary, pro self-serve, free funnel for students/job seekers. One tiered platform, "grows with you."
- 2026-06-13: Name LOCKED = **Kairoo** (Section 2). 10 candidates scanned for in-industry collisions; Kairoo the only clean one that preserved the loved "Kairo" sound. Trademark + domain registration still TODO before public launch.
- 2026-06-13: Added requirement - "AstraPath AI is now Kairoo" rebrand announcement banner/visual (Section 2.6).
- 2026-06-13: Glyph LOCKED = variant "B3" (owner's arc + curved stem + two teal dots). Backed up to `docs/brand/` (Section 3.4).
- 2026-06-13: Color system + light/dark themes LOCKED (Section 3.1–3.2). Dark = navy-derived, not black.
- 2026-06-13: Typography LOCKED (Section 3.3) - DM Sans (wordmark/headings/body/UI), Space Grotesk (marketing display), Mona Sans (data/enterprise surfaces), Satoshi (standby fallback). Per owner's ranked preference.
- 2026-06-13: Voice LOCKED = "confident mentor, not hype-man"; Tagline LOCKED = "The right moment to grow." (Section 3.5–3.6).
- 2026-06-13: Legal pages SCOPED (Section 4) - ship-now set + enterprise stubs; flagged lawyer-review requirement and 4 open decisions (entity/jurisdiction, contact, retention, Gemini data terms).

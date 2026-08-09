# Alistair Rodrigues — Portfolio PRD & Build Bible
### Codename: "INTERSTELLAR" — the definitive brief. Everything is here. Start a fresh session from this file alone.

> **How to use this doc (read first):** This is the single source of truth for rebuilding
> Alistair's portfolio. It supersedes `BUILD-BRIEF.md` (an earlier, shorter draft — you may
> delete it). Read top to bottom once, then build from Section 15 (Build Order). Every design
> decision, every client preference, every technical landmine, and every asset is documented
> below so you never have to guess or re-derive.

---

## 0. TL;DR (30-second version)
Rebuild a space-themed developer portfolio into an **Interstellar-inspired, cinematic, interactive
experience** with the craft level of **growon.kr/work** (interactive 3D scene, per-object sound,
music, theatrical gradient loader). Current site reads "childish/kiddish" — the whole point is to
make it feel **professional, filmic, and creative enough to be a talking point** (the way a
Windows-95-UI portfolio or a newspaper portfolio is). Palette = desaturated Interstellar
(ochre/steel/amber), type = Urbanist + mono HUD, motion = slow & gravitational. 5 tabs, each mapped
to an iconic Interstellar scene. Original assets only — never rip film audio/footage/the poem.

---

## 1. WHO THE CLIENT IS
- **Name:** Alistair Rodrigues.
- **Role/identity:** AI engineer + UI/UX designer. "From pipeline to pixel."
- **Education:** Computer Science graduate; **MSc Advanced Computer Science, University of Strathclyde**.
- **Focus:** AI engineering — retrieval systems, on-device intelligence, computer vision, and the
  interfaces that make them legible. Also data analysis & UI/UX.
- **Career goal driving this:** wants a portfolio strong enough for **design-obsessed employers**
  (this started as a Bending Spoons UI/UX application). The portfolio itself must be a proof of taste.
- **Stack:** Python, Kotlin, FastAPI, Jetpack Compose, React, WebGL/Three.js, AI/ML.

### The 5 real projects (use this exact framing — no invented facts)
| Project | What it is | Tech |
|---|---|---|
| **RAGStar** | Hybrid search — dense vector retrieval + BM25 keyword, fused via **Reciprocal Rank Fusion (k=60)**, reranked with Cohere | Python, FastAPI, Pinecone, BM25, Ollama |
| **HawkAI** | Computer-vision authentication surface — liveness detection, secure session handoff, "instant" login | CV, Auth, realtime |
| **Quantasphere** | Real-time 3D data environment — streamed geometry, instanced WebGL for large point populations | WebGL, Three.js |
| **Study Snippets** | Android learning client — offline-first sync, spaced repetition | Kotlin, Jetpack Compose |
| **Health Weight** | Longitudinal health tracking — trend inference + short-horizon forecasting over sparse data | Python, forecasting |

---

## 2. PROJECT STATE & REPO FACTS
- **Local dir:** `/Users/obito/Desktop/cosmos-concept`
- **GitHub repo:** `Alistair77/comos_Alistair_portfolio` (note the typo "comos" in the repo name — intentional/existing, don't "fix" it).
- **Live URL:** `https://alistair77.github.io/comos_Alistair_portfolio/` (GitHub Pages).
- **Deploy:** GitHub Pages via `pages-build-deployment` action. `.nojekyll` is present and required
  (Pages otherwise runs Jekyll and fails on this repo's folders/filenames). The environment
  **auto-commits and auto-deploys** — changes can go live without an explicit push, so review before editing live.
- **Main file:** `index.html` (~1700 lines, single-file site). It is wrapped in an `<x-dc>` block and
  rendered by `support.js` (see Section 13 — this has sharp edges).

---

## 3. THE CONCEPT JOURNEY (what was tried, what the client liked / disliked)
> The client explicitly asked to record "every favorable thing." This is the ledger. Respect it —
> these are hard-won signals about their taste.

### LIKES (confirmed, keep these)
- **The "hello" constellation intro** — "even the constellation I love it." **DO NOT REPLACE** the
  hello word or the constellation loader. It can be a *beat* inside a larger intro, never removed.
- **The gradient from growon's loader** (their screenshot `gw-3.png`): a soft vertical gradient,
  deep navy at top -> dusty desaturated blue at bottom, with fine film grain. Client: "I just love it."
  This gradient must appear (motivated as Gargantua's glow / the sky through a window).
- **venturi.space moon intro** — the 3D object loads large/centered, then eases into its hero
  resting position. Client wanted the satellite to **zoom ~2-3x during the hello, then settle** to
  its hero size. (This was implemented in `index.html`.)
- **growon.kr/work** — loves it "absolutely." Specifically: the interactive 3D desk where **every
  object is a doorway + has its own sound**, the **design system**, the **typography**, the
  **loader especially**, the **scroll-with-sound**, and the **background music**. Wants "those kind
  of objects... seven similar but in our theme."
- **The interactive latent-space hero concept** (`concept-latent.html`) — the turning point; client
  reacted positively ("more like it") after two static concepts. The living, work-as-visual energy
  is what landed. Reuse this as the **Work terminal screen** content.
- **Interstellar** — the reference film. "The only space movie with the same level of creativity
  that aligns with my mind." Wants an **Interstellar-style portfolio**, "as creative as Christopher
  Nolan." Named these scenes specifically: **tesseract/time dimension, Gargantua black hole,
  cockpit of the shuttle, TARS walking, Miller's ocean planet, the Ranger shuttle to the ocean
  planet, the timeline/time dilation.**
- **The 5 Interstellar concept boards** (`concept-interstellar.html`) — this doc's locked direction
  (client asked to document "this current concept," i.e. committed to it).
- Wants the portfolio to be a **recognizable creative genre statement** — like a Windows-95 UI
  portfolio or a newspaper portfolio. Memorable, "he did a great job" reactions.

### DISLIKES (avoid these)
- Current cosmos site feels **"childish / kiddish / random"** — "everything is interchangeable, no
  purpose." Root causes identified: **Orbitron** (game-sci-fi font), **rainbow category colors**
  used decoratively, **4-5 competing display fonts**, and effect-stacking without hierarchy.
- The two static **NASA/SpaceX layout concepts** (`concept-mission.html`, `concept-launch.html`) —
  client said flatly: **"both are boring."** Static = boring. Interactive/alive = good.
- Anything that looks like a template, or "safe restraint" with no energy.

### Working-style preferences (how to collaborate with this client)
- **Mockup-first, then approval, then apply.** "First show me a mockup and then when I say yes you
  can add it." Do not push big changes to `index.html` without showing a preview.
- **Make the decisions.** "I cannot make those decisions, so I want you to make the decisions" /
  "however you feel is correct." Bring a recommendation, not a menu.
- **Purpose over decoration.** "Everything has a meaning, not random things everywhere."
- **Verify visually.** They value that work is screenshotted/checked, not assumed.

---

## 4. LOCKED CREATIVE DIRECTION — "INTERSTELLAR"
The whole site is **one journey, and the through-line is TIME** (Nolan's real subject — time as
cost, time as connection). Scored by **original** organ-like pads + a ticking motif. Desaturated,
filmic, adult. Every page = an iconic scene. This is the anti-"kiddish" fix at the concept level.

---

## 5. REFERENCE #1 — growon.kr/work (the craft bar) — VERIFIED TEARDOWN
> Analyzed live with headless Chromium (network capture + runtime probing). These are facts, not guesses.

- **Framework:** Next.js App Router on **Turbopack** + **React Server Components** (captured 15
  `text/x-component` `?_rsc=` prefetches of /about, /contact, /).
- **3D:** **React Three Fiber** — canvas carries `data-engine`, but `window.THREE` is undefined
  (three bundled as ESM, not a global).
- **NO animation libraries** — no GSAP, ScrollTrigger, Lenis, Locomotive, Barba, Swiper, SplitType,
  anime.js. Motion is **hand-built** via R3F `useFrame` + React state + CSS. (Ambitious; it's why it feels bespoke.)
- **The idea (their own copy):** "fully interactive 3D desk... every object holds a purpose. Some...
  a playful visual twist, others... hidden doorways to other pages."
- **7 GLB models** (separate files -> per-object lazy-load + hit-test + animate):
  `desk, monitor, turntable, cup, chair, lamp, plant`.
- **6 MP3s — per-object diegetic sound**, played via **Web Audio (no `<audio>` in DOM)**:
  `coffee`(cup), `chair_squeaking`(chair), `leaves`(plant), `reel_whoosh`(turntable), `book`, `whoosh`(shared transition).
- **/work does not scroll** (`scrollHeight === innerHeight`). Content lives in a full-viewport
  overlay `[data-panel-scroller]` (`fixed inset-0 overflow-y-auto`, `tabindex=-1`, focus-managed)
  **layered over a persistent 3D canvas** -> navigating never unmounts the scene.
- **Type:** Urbanist (Latin) + SUIT Variable (Korean), self-hosted **variable woff2** via `next/font`.
- **Tailwind semantic tokens:** `bg-canvas`, `text-ink-primary`, per-section `--color-panel-work`.
- **Loader (the one the client loves):** navy->dusty-blue vertical gradient + film grain, centered
  light-weight *"Setting the scene..."* with a **hairline rule as the progress bar**. Theatrical copy,
  warm palette, not black.
- **Infra:** Cloudflare + RUM (`beacon.min.js`); images via Next/Image -> WebP, responsive `w=&q=75`.

**What to steal:** persistent-canvas + overlay routing; per-object sound; theatrical loader; semantic
design tokens; hand-built motion (no heavy libs); the "every object is a doorway" thesis.

---

## 6. REFERENCE #2 — venturi.space (the intro move)
The 3D object (a moon) loads **large and near-center during the load** (with a targeting reticle +
label), holds a beat, then **shrinks and moves to a corner** as the hero settles. This is the exact
behavior the client wanted for our satellite. Already partially implemented in `index.html`:
satellite fades in scaled ~2.4x during the hello, then eases to its hero resting position
(transparent intro overlay so it shows behind the hello).

---

## 7. REFERENCE #3 — Interstellar -> PAGE MAPPING (the creative core)
> Original interpretations "in the spirit of" the film. NEVER use the film's audio, footage,
> dialogue, or the Dylan Thomas poem. See Section 14.

| Tab | Scene | Concept |
|---|---|---|
| **1 Hero** | **Cockpit / Departure** | Inside the Ranger cockpit; **Gargantua glows through the window = the loved gw-3 gradient, finally motivated.** Console switches/screens = nav portals. **TARS** stands beside (also the cursor + About portal, with an honesty/humor toggle nodding to TARS's settings). Loader "Setting the scene..." over the black-hole glow -> hands into the hello/constellation -> scene reveals. |
| **2 Work** | **Gargantua (black hole)** | "What I do = bending complexity into order." Capabilities **orbit the accretion disc**; hover a disc segment -> that skill details. The lensed disc is a **canvas/WebGL shader**, not a GLB. |
| **3 Projects** | **The Planets** | Each project is a **destination you fly the Ranger to.** Miller's **ocean world** = flagship (entered with the tidal-wave reveal); Mann's **ice world** = another. Approach -> land -> the project's **screenshot** as landing site + what it does. Nolan twist: each planet shows a **time-dilation "cost"** metric (wink at 1hr = 7yrs) as a playful depth signal. |
| **4 Journey** | **The Tesseract** | The **5D bookshelf** — milestones laid out as moments across time you reach **through** (like Cooper). Scrolling = moving through time; each milestone is a frame you pull. The emotional page. Instanced lattice geometry. |
| **5 Contact** | **Wormhole / The Signal** | The wormhole is the gateway home. Form = **"transmit a signal"**; on send, a gravity/morse pulse fires — a nod to **Murph's watch**, which hides the contact details in morse as an easter egg. |

**Global motifs:** a persistent **time-dilation clock** (HUD) that ticks at different rates per
"planet"/page; **docking-spin** page transitions (the famous rotation); slow **gravitational** easing.

---

## 8. SITE STRUCTURE — 5 TABS, DETAILED SPEC
Client confirmed the site has **4-5 tabs**: Hero, Work (what I do / work life), Projects, Journey,
Contact. Per-tab detail (scene, objects, interactions, sound, copy direction):

### TAB 1 — HERO "Cockpit / Departure"
- **Objects:** cockpit console (interactive), TARS (side), window->Gargantua shader.
- **Interactions:** console switches = nav (Work/Journey/Résumé/Contact); TARS reacts to cursor;
  satellite/probe drifts. Loader -> hello/constellation -> scene.
- **Sound:** low organ swell + switch clicks + soft ticking.
- **Copy:** eyebrow "COOPER STATION // DEPARTURE SEQUENCE"; H1 "ALISTAIR RODRIGUES"; role line
  "AI engineer. Retrieval systems, on-device intelligence, and the interfaces that make them legible."
- **HUD:** LAT/LON, "T- ..:.. TO BURN", "DILATION x1.00", "TARS · HONESTY 90% · HUMOR 75%".

### TAB 2 — WORK "Gargantua"
- **Visual:** black hole + accretion disc (shader). Skills orbit: Retrieval/RAG (Vector·BM25·RRF),
  Computer Vision (Liveness·Auth), On-device ML (Kotlin·Compose), Interfaces (WebGL·Motion).
- **Interaction:** hover a disc segment -> expands that capability; the disc bends light around it.
- **Copy:** "WHAT I DO / Bending complexity into order."

### TAB 3 — PROJECTS "The Planets"
- **Per project:** planet approach -> dossier card (name, screenshot slot, one-line "what it does",
  a `time cost` metric like "1H HERE = 7Y EARTH"). Ranger shuttle animates between planets.
  Travel-path dots along the bottom.
- **Order (recency):** RAGStar -> HawkAI -> Quantasphere -> Study Snippets -> Health Weight.
- **Sound:** ticking accelerates near the flagship (time pressure); a wave crash on the ocean world.

### TAB 4 — JOURNEY "The Tesseract"
- **Visual:** perspective lattice receding into darkness (bookshelf/time grid), glowing milestone nodes.
- **Milestones (example):** Strathclyde MSc (2024) · First RAG system (2025) · Shipped 5 projects (2026).
- **Interaction:** scroll = travel through time; pull a frame = expand a milestone.
- **Copy:** "PERSONAL JOURNEY / Reaching across time."

### TAB 5 — CONTACT "Wormhole / Signal"
- **Visual:** wormhole sphere (bright rim + refraction rings).
- **Interaction:** form fields "NAME / CALLSIGN", "MESSAGE ACROSS THE VOID...", "TRANSMIT SIGNAL";
  on submit -> morse/gravity pulse animation. Morse row = Murph's-watch easter egg holding contact details.
- **Copy:** "CONTACT / Send a signal home."

---

## 9. THE 7 3D OBJECTS (Interstellar set — replaces growon's desk set)
1. **Cockpit console** — hero, interactive nav.
2. **TARS monolith robot** — guide + custom cursor (honesty/humor toggle) + About portal.
3. **Ranger shuttle** — project-to-project travel.
4. **Endurance ring station** — nav hub / could feature in loader.
5. **Ocean planet (Miller's)** — flagship project.
6. **Wormhole sphere** — contact.
7. **Murph's watch** — time easter egg (contact detail in morse).

- **Gargantua** = a **shader/canvas**, not a GLB.
- **Reuse `uploads/satellite.glb`** (already optimized, 512KB) — reframe as a **probe / CASE drone**.
- Each object gets a **diegetic sound** on interaction + a shared **whoosh** for transitions.

---

## 10. DESIGN SYSTEM
### Palette — desaturated & filmic (this alone kills "kiddish")
- Ground/ink: near-black `#0A0B0E`; warm off-white text `#ECE4D4`.
- **Ochre accent** (the ONE accent): `#D8A24A` / bright `#F0B65C` (Gargantua amber, dust-bowl warmth).
- Steel blue-grey: `#4C6076` / deep `#2A3543` (space/cold).
- **Retire the rainbow.** Old per-category colors survive only as tiny per-object identity dots, if at all.

### Typography
- **Drop Orbitron entirely** (it's half the "kiddish" feel). Also collapse the 4-5 display fonts.
- Display/body: **Urbanist** (like growon) — clean geometric sans. Consider General Sans/Archivo as alt.
- **Mono HUD:** Space Mono or JetBrains Mono — used with intent for readouts, coordinates,
  time-dilation, section indices, metadata.
- Aggressive scale contrast (big headline, small precise HUD). NASA-plate uppercase for labels.

### Type & spacing scale — ALREADY BUILT (reuse the tokens in index.html)
A unified token system was already implemented in `index.html` (`:root`):
- `--text-display ... --text-2xs` (10-step fluid scale, one consistent clamp slope).
- `--lh-display/tight/snug/body` line-heights.
- `--tr-tightest/tight/normal/wide/label/kicker` tracking (replaced 26 ad-hoc letter-spacings).
- `--space-1...10` (4px base), `--gutter`, `--space-section`.
Keep this system; just swap the font family and palette onto it.

### Motion
- Slow, weighty, **gravitational easing** (`cubic-bezier(.16,1,.3,1)`, long durations).
- **Docking-spin** transitions between pages. Persistent time-dilation clock.
- Compositor-friendly props only (transform/opacity/clip-path). Respect `prefers-reduced-motion`.

### Loader (client-critical)
Gradient navy->dusty-blue + **film grain** + theatrical copy (their "Setting the scene..." -> our line)
+ **hairline progress rule** -> hands into the **hello/constellation (KEEP)** -> then the scene reveals.
Progress should be **real** (driven by asset load), not a fake timer.

### Sound & music
- Per-object **diegetic SFX** on interaction (Web Audio, like growon — no `<audio>` in DOM).
- **Whoosh** on every section transition.
- **Persistent music mute-toggle** (top corner) with an **original ambient track** (organ pads +
  ticking motif). Must default to muted until user opts in (autoplay policy + courtesy).

---

## 11. ASSETS — HAVE vs NEED
- **HAVE:** `uploads/satellite.glb` — 512KB, WebP textures, **decoder-free** (renders in
  model-viewer). Original 36MB version backed up in scratchpad.
- **NEED (the heavy part):**
  - 6 GLB models: cockpit console, TARS, Ranger shuttle, Endurance ring, ocean planet, wormhole
    sphere, Murph's watch (source from Sketchfab CC / Poly Haven / generate; then optimize — see §13).
  - 6-7 short **original** SFX (switch click, radar sweep, sip, power click, leaves, chair swivel, whoosh).
  - 1 **original** ambient music track.
  - Urbanist font (Google Fonts or self-hosted woff2).
  - Project screenshots for the dossier cards.

---

## 12. EXISTING FILES — INVENTORY
| File | What it is | Verdict |
|---|---|---|
| `index.html` | Live site. Has the unified type/spacing tokens, "hello"/constellation loader, satellite big->small zoom-in intro (transparent overlay reveal). | **Base to evolve.** Keep the token system + hello loader. |
| `concept-interstellar.html` | The 5 Interstellar concept boards (static CSS art). | **The locked direction.** Visual reference for the build. |
| `concept-latent.html` | Interactive embedding-space hero (canvas). Client's favorite of the earlier 3. | **Reuse** as the Work "terminal screen" content. |
| `concept-mission.html`, `concept-launch.html` | Static NASA/SpaceX layouts. | Client: **"boring."** Reference only; don't ship. |
| `concept-a.html`, `concept-b.html` | Older Bending Spoons editorial concepts (Fable-agent built). | Archive. |
| `mockup-type.html` | Type-scale spec board. | Reference. |
| `mockup-satellite.html` | Old satellite ease-in mock (superseded by index.html). | Can delete. |
| `BUILD-BRIEF.md` | Earlier short draft of this doc. | **Superseded by this PRD.** Can delete. |
| `support.js` | Renders the `<x-dc>` page. | See §13 — has sharp edges. |

---

## 13. TECHNICAL CONSTRAINTS & GOTCHAS (learned the hard way — read before coding)
1. **`support.js` / `<x-dc>` rendering:** `index.html` is wrapped in `<x-dc>` and rendered by
   `support.js`. **Only the single `<script type="text/x-dc" data-dc-script>` block executes** —
   plain inline `<script>` tags do NOT run. It also **mangles some camelCase identifiers**
   (e.g. `pctEl` -> `sc-camel-pct-el`), producing invalid JS. **Use lowercase identifiers** in that
   script, and put all JS inside the single data-dc-script block.
2. **model-viewer 4.3.1 cannot decode meshopt.** A meshopt-compressed GLB throws
   *"setMeshoptDecoder must be called..."* and renders blank. **Optimize GLBs with texture-resize +
   WebP ONLY (no `--compress meshopt`).** Command that worked:
   `gltf-transform optimize in.glb out.glb --compress false --texture-compress webp --texture-size 1024 --simplify false`
   (took the satellite 36MB -> 512KB, still renders). If you move to raw R3F/three you can use Draco
   (three bundles a Draco decoder) — but model-viewer needs decoder-free assets.
3. **GitHub Pages:** `.nojekyll` required (already present). Repo name is `comos_...` (typo, keep it).
4. **Headless GPU:** Headless Chromium here uses SwiftShader (no GPU) -> **R3F / heavy WebGL scenes
   stall on load** and can't be screenshot-verified. `model-viewer` + 2D/CSS/canvas DO render.
   **Playwright is installed** in the session scratchpad and works for those. For real 3D visual
   verification you need a GPU-backed browser (or verify on the client's machine).
5. **Environment auto-commits/deploys.** Edits to `index.html` can reach the live site. Review first.
6. **Gate hooks (GateGuard):** this environment requires stating facts before Bash/Write/Edit calls
   (importers, purpose, data, verbatim instruction). Not a code constraint — a workflow one.
7. **Ponytail mode** was active: prefer the simplest thing that works; reuse before building.

---

## 14. LEGAL / COPYRIGHT GUARDRAILS (non-negotiable)
- **No Interstellar audio, footage, dialogue, images, or the Dylan Thomas poem.** Everything is an
  **original interpretation "in the spirit of."** The score is original (organ-like pads + ticking),
  not the film's. 3D models must be original or properly-licensed (CC), not ripped from the film.
- This keeps the portfolio safe to publish publicly and to show employers.

---

## 15. BUILD ORDER (do it in this sequence — cheap -> expensive)
1. **Design system swap (cheapest, biggest impact):** drop Orbitron -> Urbanist; collapse palette to
   ochre/steel/amber monochrome; keep the existing `--text/--tr/--space` tokens. Ship this first —
   it alone moves the site from "kiddish" to "professional."
2. **Gradient loader** in our theme (navy->dusty-blue + grain + "Setting the scene..." + hairline
   progress) -> hands into the existing hello/constellation. Verify with a Playwright screenshot.
3. **Source + optimize the 6 GLBs and the SFX** (heavy; needs GPU to verify visually).
4. **Build the interactive scene** — start with the Hero cockpit (persistent canvas). Prefer R3F for
   real interactivity; `model-viewer` hotspots are a lazy fallback. Wire **per-object sound**.
5. **Persistent-canvas + overlay routing** (growon pattern: `data-panel-scroller` over a canvas that
   never unmounts) + **music mute toggle** + Gargantua shader + tesseract + wormhole.
6. Populate real content (project screenshots, journey milestones), polish motion, ship.

> Follow the **mockup-first** rule (Section 3): show a preview, get a yes, then apply to the live file.

---

## 16. OPEN DECISIONS (bring a recommendation; client prefers you decide)
- **Rebuild in a framework (Next.js + R3F, like growon) vs. enhance the single `index.html`?**
  growon-level polish really wants R3F + a bundler. Recommendation: **new Next.js + React Three
  Fiber app** for the real build; keep `index.html` as the reference/fallback. (This is a big
  decision — confirm with client, but lean R3F.)
- Which project is the **flagship "ocean planet"** (biggest reveal)? Recommendation: **RAGStar**
  (most technically impressive / most "AI engineer").
- Exact ambient track direction & whether TARS "speaks" (text only, no film audio).

---

# SESSION 2 — NEW REQUIREMENTS & BACKLOG (client feedback, not yet built)

## Terminology (client corrected me)
- **PERSONAL JOURNEY** = the personal-photos section. Apply the **CircularGallery** here
  (see `concept-journey-gallery.html` — React Bits component ported to vanilla, `ogl` via CDN),
  **sized to that section** (NOT full-screen). Swap the placeholder picsum images for real photos.
- **JOURNEY SO FAR** = the project timeline (the sticky stacking cards). This gets the big rework below.
  (The gallery demo was mislabeled "Journey So Far" — wrong; the gallery is for personal journey.)

## JOURNEY SO FAR — evolve (client LOVES the panels; keep them)
- **Uniform panels:** every card identical size (currently varied).
- **Horizontal motion:** cards move sideways, not up/down.
- **Character-card entrances:** cards arrive from alternating sides in a synced-but-varied rhythm
  (card 1 in from left; card 2 the page shifts right; etc.) — each has "character," choreographed,
  slightly playful. Not a uniform slide.
- **FLAGSHIP FEATURE — selective live demos:** replace the GitHub link with **"Preview the website."**
  Each project already has a showcase page in the repo:
  `work/hawkai-login-showcase/`, `work/quantasphere-hero-export/`, `work/ragstar-showcase/`,
  `work/study-snipp-showcase/`, `work/health-weight-app-showcase/` (each has index.html).
  On a card the user can OPT IN to watch a live demo (iframe/modal that boots the showcase) —
  NOT autoplayed, NOT forced. This is the hardest + highest-value part; make demo launching feel deliberate.

## HERO — three info boxes (MISSION / PROJECTS / STACK)
- Client: the info is relevant but the boxes "don't belong there" — feel off / misplaced in the hero.
- Rework placement + treatment so they feel native (or relocate them). A redesign, not a restyle.

## HERO — 3D station orientation (needs LIVE visual tuning — do on a GPU browser, do NOT tune blind)
- Current: station reads as facing DOWN. Should face the SCREEN, tilted slightly UP.
- Motion wanted: spin "round and round like a wheel" — continuous rotation about the model's own axis,
  reading like a wheel turning on the tilted oval-orbit plane already shown (`.satellite-orbit` ellipses).
- This REVERSES the earlier "front-only sway, never show the back." Now continuous rotation is wanted,
  but oriented so it looks like a wheel, not a turntable showing the back.
- Current code in index.html hero model-viewer: `camera-orbit="0deg 78deg 115%"` + a JS "gentle
  front-facing sway" IIFE (search `station: gentle front-facing sway`). To do this: REMOVE that sway,
  set the model's orientation (`orientation`/`camera-orbit` polar so we look slightly down on it),
  and drive a wheel-style spin. Iterate visually with the client — cannot be judged headless.

## OBSERVER — improvement concepts (client asked; pick one)
1. **"Launch bay" (recommended):** Observer becomes where you RUN the work — select a project and its
   real `work/*-showcase/` boots inside a framed monitor. Shares ONE demo engine with Journey So Far.
2. **"Gargantua work":** projects orbit the accretion disc (from the Interstellar boards); select to focus.
3. **Constellation connect:** category clusters become traceable constellations — hover = name, click = demo.

## New concept files added this session
- `concept-gargantua.html` — live animated black-hole hero ("bang" centerpiece; canvas, GPU).
- `concept-improvements.html` — 3 motion demos (client found these too tame — reference only).
- `concept-journey-gallery.html` — CircularGallery for PERSONAL JOURNEY (ported, ogl via CDN).

---

### APPENDIX — one-line pitch for the fresh session
> "Read PRD.md. We're rebuilding Alistair's portfolio as an Interstellar-scored, growon-craft
> interactive 3D experience — 5 tabs mapped to iconic scenes (cockpit hero, Gargantua work,
> planets projects, tesseract journey, wormhole contact), desaturated ochre/steel palette,
> Urbanist + mono HUD, theatrical gradient loader into the kept hello/constellation, per-object
> sound + ambient music. Start with the design-system swap. Original assets only — nothing from the film."

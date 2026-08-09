# Cosmos Rebuild Brief — "growon's soul, our skin"

Reference loved by client: **growon.kr/work**. Goal: rebuild the portfolio hero as an
interactive 3D scene in the space theme, matching growon's craft (see teardown below).

## growon.kr/work teardown (verified via headless Chromium)
- **Stack:** Next.js App Router on Turbopack + React Server Components. **React Three Fiber**
  (canvas has `data-engine`, but `window.THREE` undefined -> three bundled as ESM, not global).
  **No GSAP / Lenis / Locomotive / Barba** - motion is hand-built via R3F `useFrame` + React/CSS.
- **The idea (their copy):** "fully interactive 3D desk... every object holds a purpose. Some...
  a playful visual twist, others... hidden doorways to other pages."
- **7 GLBs:** desk, monitor, turntable, cup, chair, lamp, plant (separate files -> per-object
  lazy-load + hit-test + animate).
- **6 MP3s, per-object diegetic sound:** coffee(cup), chair_squeaking(chair), leaves(plant),
  reel_whoosh(turntable), book, whoosh(shared transition). Played via Web Audio (no <audio> in DOM).
- **/work doesn't scroll** (scrollHeight==innerHeight). Content is a full-viewport overlay
  `[data-panel-scroller]` (fixed inset-0 overflow-y-auto) layered over a persistent 3D canvas ->
  navigation never unmounts the scene.
- **Type:** Urbanist (Latin) + SUIT Variable (Korean), self-hosted variable woff2 via next/font.
- **Tailwind semantic tokens:** `bg-canvas`, `text-ink-primary`, per-section `--color-panel-work`.
- **Loader (client loves this):** navy->dusty-blue vertical gradient + film grain, centered light
  "Setting the scene..." with a hairline rule as progress. Theatrical copy, warm palette, not black.
- Cloudflare + RUM; Next/Image -> WebP, responsive `w=&q=75`.

## Our translation: "orbital workstation"
A desk adrift in orbit; window behind shows Earth/void (the loved gradient = the sky).
7 objects, each a portal + sound:
1. Satellite (REUSE uploads/satellite.glb, 512KB) -> About/hero - telemetry blip
2. Terminal/monitor (screen runs RAGStar retrieval viz - see concept-latent.html) -> Work - keys
3. Radar dish (their turntable) -> Journey - radar sweep
4. Zero-g coffee cup -> playful gag - sip
5. Star-lamp (their data-lamp toggle) -> light/dark - power click
6. Terrarium plant -> easter egg - leaves
7. Command chair -> Resume - chair swivel

## Design-system pivots (kills the "kiddish" feel - mostly free)
1. Drop **Orbitron** -> clean geometric sans (Urbanist / General Sans / Archivo).
2. Monochrome ink + ONE accent; category colors survive only as tiny per-object dots.
3. Gradient loader (navy->dusty-blue + grain + theatrical copy + hairline progress) -> hands into
   the existing hello/constellation intro (KEEP - client loves it) -> then desk scene reveals.
4. Persistent music mute-toggle (top corner) + whoosh on section transitions.

## Assets
- HAVE: uploads/satellite.glb (512KB webp, decoder-free - renders in model-viewer).
- NEED: 6 GLBs (desk, monitor, dish, cup, lamp, plant, chair) + 6-7 short SFX mp3s + 1 ambient track.
- Client-supplied fonts optional; else Google/self-host Urbanist.

## Existing concept files in repo
- concept-latent.html - interactive embedding-space hero (client's favorite of the 3; reuse for the terminal screen).
- concept-mission.html / concept-launch.html - static NASA/SpaceX layouts (client: "boring").
- index.html - live site; satellite big->small intro + transparent-overlay reveal already wired.

## Build order (for a fresh, cheap session)
1. Design system: swap font, collapse palette. (cheap, huge impact)
2. Gradient loader in our theme, verify with Playwright screenshot.
3. Source/generate the 6 GLBs + SFX (the heavy part; needs GPU browser to verify visually).
4. R3F (or model-viewer hotspots as a lazy fallback) interactive scene + per-object sound.
5. Persistent-canvas overlay routing + music toggle.

## Verification note
Headless Chromium here has no GPU (SwiftShader) - R3F/3D scenes stall on load. Real visual
verification of the 3D needs a GPU-backed browser. Playwright IS installed in scratchpad and
works for 2D/CSS/model-viewer screenshots.

---

# INTERSTELLAR MODE — chosen creative direction (client locked)

Through-line = **TIME** (Nolan's real subject: time as cost / connection). Whole site is one
journey. Score = ORIGINAL organ pads + a ticking motif (NEVER the actual film soundtrack,
footage, or the Dylan Thomas poem — reference in spirit only; copyright).

## 5 tabs -> scenes
1. HERO "Cockpit / Departure": inside the Ranger cockpit, Gargantua glowing through the window
   (= the loved gw-3 gradient, now motivated). Console switches/screens = nav portals. TARS beside.
   Loader over the black-hole glow -> hello/constellation -> scene.
2. WORK "Gargantua": capabilities orbit the accretion disc; hover a disc segment -> a skill.
   Black hole = CANVAS/shader (lensing), not a GLB.
3. PROJECTS "The Planets": each project = a destination flown to by the Ranger. Miller's ocean
   planet = flagship (tidal-wave reveal); ice world (Mann's) = another. Approach->land->screenshot
   + what it does. Twist: each planet shows a time-dilation "cost" metric (wink at 1hr=7yrs).
4. JOURNEY "The Tesseract": 5D bookshelf — milestones as moments across time you reach through
   (Cooper). Scroll = move through time; each milestone a frame you pull. Emotional core.
5. CONTACT "Wormhole / Signal": wormhole = gateway home. Form = "transmit a signal"; on send a
   gravity/morse pulse (Murph's watch easter egg holds contact details in morse).

## Interstellar 7 objects (replace the desk set)
Cockpit console (hero, interactive) · TARS monolith (guide + cursor w/ honesty-humor toggle +
About) · Ranger shuttle (project travel) · Endurance ring (nav hub) · Ocean planet (flagship) ·
Wormhole sphere (contact) · Murph's watch (time easter egg). Gargantua = shader. Reframe our
satellite.glb as a probe/CASE drone.

## Palette / type (kills "kiddish", extends earlier pivots)
Desaturated filmic: dust-bowl ochre + cold steel-blue + Gargantua amber. Monochrome + ONE ochre
accent. Clean geometric sans + mono HUD for time/coordinate readouts. Slow GRAVITATIONAL easing;
docking-spin page transitions. Persistent time-dilation clock as a global motif.

## Legal
No film audio/footage/poem/dialogue. Original assets "in the spirit of" Interstellar only.

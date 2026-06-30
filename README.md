# COSMOS — Portfolio

A signal-based portfolio that feels discovered, not browsed.

## What it is

A single-page portfolio with a sci-fi/void aesthetic — 3D satellite, letter-carved name reveal, scroll-driven timeline, and live project showcase.

## Sections

- **Hero** — Animated name carve-in, live UTC clock, 3D satellite model (GLB), dashboard cards, looping background video
- **Perspective Marquee** — Scrolling brand marquee (Vercel, Linear, Stripe, etc.) with 3D tilt
- **Mission Desktop** — Mac-style Finder window showing project folders
- **Observer** — Selected work cards (HawkAI Login, Quantasphere Hero) with hover-reveal parallax
- **Journey** — Sticky stacking timeline cards with constellation SVGs
- **Event Horizon** — Footer with contact and loopy background video

## Projects in `work/`

| Project | Stack | Description |
|---------|-------|-------------|
| **HawkAI Login** | React 19, Three.js, Ant Design, Vite 8 | 3D security camera login experience with GLSL shader ribbons |
| **Quantasphere Hero** | Vanilla HTML/CSS/JS | Interactive hero with cursor-driven video scrubbing |

## Run it

```bash
python3 -m http.server 4521
```

Open http://localhost:4521 — no build step needed for the main page. For HawkAI, navigate to `/work/hawkai-login-showcase/`.

## Stack

- Custom DC runtime (`support.js`)
- Three.js + model-viewer (3D satellite)
- Lenis (smooth scroll)
- Google Fonts: Fraunces, Space Mono, Orbitron, Space Grotesk, Archivo

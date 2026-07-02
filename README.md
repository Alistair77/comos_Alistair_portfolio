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
| **RAGStar** | Python, FastAPI, Pinecone, BM25, Cohere, Ollama | Hybrid search RAG with vector + keyword fusion via RRF |
| **Study Snippets** | Kotlin, Jetpack Compose, FastAPI, Supabase, Docker | Full-stack monorepo: Android app + Python backend |
| **Health Weight App** | Kotlin, Jetpack Compose, Material Design, Gradle | Android health and weight tracking app |

## Run it

```bash
python3 -m http.server 4521
```

Open http://localhost:4521 — no build step needed for the main page. For HawkAI, navigate to `/work/hawkai-login-showcase/`.

## Recent GitHub Repos

All projects linked from the portfolio are hosted on GitHub:
- [github.com/Alistair77/ragstar](https://github.com/Alistair77/ragstar) — Hybrid Search RAG System
- [github.com/Alistair77/study_snipp](https://github.com/Alistair77/study_snipp) — Full-stack study monorepo
- [github.com/Alistair77/health-weight-app-compose](https://github.com/Alistair77/health-weight-app-compose) — Android health tracker
- [github.com/Alistair77/AAPL_stock_prediction-2024](https://github.com/Alistair77/AAPL_stock_prediction-2024) — Apple stock prediction (Jupyter Notebook)
- [github.com/Alistair77](https://github.com/Alistair77) — Full GitHub profile

## Stack

- Custom DC runtime (`support.js`)
- Three.js + model-viewer (3D satellite)
- Lenis (smooth scroll)
- Google Fonts: Fraunces, Space Mono, Orbitron, Space Grotesk, Archivo

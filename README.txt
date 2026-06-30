THE COSMOS — concept page
=========================

Open index.html in any browser (double-click it, or drag it into a new tab).

What you'll see:
- Per-letter name "carve-in" on load
- Four real constellations (Orion, Ursa Major, Cassiopeia, Cygnus) whose
  lines draw themselves in
- A twinkling dust starfield that parallaxes as you move the mouse
- A live UTC clock in the HUD
- APPARITIONS — "the signal, given form": a cinematic triptych of vertical
  figure videos (the void's reply), staggered like a constellation. Slot 03
  is a locked "INCOMING" placeholder reserved for the third video.
- Selected "transmissions" (the work list)

Videos live in /media (web-optimized mp4 + a poster .jpg each). Each plate
shows its poster frame first, then the video fades in once it's actually
playing — so you never see a black box. Videos only play while on screen
(IntersectionObserver) and stay still as poster portraits under
prefers-reduced-motion.

To add the third video: drop apparition-03.mp4 + apparition-03.jpg into
/media, then swap the ".plate--locked" figure in index.html for a video
plate copied from 01/02.

It's a single self-contained file — no build step, no install.
Fonts (Fraunces + Space Mono) load from Google Fonts when online;
offline it falls back to system serif/mono and still works.

Respects prefers-reduced-motion (animations off if your OS asks for it).

— built as a standalone concept; the live site is being built separately.

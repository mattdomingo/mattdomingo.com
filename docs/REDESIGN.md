# Portfolio redesign

## Direction

Audience: startup and big-tech hiring managers. Cinematic near-black and architectural white themes, each with bold type, an orange accent, precise grids, and a shared abstract spatial identity. Native scrolling drives 3D transformations and sticky project chapters. Content and navigation remain available without animation or WebGL.

## Planned commits

1. `refactor: centralize verified portfolio content` — preserve the 15 existing project records and route IDs; add Openfloor and the previously résumé-only PerfectCandidate; consolidate current experience and skills; replace the outdated résumé and supply the applied-AI variant.
2. `feat: establish cinematic portfolio themes` — theme and motion preferences, shared navigation/footer, responsive typography, and the first meaningful homepage preview.
3. `feat: add immersive spatial storytelling` — lazy-loaded Three.js scene, native scroll choreography, featured work, experience, and personal introduction.
4. `feat: complete the portfolio experience` — archive and filters, server-rendered project details, About, contact, and résumé routes.
5. `test: verify portfolio behavior and build` — focused regression tests, production build and route smoke checks, documentation.

## Content authority

- Existing project listings, detail records, images, videos, skills, interests, and social links are retained. The Minecraft portfolio is described as the original version of this site.
- Latest Full Stack and Applied AI Original Format résumés from the “Create startup-focused resume” task, read September 7, 2026, govern current employment, dates, project ownership, education, and metrics. They supersede the old résumé's location, student status, and superseded performance claims.
- New lead stories: Visa Vital Signs; Openfloor (20 beta users, one paying customer); Holos capstone (five-person team, Three.js/MuJoCo viewer, enrichment pipeline, analytical IK, features implemented by Holos and showcased to Samsung and NVIDIA).
- Personal copy uses public-facing interests from the existing site (video, DJing, golf) and recent context (Denver, running, hiking). Private financial, health, home-address, and speculative personal assessments are excluded.
- Full Stack PDF remains at `/documents/resume.pdf`; Applied AI is `/documents/resume-applied-ai.pdf`.

## Invariants and acceptance

- Preserve Next.js App Router, npm, existing APIs and deployment compatibility; no publishing or production changes are part of the branch redesign.
- Every existing project ID resolves to the same project, including video and external links. Unknown/malformed IDs return a real 404.
- Content has one canonical source shared by the homepage, archive, and details.
- Theme persists; both themes provide readable text, visible keyboard focus, and usable mobile navigation.
- Honor system reduced motion and an explicit pause control. No scroll hijacking, mandatory animation, blocking loader, or pointer-only navigation.
- WebGL loads progressively, caps pixel density, stops while hidden or out of view, disposes resources, and has a non-WebGL fallback.
- Preserve EmailJS field contract, 10-minute post-success cooldown, and legacy retired-feature handling. Prevent duplicate submissions; provide clear configuration and failure states with direct email fallback. Do not send real test messages.
- Preserve Spotify integration with non-blocking loading and unavailable states.
- Run focused component/content tests, TypeScript/lint, production build, and HTTP route checks. Browser testing is outside the current request unless requested later.

## Dependency decision

Use the existing Framer Motion for scroll-linked UI motion and Three.js directly for the abstract 3D field. Three.js owns WebGL rendering, geometry, and resource disposal; no extra React renderer or animation framework is needed.

## Completed verification — September 7, 2026

- 34 tests pass across contact behavior, preference persistence/system reduced motion, mobile menu semantics/focus, archive filtering, résumé selection, stable project IDs, and asset existence.
- ESLint passes with zero warnings; TypeScript passes; Next.js production build passes and prerenders all 17 project detail pages.
- Production HTTP checks pass for 22 content routes, four real 404s (including malformed project IDs), 18 linked build assets, and both PDF downloads. Re-run with `node scripts/smoke.mjs <base-url>`.
- Direct comparison with `main` confirms all 15 original project IDs, titles, technologies, image/video paths, external links, features, challenges, and roadmap entries are retained. Updated portfolio copy explicitly distinguishes the original Minecraft design.
- Both copied PDFs match their latest source files byte for byte.
- Base theme text/accent contrast against all three theme surfaces: dark minimum 5.63:1; light minimum 4.80:1. This is a palette check, not a full browser accessibility audit.
- Existing API routes and server integration helpers are unchanged.
- Fixed the existing ESLint 8/flat-config mismatch by using ESLint 9 and invoking its CLI directly. Jest assertions are imported explicitly to avoid the repository's Cypress global types colliding with Jest.
- No browser visual/device QA or real message delivery was performed. Local integration credentials are absent; the UI exposes direct email and graceful music-unavailable states.
- The live website is unchanged. The local production preview uses `http://127.0.0.1:3000`; restart with `npm start -- --hostname 127.0.0.1 --port 3000` after a successful build.

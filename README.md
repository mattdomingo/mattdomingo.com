# Matt Domingo — Portfolio

A Next.js 15 portfolio with cinematic dark and architectural light themes, an interactive Three.js opening, native scroll choreography, and a complete project archive.

## Run locally

```bash
npm ci
npm run dev
```

Open the URL printed by Next.js. The theme button switches between dark and light; the motion button pauses ambient animation. Both preferences persist locally. System reduced motion always takes precedence.

## Content and routes

- `/` — selected work, Visa and earlier experience, and a personal introduction.
- `/projects` — the complete archive with technology filtering.
- `/projects/[id]` — pre-rendered project details; unknown IDs return 404.
- `/about` — biography, education, leadership, skills, interests, and Spotify listening.
- `/resume` — Full Stack and Applied AI PDF viewers and downloads.
- `/contact` — contact links and the existing EmailJS form.

Project content lives in `lib/projects.ts`; experience, skills, education, and social links live in `lib/profile.ts`. Project IDs are stable. Add a record and rebuild to publish a new project page. Images and the Holos capture video remain in `public/projects/`.

`public/documents/resume.pdf` is the current Full Stack résumé. `public/documents/resume-applied-ai.pdf` is its Applied AI counterpart. The content sources and design plan are documented in [docs/REDESIGN.md](docs/REDESIGN.md).

## Integrations

Copy `.env.example` to `.env.local` and configure the integrations you use. Do not commit credentials.

EmailJS uses `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`. The existing template contract is `name`, `email`, `message`, and `time`. These public configuration values must be present at build time. Without them, the form explains that it is unavailable and offers direct email. A successful delivery starts a ten-minute local cooldown; this is a courtesy limit, not server-side abuse prevention. Configure origin restrictions and quotas in EmailJS as appropriate for the existing deployment.

Spotify uses server-only `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`. The About page requests recent listening and top tracks; unavailable data does not block the page.

Existing `/api/auth` (retired easter egg), `/api/dog`, and Spotify routes retain their validation and rate limiting. Optional `SECRET_NAME` and `SECRET_MESSAGE` keep the legacy retired-feature check working.

## Verification

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
npm run build
npm start
# In another terminal, using the server's URL:
node scripts/smoke.mjs http://127.0.0.1:3000
```

The unit tests cover content destinations/assets, theme and motion preferences, mobile navigation, filters, résumé switching, and mocked contact delivery. The HTTP smoke check covers all content routes, real 404 responses, linked build assets, and both PDFs. Tests never send real messages.

Stop `next dev` before building or running the production server in this checkout because both use `.next`. The lint command uses ESLint 9 directly to match the project's flat configuration.

## Rendering and accessibility

Text and links render on the server. Three.js loads as an optional client chunk; a geometric fallback remains available without WebGL. The scene caps device pixel ratio, pauses rendering outside the story or in hidden tabs, and disposes GPU resources on unmount. Normal document scrolling is never intercepted. Reduced motion removes scroll transforms and automatic video playback; videos retain native playback controls where appropriate.

The existing Next.js deployment model is preserved. This branch does not publish or change the live site. Browser visual and device testing, authenticated Spotify playback, and real EmailJS delivery should be checked in the configured preview environment before release.

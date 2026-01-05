<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this Next.js weather app -->

Purpose
- Help an AI contributor be productive immediately by calling out the project's architecture, conventions, important files, and common workflows.

Project overview
- This is a Next.js 13 (app-router) TypeScript project focused on a client-heavy weather UI. The app exports a static output (see `next.config.js: output: 'export'`) and uses PWA support via `next-pwa`.
- Key folders:
  - `app/` — Next.js app routes and top-level `layout.tsx` which wraps the app in `Providers`.
  - `components/` — UI primitives and layout pieces. See `components/ui/*` for design-system-like components (e.g., `button.tsx`).
  - `lib/` — domain logic and API wrappers. `lib/weather-api.ts` is the single place that talks to OpenWeather APIs.
  - `hooks/` — client-side data hooks using React Query that call `lib/weather-api.ts` (e.g., `use-weather.ts`).

Architecture and data flow (concise)
- Data flows from `lib/weather-api.ts` (axios + environment API key) → `hooks/*` (React Query) → components under `components/weather/*` and pages in `app/`.
- `components/providers.tsx` registers a single React Query client and `next-themes` provider used across the app; prefer using the hooks in `hooks/` rather than calling `lib/weather-api` directly in components.
- The app relies on client components for interactive UIs (many `use client` files). Server components are limited to static layout and metadata in `app/layout.tsx`.

Important files to reference when coding
- `next.config.js` — project output is static export; images are unoptimized and PWA is enabled. Changes here affect build and deployment.
- `package.json` — scripts: `dev`, `build`, `start`, `lint`, `typecheck`. Use `npm run dev` for local development.
- `app/layout.tsx` — top-level layout and where `Providers` is mounted.
- `components/providers.tsx` — initializes `@tanstack/react-query` client defaults and `next-themes`. Adjust query defaults here when changing caching/retries.
- `lib/weather-api.ts` — single source-of-truth for OpenWeather usage, geo-lookup and forecast parsing. Maintain shape contracts here; hooks and components assume these types.
- `hooks/use-weather.ts` — canonical React Query hooks. Use these hooks for caching and consistent query keys.
- `components/ui/*` — design system building blocks (class-variance-authority + `cn` helper). Follow `button.tsx` patterns for variants & sizes when adding new UI components.

Project-specific conventions and patterns
- TypeScript + Next.js app-router conventions: prefer `app/` routes and Server Components when possible; interactive UI should be a `use client` component.
- React Query centralization: All network caching behavior is controlled through `components/providers.tsx` and per-hook overrides in `hooks/`.
- API key usage: OpenWeather API key must be provided via `NEXT_PUBLIC_OPENWEATHER_API_KEY`. The app reads it in `lib/weather-api.ts`. Avoid hardcoding keys.
- UI styling: Tailwind + utility-first classes. Reusable variants are implemented with CVA (`class-variance-authority`) and combined via `cn` helper in `lib/utils.ts`.
- Error handling: `lib/weather-api.ts` throws generic errors (e.g., 'Failed to fetch current weather'). When adding new error flows, prefer returning React Query errors from hooks and rendering them in UI components.

Testing / build / dev notes
- Local dev: `npm run dev` (Next's dev server). Because `next-pwa` sets `disable` based on NODE_ENV, PWA is disabled during development by default.
- Static export: `npm run build` then `npm run start` follows normal Next.js flow; note that `next.config.js` sets `output: 'export'` which produces a static export — changing SSR/runtime behavior needs careful review.
- Typecheck: `npm run typecheck`. Linting: `npm run lint`.

Examples (copyable patterns)
- Use the hook, not the API directly:
  - Good: `const { data } = useWeatherByCity('Hanoi')` (from `hooks/use-weather.ts`).
  - Avoid: calling `weatherAPI.getWeatherByCity` inside a component without React Query unless intentionally bypassing caching.
- Add UI variants using CVA like `components/ui/button.tsx`. Create pattern-consistent props (variant, size) and export the variants for reuse.

Integration points and external deps
- OpenWeather (HTTP API) — used in `lib/weather-api.ts` (requires env var `NEXT_PUBLIC_OPENWEATHER_API_KEY`).
- Supabase is listed in `package.json` but may not be used across code; check `components` or future work for Supabase usage.
- React Query devtools are enabled in `Providers` — safe to use locally but should be considered for removal in production builds.

When editing files, keep these quick rules
- Preserve the API shapes in `lib/weather-api.ts` unless you update all dependent hooks and components.
- Add or update query keys consistently: keys follow the pattern `['weather', 'city', city]` and `['weather', 'coords', lat, lon]`.
- Follow the CVA / `cn` pattern for UI components. See `components/ui/button.tsx` for example.

If you need to change runtime/config
- For changes that affect build/runtime (e.g., `next.config.js` or moving code from client to server components), run `npm run build` and `npm run start` locally to validate the static export behavior.

Feedback request
- If any section is unclear or you want more examples (e.g., more components to reference, or testing commands), tell me what to expand and I will iterate.

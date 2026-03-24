# Localhost Unblock Notes (Quick Pass)

## Goal
Make the project run locally in Vite for immediate editing, without full refactor.

## What was validated
- Dependency install succeeds via `npm i`.
- Dev server starts via `npm run dev` and serves locally (switched to port 3001 because 3000 was occupied).
- Production build succeeds via `npm run build`.

## Code changes applied
- Fixed import/export mismatch in `src/App.tsx`:
  - Changed import from `FollowUps` to aliased import from actual exported symbol `Followups` in `src/components/Followups.tsx`.

## Existing compatibility setup already present (kept as-is)
- `vite.config.ts` already contains aliases for:
  - Version-pinned package specifiers (example: `sonner@2.0.3` -> `sonner`).
  - Figma asset specifiers (example: `figma:asset/<hash>.png` -> `src/assets/<hash>.png`).

## Notes / warnings (non-blocking)
- TypeScript editor diagnostics may still show unresolved module warnings for `figma:asset/...` import specifiers, even though Vite build/dev resolves them through aliases.
- Vite reported large chunk size warnings during build; these do not block localhost startup.

## Deferred cleanup (not part of quick unblock)
- Replace `figma:asset/...` imports with direct local file imports.
- Replace version-pinned package import strings in source with normal package imports.
- Split the large `src/App.tsx` into smaller feature modules.


# Legacy Multi-Title Workbench (Quarantined)

This directory contains the archived **Wolverine Forge** multi-title prototype workbench
(`App.tsx`, legacy demo walkthrough, legacy panels, and legacy stylesheets).

## Boundary rules
- **Production builds exclude this directory.** `src/main.tsx` only lazy-loads `./legacy/App.tsx`
  when running Vite in development mode with `?legacy=1`.
- **Do not import from `src/legacy/` into active Madden Studio code** (`src/features/studio/`,
  `src/components/`, `src/data/`, `src/lib/`) or gauntlet tests.
- New features and bug fixes belong in the active feature-sliced studio modules.

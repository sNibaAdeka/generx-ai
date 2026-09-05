# GeneRx AI — durable build notes

Frontend MVP: Next.js 15, React 19, TypeScript, CSS tokens, Framer Motion, React Three Fiber. Keep the landing cinematic; keep clinical screens calm, high-contrast, and scan-first.

Tokens: void `#05070B`, onyx `#0B0F17`, nebula `#12172B`, helix `#2AF0EA`, aurum `#E8B857`. Status colors are reserved for clinical status only.

All clinical copy is probabilistic: use “may”, “the data suggest”, “consider”. Never diagnose, prescribe, or fabricate citations. All report screens must end with the exact disclaimer in `messages/en.json`. Mock identities must remain invented.

Model the frontend/backend boundary through typed modules in `src/lib/api`. Respect reduced motion; Three scenes must have a static poster fallback. Keep focus states visible and use text/icon alongside colour for risk status.

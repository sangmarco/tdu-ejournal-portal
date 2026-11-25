# Start here – AI handoff
## Snapshot
Repository sangmarco/tdu-ejournal-portal. Work on feature/multi-journal-ojs. Last application commit verified in previous session: ee8960f98463845275eb236de2bf959a2c106892. The documentation handoff commit follows it. Always check git status, current HEAD and origin before editing; do not reset user changes. main remains separate.
## What exists
Configured journal registry, anonymous REST client, published issue mapping and exact publication selection, issue detail page, public API proxy and temporary legacy status adapter. Existing main updates already merged at d8f7149. Read current files, not only descriptions.
## First actions in Codex
1. git fetch origin; inspect branch and local changes; switch to feature/multi-journal-ojs only when safe and pull --ff-only if appropriate.
2. Read AGENTS.md, docs/PROJECT_CONTEXT.md, ARCHITECTURE.md, OJS_API_CONTEXT.md, API_ENDPOINTS.md, UI_UX_GUIDELINES.md, DECISIONS.md, TEST_REPORT.md and ROADMAP.md.
3. Copy .env.example to .env.local only if no existing config; use OJS_BASE_URL=http://localhost/ojs/index.php and OJS_PUBLIC_JOURNALS=tapchi1. Never overwrite working secrets or commit .env.local.
4. npm ci; read installed Next.js docs required by AGENTS.md; npx tsc --noEmit, npm run lint, npm run build. Run npm run dev and test REST from the local machine without session/cookie. Fix baseline before expanding features.
5. Fetch raw OAI XML from local OJS. Implement and test OAI client and metadata merge; follow architecture and evidence docs. Do not infer language order or use titles as primary identity. Add tests with synthetic/sanitized fixtures.
6. Continue journal-aware article pages, cross-journal search and UI per wireframe. Test at least two actual approved journals. Update docs with actual outcomes and next task, commit to feature branch.
## Known blockers
No local execution or integration test has been done in ChatGPT. Raw XML not supplied (only rendered PDF report). contexts denied; submissions empty; sections denied. PDF file availability and current issue indicator unverified. Legacy UI may expect arrays/metadata missing in public projection; inspect before assuming it works. Do not mark tasks complete merely because code exists.
## Handoff protocol
At end of each session record commits, changed files, commands and test outcomes, unresolved issues and the smallest next actionable task. Keep HANDOFF current, update DEVELOPMENT_LOG/TEST_REPORT/ROADMAP and decisions. No credentials, unpublished data, private source links or raw privileged payloads in public repository.

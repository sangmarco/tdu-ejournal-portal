<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->


## TDU eJournal project instructions

Start every implementation session by reading [HANDOFF](docs/HANDOFF.md), [project context](docs/PROJECT_CONTEXT.md), [architecture](docs/ARCHITECTURE.md), [API evidence](docs/API_ENDPOINTS.md), and [UI requirements](docs/UI_UX_GUIDELINES.md). Check the actual branch, working tree, latest commits and code against these documents; they are not a substitute for inspection. Preserve local changes. Work on the feature branch, never merge into main without approval and passing checks.

OJS is the publication system of record. Use the configured public journal registry and public published issue/detail endpoints; never expose privileged upstream payloads, workflow URLs, keys or private records. Use the evidence in docs/OJS_API_CONTEXT.md. Do not invent missing metadata or treat test fixtures as a live integration pass.

Before implementation, read the installed Next.js documentation as instructed above. Run relevant unit tests, typecheck, lint, production build and live integration checks where possible. Record each actual result (PASS/FAIL/BLOCKED/NOT RUN), including command and failure details without secrets. Update HANDOFF, DEVELOPMENT_LOG, TEST_REPORT, ROADMAP and decisions when applicable. Keep commits focused. Never commit .env.local, private source materials or raw privileged JSON.

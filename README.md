# TDU eJournal Portal

Cổng thông tin tạp chí khoa học Trường Đại học Thành Đông. Next.js App Router, TypeScript; OJS 3.5.0.6 remains the publication system of record. Multi-journal migration is in progress.

## Local setup
Check out feature/multi-journal-ojs (or the current implementation branch). Install dependencies with npm ci. Copy .env.example to .env.local and set:

```dotenv
OJS_BASE_URL=http://localhost/ojs/index.php
OJS_PUBLIC_BASE_URL=http://localhost/ojs/index.php
OJS_PUBLIC_JOURNALS=tapchi1
```

The base must not include a journal path or /api/v1. Configure only journals approved for public display. Add more paths separated by commas. Start OJS, then npm run dev. If Next.js is in a container, use an upstream address reachable from that container and a browser-reachable public base URL.

Try /vi/journals, /vi/journals/tapchi1, /vi/journals/tapchi1/issues/1 and /api/ojs/articles?journal=tapchi1 on the Next.js server. These are implemented routes, not confirmed live test results. No admin token is required by the current public proxy; anonymous access on the user's installation remains to be tested.

## AI handoff
Read AGENTS.md and docs/HANDOFF.md first. The docs directory is shared versioned project memory for Codex, Claude Code and ChatGPT. See docs/TEST_REPORT.md before relying on any feature. No production-ready claim is made. Do not merge main until validation and review.

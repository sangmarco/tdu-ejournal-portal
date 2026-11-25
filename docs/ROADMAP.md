# Roadmap
1. DONE (code only): initial directory, branch synchronization, REST public DTOs and issue route.
2. DONE (documentation): shared AI project memory.
3. NEXT: inspect local branch and run npm ci, typecheck, lint, build; fix baseline errors; test anonymous REST on actual OJS.
4. NEXT: obtain XML from live OAI, implement safe namespace-aware parser, resumptionToken, deduplication, deleted records and identity-safe merge. Add sanitized synthetic fixtures and unit tests.
5. Implement public article details and search across journals, filters/pagination and fault isolation.
6. Migrate homepage/header/footer/legacy hooks and pages to journal-aware public DTOs; preserve wireframe and language switching. Remove legacy status adapter once consumers migrated.
7. Verify real metadata, PDF access, covers, two journals, security, responsive UI and SEO. Record actual tests.
8. Review focused commits, create draft PR into main; no merge until authorized and checks pass.

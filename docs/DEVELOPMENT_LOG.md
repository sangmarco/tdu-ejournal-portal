# Development log
- Initial branch created from 0aa4086; initial directory commit 0cfff2a; branch update initially failed, later recovered and read back.
- Merge d8f7149 synchronized main a73c7bf (three commits) without file conflicts.
- REST commit ee8960f added public projection, configured registry, issue detail and article extraction, and replaced legacy proxy upstream calls. Legacy display adapter retains status 7; raw OJS mapping requires status 3 and exact current publication. User directory proxy disabled. Current issue not inferred.
- AI handoff documentation pass: replaced stale README and API context, preserved generated AGENTS blocks, added project memory, roadmap and test status. Documentation only, no application changes or runtime checks in this pass.
- Pending: OAI parsing/merge, portal search, article detail UI, existing UI migration, safe fixtures and runtime tests. See HANDOFF.

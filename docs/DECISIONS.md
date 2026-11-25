# Decision log
- D01: Preserve OJS as system of record; portal read-only, submit/review/editorial links return to correct OJS journal.
- D02: Retain Next.js/TypeScript modular monolith, no new framework or database initially.
- D03: Configured OJS_PUBLIC_JOURNALS registry now because contexts requests denied; automatic discovery deferred, only opt-in public paths.
- D04: Use published issue list/detail, not unavailable submissions/sections APIs; exact current publication matching. OAI supplements metadata rather than overriding publication visibility.
- D05: Anonymous server-side reads preferred; no admin token in browser or proxy. User directory proxy disabled. Fail closed on uncertain publication visibility.
- D06: Keep wireframe journal layout and extend separate portal level. No invented ISSN/DOI/statistics/PDF availability.
- D07: Keep feature branch separate, preserve main; shared docs are portable project memory, not implicit cross-tool conversation memory.
- D08: Preserve existing legacy status adapter temporarily; migrate UI to public DTOs before removing it. Verify status constants in exact installed OJS.

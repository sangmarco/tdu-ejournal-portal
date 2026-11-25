# API evidence (25/11/2026)
VERIFIED means user-supplied response inspected, not a live test from the development environment.

| Endpoint | Evidence | Use |
|---|---|---|
| /tapchi1/api/v1/issues | VERIFIED | Published issue list, items/itemsMax |
| /tapchi1/api/v1/issues/1 | VERIFIED | Issue details, articles and sections |
| /index/api/v1/contexts | ACCESS DENIED | Not used |
| /_/api/v1/contexts | ACCESS DENIED | Not used |
| /_/api/v1/contexts/1 | ACCESS DENIED | Not used |
| /tapchi1/api/v1/sections | ACCESS DENIED | Not used |
| /tapchi1/api/v1/submissions | EMPTY RESPONSE | Not used |
| /tapchi1/oai?verb=ListRecords&metadataPrefix=oai_dc | VERIFIED in rendered report only | Raw XML NOT VERIFIED |
| PDF download, covers, current issue indicator, other journal contexts | NOT VERIFIED | Do not fabricate |

Authentication/session context of tests unknown. Verify anonymous GET without cookies, bearer tokens or browser login. Check two real journals. Do not publish raw workflow data or actual test records in fixtures.

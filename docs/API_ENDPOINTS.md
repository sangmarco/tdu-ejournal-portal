# API evidence (25/11/2026)

## Latest approved tapchi2 evidence (2026-11-26)
Exact plugin allowlist now tapchi1,tapchi2. Anonymous lists both 200: tapchi1 one issue, tapchi2 zero. tapchi2 requesting tapchi1 issue 1 returns 404. Malformed issue abc now returns 404 in both contexts after controller route fix. Positive second-journal detail/reverse isolation blocked by empty published list. Explicit null publishingMode is permitted by installed nullable schema and anonymous NONE-denying policy; malformed coercion removed. See TEST_REPORT; no access settings/publications changed.

## Corrective evidence (2026-11-26; supersedes live enrichment claims below)
Fresh service initially failed with HTTP 404 because the local configured base lacked `/index.php`; correcting only the ignored local base setting restored 2 REST articles. Fresh aggregate enrichment counts: 0 matched/enriched articles, 0 descriptions, 0 subjects. Live hybrid enrichment is NOT VERIFIED. Anonymous malformed projection `/issues/abc` returns 500, an unresolved negative-acceptance failure. Nonexistent journal 404 does not establish denial for an existing unapproved journal. See TEST_REPORT for exact scope.

## 2026-11-26 — installed-source verification (supersedes earlier uncertainty)
Read-only inspection of the actual running tree `C:\xampp\htdocs\ojs`: `dbscripts/xml/version.xml:13–20` declares release **3.5.0.6**, tag `3_5_0-6`, date 2026-10-31. Database upgrade state was not inspected. Source references below are relative to that tree. No config.inc.php, database, cache/private data or server logs were read; no upstream changes or credentials used.

### Exact anonymous denial chain
- `lib/pkp/classes/core/APIRouter.php:106–146` resolves the controller; `lib/pkp/classes/handler/APIHandler.php:73–76,90–105` registers group routes and executes global middleware before route dispatch.
- `lib/pkp/classes/core/PKPRoutingProvider.php:47–56` declares, in order: AllowCrossOrigin, SetupContextBasedOnRequestUrl, DecodeApiTokenWithValidation, ValidateCsrfToken, ValidatePostSize, TrimStrings, ConvertEmptyStringsToNull, **PolicyAuthorizer**.
- `PolicyAuthorizer.php:82–106` calls controller authorize(), returning 401 on a false decision absent another exception status. `api/v1/issues/IssueController.php:94–107` adds UserRolesRequiredPolicy, ContextRequiredPolicy, ContextAccessPolicy, OjsJournalMustPublishPolicy and, for detail, OjsIssueRequiredPolicy.
- `lib/pkp/classes/security/authorization/UserRolesRequiredPolicy.php:47–54` denies a missing user. This is an earlier blocker than route-level `has.user`; attributing the denial solely to HasUser is incomplete.
- Independently, `IssueController.php:60–88` requires has.user, has.context and manager/sub-editor/assistant/reviewer/author role authorization for list, current and detail. `lib/pkp/classes/middleware/HasUser.php:30–40` also returns 401 without a user.

This establishes the source-level reason anonymous requests cannot succeed; runtime tracing was not performed. It is stock authenticated behavior, not a public setting to enable. Do not remove these policies or add admin credentials.

### Existing public interfaces and live reachability
Anonymous curl GETs (bodies discarded, no cookies/tokens, no redirect following) returned: list/detail REST **401 JSON**; `/tapchi1/vi/issue/archive` and `/tapchi1/vi/issue/view/1` **200 HTML**; `/tapchi1/vi/article/view/1` **302** to its canonical custom slug, then a separate GET of that destination **200 HTML**; `/tapchi1/vi/oai?verb=ListRecords&metadataPrefix=oai_dc` **200 XML**. These are HTTP reachability checks, not content or live hybrid acceptance.

`pages/issue/IssueHandler.php:155–175,363–374` scopes archive/TOC by journal and published status. `classes/security/authorization/OjsIssueRequiredPolicy.php:59–79` checks journal ownership and publication visibility. `pages/article/ArticleHandler.php:119–160,197–201` scopes lookup, rejects unpublished anonymous content, resolves current publication/canonical slug and checks issue context. Galley login/subscription/payment checks remain separate (`532–619`). Base handlers enforce restricted-site policy; public landing metadata does not prove free PDF access.

No compatible anonymous issue JSON list/detail replacement was established. HTML and OAI are existing public interfaces, not drop-in replacements for the portal contract. See OJS_API_CONTEXT for OAI visibility limitations.

### Independent public projection implementation (implemented & verified live 2026-11-26)
An independent GenericPlugin `publicPublications` has been deployed and activated in OJS 3.5.0.6 (`plugins/generic/publicPublications/`). It extends `PKPBaseController` and is registered via `APIHandler::endpoints::plugin` (`APIRouter::registerPluginApiControllers()`).

- GET `/{journal}/api/v1/publicPublications/issues`: returns JSON with contract `"public-publications-v1"`, pagination `itemsMax`, `items` (id, journalId, published, title, description, volume, number, year, datePublished, current, publishedUrl).
- GET `/{journal}/api/v1/publicPublications/issues/{id}`: returns single issue JSON including `articles` list with submission id, contextId, status=3, currentPublicationId, and publications (id, submissionId, status=3, issueId, sectionId, title, datePublished, pages, locale, authorsStringIncludeInBrowse, urlPublished).

Live curl evidence (verified 2026-11-26):
- `GET /tapchi1/api/v1/publicPublications/issues` -> 200 OK JSON (`contract: "public-publications-v1"`, 1 issue).
- `GET /tapchi1/api/v1/publicPublications/issues/1` -> 200 OK JSON (2 articles).
- Negative cases: non-existent journal (404), invalid issue id (404), invalid pagination count/offset (400 Bad Request).
- Portal integration: `OJS_PUBLIC_PROJECTION=true` activates the projection client in `src/lib/ojs/multiJournal.ts`, successfully receiving and merging publication data with live OAI enrichment.

## Earlier anonymous authorization diagnosis (historical evidence; superseded above)
Fresh anonymous list/detail probes both returned 401 with only the safe JSON `error` inspected: “Bạn không được phép truy cập tài nguyên được yêu cầu.” No machine error code was observed; no raw response retained.

Public upstream source for the owner-reported version: https://github.com/pkp/ojs/blob/3_5_0-6/api/v1/issues/IssueController.php (retrieved successfully). `getRouteGroupMiddleware()` requires `has.user`, `has.context` and role authorization; `authorize()` adds `UserRolesRequiredPolicy`. List, current and detail are in that group. Therefore anonymous 401 is consistent with stock OJS authorization, not evidence of a broken portal URL or a setting that merely needs enabling. Tagged-source finding subsequently confirmed against the installed tree above.

Operator actions:
1. Installed version/controller/middleware inspection is complete (above); database upgrade state and runtime tracing were not inspected. Obtain owner approval for the independent public projection; no configuration-only anonymous stock REST fix is established.
2. Do NOT remove `has.user`/role policies globally or expose the stock issue schema anonymously. Do NOT add admin tokens to the portal as a workaround.
3. Preferred proposal requiring owner approval: an OJS-maintained public read-only plugin/endpoint projecting only explicitly published issues and current published articles, scoped by journal, with bounded paging and private-field omission. Review schema, publication withdrawal/cache behavior and anonymous negative tests before adapting portal paths.
4. Alternative requiring explicit architecture approval: a separate least-privilege server-side publication export/projection service. Review its credential/storage boundaries and permitted public fields first; no privileged payload may reach the browser/proxy. OAI-only fallback is not approved because it does not establish existing REST visibility/issue ownership guarantees.
5. Retest list/detail anonymously and verify private/unpublished/cross-journal denials, then live exact-URL enrichment and second-journal isolation. Current live hybrid acceptance remains BLOCKED.
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

Original supplied evidence had unknown authentication context. Local anonymous checks on 2026-11-26 (no cookies/bearer tokens): issues REST returned HTTP 401 after initial timeout; locale-inserted REST URL returned 404. OAI endpoint returned 302 to /tapchi1/vi/oai; direct locale endpoint returned HTTP 200 and implemented parser read 2 records with explicit vi/en metadata labels. No raw XML retained. Continuation anonymous probes confirmed both list and `/tapchi1/api/v1/issues/1` return HTTP 401 application/json with no redirects; response bodies discarded. Installed-source inspection above now establishes mandatory anonymous authorization denial; no portal credential workaround is permitted. REST detail and hybrid live merge remain BLOCKED. Second approved real journal still required. Do not publish raw workflow data or actual test records in fixtures.

# Wireframe-based UI requirements
Source: owner-provided four-page wireframe. Preserve the academic, search-first layout. The palette below is a proposed design system, not an exact specification extracted from PDF.
## Page 1 – journal homepage
Top utility row VI/EN, login/register. Journal identity and ISSN/university (if available); nav latest issue, archives, fields, about, authors, notices, contact; prominent submit action. Search at top, field chips; desktop two-column body: latest issue cover/volume/number/date/DOI and contents link left, recent articles right (field, language, date, title, author, DOI, PDF/citation actions when verified). Notices and author/reviewer help below; footer journal identity, governing body, license/editor/contact/privacy/terms only from valid sources.
## Page 2 – article detail
Breadcrumb includes journal and issue; title in available languages, author and affiliation if supplied. PDF, citation, share; main column abstract(s), keywords, APA/RIS/BibTeX; sidebar dates, DOI, license and related articles where known. Never infer peer review type or dates. Missing metadata should be hidden or clearly unavailable.
## Page 3 – search
Search input, result count, sorting, pagination; left filters field/year/language, right article cards. At portal level add journal filter and journal label per article.
## Page 4 – mobile
Compact header with functional menu and language switch. Search, chips, latest issue, recent articles, submit action and footer in a single column; no horizontal overflow.
## Multi-journal extension
Portal homepage adds journal directory and recent articles across approved journals. Journal page inherits page 1. Routes /[locale]/journals/[slug], /issues/[id], /articles/[id] scoped by journal, plus portal search. Reuse components; avoid a commercial hero/large gradient and fabricated counts. Proposed primary #205778, dark #163B54, text #172B3B, secondary #64748B, surface #F1F3F6, white background; modest 4–8px radius and light borders. Use existing font unless a tested change is justified. Test 1440,1024,768,375px, accessibility, VI/EN, real links/actions and loading/empty/error states.

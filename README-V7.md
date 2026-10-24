# ParSU Sagñay — Standard Modern Website (v7) — MAIN VERSION
Standard modern multi-page website: Gov bar + sticky top navigation (CFMS logo), no sidebar.
Pages: index (Home), about, programs, org-chart, campus-life, news + 3 article pages, admissions (info only), contact.
Motion (BrewedOps-inspired, slow and reduced-motion safe): Home split-headline reveal + gradient drift + slow congratulatory carousel; About slide-ins; Programs card-fan settle; Org Chart pop/draw connectors; Campus Life collage settle; News stagger + article zoom-settle; Admissions stagger; Contact slide/pop. All motion switches OFF under prefers-reduced-motion.
The sidebar experiment lives separately in ../parsu-sagnay-motion-v6/ and is NOT part of this version. Serve this folder to view (python3 -m http.server 8000) — extract the ZIP fully before opening index.html.

## News update (2026 Research Agency In-House Review)

- New article: `news-cfms-best-paper-awards-2026.html` — CFMS–Sagñay faculty researchers, Best Paper Awards, September 23, 2026, ParSU–Goa via Zoom. Story + 3 posters provided via *ParSU Sagñay News Corner*.
- Photos saved locally: `assets/news/best-paper-1.jpg` (1st Best Paper, Biodiversity Conservation), `best-paper-2.jpg` (2nd Best Paper, Biodiversity Conservation), `best-paper-3.jpg` (1st Best Paper, Fisheries/Aquaculture).
- Article lists the three award-winning papers with authors exactly as printed on the posters (transcribed from the posters).
- Added as the first card on News, the first card in Home “Latest News”, and as the first three slides of the Home congratulatory slider (6 slides total).
- IMPORTANT: author names/paper titles were taken from the posters. If the campus supplies a corrected press release (e.g., official spellings of names), update the article + card captions.

## News writing standard (standing rule, Oct 2026)

Apply to every news story, card, and slider caption:
- **Readability / Gunning Fog:** target Fog 8–10 (hard cap 12). Plain words first; define every acronym on first use (e.g., Bureau of Fisheries and Aquatic Resources (BFAR)).
- **Sentences:** average ≤ 17 words; one idea per sentence; longest sentence ≤ 25 words.
- **Voice:** active voice, strong verbs, "who did what" in the first two sentences.
- **Capitalization (AP headline style — NOT APA):** sentence case for every headline and heading — capitalize only the first word, the first word after a colon, proper nouns, and acronyms (ParSU, Sagñay, BFAR, ISO, Marine Biology as a program name). No title case.
- **Headlines:** action-first — lead with a verb or the doer/result ("Faculty Researchers Win…", "Campus Passes…"), never start a headline with "ParSU", "Sagñay", or "CFMS" when an action lead is possible. Keep headlines ≤ 12 words where feasible.
- Retro-applied Oct 2026 to all four current stories (headlines + summaries rewritten; Best Paper article body simplified, Fog checked).

## Home congratulatory banner (photo fit rule)
- Slider photos use `object-fit: contain` at a fixed banner height (430px desktop / 320px mobile), centered on a navy brand gradient.
- Photos are NEVER cropped (`cover` is banned in the banner) and NEVER squeezed/stretched — aspect ratio is always preserved; side/top space is filled by the gradient, and captions sit below the photo so poster text is never covered.

## News update — Tab 2 (Bicol Regional SCUAA Meet 2026)
- New article: `news-scuaa-2026-athletes.html` — eight CFMS–Sagñay student-athletes at the Bicol Regional SCUAA Meet 2026 (Oct 12–17, 2026, host ParSU), from Tab 2 of the *ParSU Sagñay News Corner* document.
- Photo saved locally: `assets/news/scuaa-2026-athletes.jpg` ("Best of luck, ParSU CFMS" poster; small emoji icons in the document were not used — no emojis on the site).
- AP sentence-case, action-first headline; text simplified (Fog checked). Athletes are not named in the source, so no names were added.
- Added as first News card, first Home "Latest news" card, and first slide of the Home banner (7 slides; banner shows the full photo, contain-fit, never cropped).

## FAQs page (replaces the Citizen's Charter page, Oct 2026)
- `citizens-charter.html` was removed and replaced by `faqs.html` (title: FAQs), linked site-wide in nav + footer.
- FAQs are written from the Citizen's Charter 2024 campus services only (Sagñay): admission/enrolment, records/certificates, library, student services/dormitory. Each answer cites its charter code + handbook page; requirements/times/fees were OCR-extracted from the charter (e.g., freshman requirements p.320, TOR p.325, good moral p.260, library card p.277, dormitory pp.308/311).
- The following charter sections are retained below for the record only.
- New page: `citizens-charter.html` (nav + footer site-wide), from the official Citizen's Charter 2024 PDF (Drive file `1nzdQ6FD4XvtkfixENZkEda-07hKMsAYy`, 556 scanned pages; services extracted by OCR of the "PSU Campuses" section).
- ONLY campus services with a verified Sagñay office/facility are listed: College/Dean's Office academics (CMPSACAD001–020, 022, 023), Campus Library (CMPSLIB001–004), Campus OSAS + Dormitory (CMPSOSAS001–004), Campus Registrar (CMPSURO001–004), each with charter code + handbook page.
- NOT listed (no verified Sagñay office/facility; add only upon campus confirmation): campus medical/dental clinic (CMPSCLI), tilapia production & campus hostels (CMPSPROD), rental of college equipment (CMPSCAR001), and ALL Goa (main) campus office services.
- Page links the official charter PDF on Drive (view) and the Client Satisfaction section.

## News update — Tabs 3–6 (Oct 2026 review)
Re-checked the *ParSU Sagñay News Corner* document (now 6 tabs). Verified each tab individually (parallel reads can cross results). Published:
- Tab 3 → `news-14-new-fisheries-professionals.html`: 14 new Registered Fisheries Professionals, Oct 2026 exam (86.67% first-time, 87.50% overall, 69.02% national — as printed on poster `rfp-poster-1.jpg`; 3 posters).
- Tab 4 → `news-shark-masters-intramurals.html`: ParSU Intramurals opening + Mr./Ms. Intramurals (John Albert Grejalvo; Lyza Mae Briguera, 2nd place). 11 photos `intramurals-*.jpg`.
- Tab 5 → `news-penafrancia-2026.html`: Peñafrancia feast, Sept 3, 2026, St. Andrew Parish. 4 photos `penafrancia-*.jpg`.
- Tab 6 → `news-cfms-interns-reefs-for-life.html`: BS Marine Biology interns complete OJT under Reefs for Life (Mr. Ramil Earl Madrideo). 4 photos `interns-*.jpg`. No date in source; none shown.
All four added to News (RFP first), RFP leads Home "Latest news"; RFP + Intramurals slides added to the Home banner (9 slides, full-photo contain fit). AP action-first headlines, plain-language text (Fog checked).
- FAQs rebuilt (organized): 35 questions in 6 anchored groups (General; Admission and enrolment; Academic services; Records and certificates; Library; Student services and dormitory), each generated from what the charter can answer (who may avail, office, requirements, steps, fees/time) with charter code + handbook page per answer.

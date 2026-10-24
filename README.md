# Partido State University — Sagñay Campus Website (HTML Prototype v1.0)

Single-page HTML prototype for presentation before full launch.

## Open it
- Double-click `index.html`, OR
- Serve the folder: `python3 -m http.server 8000` then open http://localhost:8000

## What's inside
- `index.html` — the complete site (CSS + JS inline, no build step, no CDN required)
- `assets/PSU-logo-official-web.png` — official ParSU seal (optimized from parsu.edu.ph)
- `assets/sagnay-badge-web.png` — CFAMS / Sagñay badge
- `assets/campus/*.jpg` — official campus photos (Hatchery, Labs, Library, Dormitory, Grounds)

## Design system
- Colors: ParSU Blue (dominant), Golden Yellow, Red, Green — layered with Sagñay ocean navy / turquoise / seafoam for the College of Fisheries and Marine Science
- Motion (adapted from BrewedOps Motion Library): split headline reveal, gradient mesh drift, floating UI chips, orbiting badge, product-float portal mockup, tilted-screen settles / tilt cards, kinetic marquee, animated counters + bars, layered parallax, scroll reveals
- Sections: Gov bar, Hero, Stats, About (Vision/Mission/Core Values P-S-U), Programs (BS Fisheries, BS Marine Biology), Dashboard Preview (Student/Faculty/Admin switcher), Fourfold Functions, Campus Life, News, Admissions, Officials & Transparency, Contact, Footer with 7 campuses

## Real content sources
- Vision/Mission/Core Values, University Seal meaning, programs, officials, address (Nato, Sagñay, Camarines Sur), phone +63 938 866 0005, email sagnay.campus@parsu.edu.ph — from https://www.parsu.edu.ph/sagnay-campus and related official pages
- News headlines adapted from the official ParSU newsroom

## Before full launch — checklist
1. Confirm enrollment/statistics figures, academic calendar dates, and admission deadlines with the Registrar & Dean's Office
2. Replace dashboard demo data with live SIS/Registrar integration (with Data Privacy Act review)
3. Get ParSU ICT / University approval, use official domain/subdomain (e.g. sagnay.parsu.edu.ph)
4. Verify official seal usage against the ParSU Brand Standards Manual; do not alter seal colors/proportions
5. Add: Citizen's Charter PDFs, downloadable forms, course catalogs, faculty directory, LMS & enrollment portal links
6. Accessibility & performance audit (WCAG, mobile data costs), SEO, analytics, and backup/security hardening

## Notes
- Dashboard numbers with "—" or demo labels are placeholders for design presentation only.
- Photos and seals belong to Partido State University; used here for the campus prototype.

---
## V2.0 additions (all-in-one, English/Tagalog)
- **Online Application for Admission** (`#apply`): 3-step wizard (Personal Info → Program & School → Review & Submit), PH mobile & email validation, document checklist, Data Privacy consent, auto-save draft (localStorage), prototype reference code `PARSU-SAG-YYYY-XXXX`, and Print Summary.
- **Language toggle** (`EN | TL` in navbar): translates hero, navigation, About (Bisyon/Misyon), Programs, Dashboard, Fourfold, News, Admissions, Faculty and Downloads headings. Choice is remembered on the device. Bikol can be added as a third dictionary later.
- **Faculty & Offices directory** (`#faculty`): live search + filters (Leadership / Fisheries / Marine Biology / Student Services). Only the 3 officials published on parsu.edu.ph are named; other entries are offices (Registrar, Guidance, Scholarship/BFAR-FSP, Research, Extension, Library) to avoid inventing personal names.
- **Downloadable forms** (`#downloads` + `assets/forms/`): 4 print-ready PDFs (Admission, Enrollment, Request for Records/TOR, Scholarship/BFAR-FSP endorsement) + `ParSU-Sagnay_Forms-Pack.zip` with all forms. Marked prototype — Registrar must approve control numbers before official use.
- Dashboard, gallery, news, transparency sections remain from v1.0.

---
## V3.0 — glitch fix, portal removal, verified org chart
- REMOVED: student portal mockup in the hero and the entire Student/Faculty/Admin dashboard section (it required fictional login data and its layered float + tilt + mouse-parallax transforms caused the glitching/jitter). Nav, hero CTA, program buttons and footer no longer link to any dashboard.
- Hero is now a stable public-information campus card (official photo, 2 programs / 7 campuses / 33 staff as stated on the official Sagñay page). No login, no personal data.
- ADDED: `#orgchart` — University President & VPs (University Officials as of July 2026) → Campus Dean Dr. Jonel M. Corral → Department Chairs Jasper R. Nieves & Maria Christina G. Garcia → program/function units marked TO BE CONFIRMED where the official site names no incumbent. Printable copy: `assets/ParSU-Sagnay_Organizational-Chart_Verified.pdf`.
- REBUILT `#faculty` as a Personnel Directory with verification status per name (Verified Current / Verify Before Launch / Historical). See `PERSONNEL-SOURCES.md` for the full source log. The remaining staff (of the 33) are intentionally shown as missing pending a certified HRMO roster.

---
## V4.0 — Multi-page rebuild (supersedes the single-page versions above)
Separate pages, no one-scroll site:
- `index.html` Home · `about.html` · `programs.html` · `org-chart.html` (actual official portrait photos: President, 4 VPs, Dean, 2 Department Chairs + verified personnel directory) · `campus-life.html` (actual campus photos + lightbox) · `news.html` + 3 article pages (`news-iso-9001-quality-audit.html`, `news-marine-biology-program-assessment.html`, `news-bfar-fisheries-scholars.html`) · `admissions.html` · `contact.html`
- Shared `assets/css/style.css` + `assets/js/main.js`.
- REMOVED as not yet valid: online application form, downloadable prototype PDF forms, EN/TL machine translation toggle, student dashboard/portal (removed in v3).
- News articles are internal pages: they summarize only the published University summary, add no unverified names/dates/figures, and carry a Credits box to Partido State University instead of redirecting readers off-site.
- IMPORTANT on pictures: photos are local files under `assets/`. They load correctly when the folder is SERVED (e.g. `python3 -m http.server 8000` / the live preview). Opening a lone HTML file in a sandboxed file viewer may block relative images — use the served preview.

---
## V5.0 — campus-directed edits
- Header logo on every page is now the official CFMS (College of Fisheries and Marine Science) campus logo (`assets/cfms-logo.png`, cleaned circular version of the official badge); the ParSU university seal remains in the footer.
- Home hero photocard replaced with a slow congratulatory photo carousel (6.5s/slide, pauses on hover/focus, prev/next + dots, off under reduced-motion) using actual campus photos and only verified milestones (ISO audit, BFAR-honored scholar-graduates, Marine Biology assessment).
- ALL emojis removed sitewide; replaced with a professional inline SVG icon set (graduation cap, fish, wave, landmark, flask, leaf, users, pin, phone, mail, search, award, Facebook, QR, chevrons).
- About → Core Values now follows the official PSU format (parsu.edu.ph/about/vision-mission-core-values): P – Passion for Excellence, S – Service, U – Unity and Inclusiveness, each with the official description.
- Contact now lists verified official Facebook pages (Sagñay Campus, Sagñay Student Council/CSC, ParSU Library — University Library Services, ParSU Official) plus other offices by official email where no verified Facebook page exists, and the official Client Satisfaction Measurement QR code (`assets/client-satisfaction-qr.png`, from parsu.edu.ph) with the survey link.
- Org chart: Department Chair corrected to Program Chair — Mr. Jasper R. Nieves (BS Fisheries) and Mrs. Maria Christina G. Gumba (BS Marine Biology), per campus instruction. Teaching & NTP personnel list remains "To Be Updated" pending the campus list.

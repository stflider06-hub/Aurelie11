# Aurelie — Beauty Salon Website Template (Sky Blue Edition)

A production-ready, offline-first beauty salon website built with plain HTML5, CSS3 and
vanilla JavaScript. No frameworks, no build step, no backend — open `index.html` and it works.

## Files
```
/project
  index.html        → full site: home, about, services grid, gallery, team, reviews, FAQ, contact
  services.html     → step 1 of booking: choose a service (grouped by category, with search)
  specialists.html  → step 2 of booking: choose a specialist, then finish via WhatsApp
  style.css         → design system + all styling (sky-blue palette)
  script.js         → all interactivity for every page
  /images           → drop real client photography here
  /icons            → favicon.svg (brand mark placeholder)
  /fonts            → optional local font files (Google Fonts load via CDN by default)
```

## How the booking flow works (no backend needed)
1. Any "Book Now" button on `index.html` opens **services.html**.
2. The client picks one or more services (saved in the browser, not a server).
3. **Continue** opens **specialists.html**, where they pick a specialist (or "Any specialist").
4. **Finish on WhatsApp** builds a message like:
   `Service(s): Manicure, Facial Care — Specialist: Elena Moreau`
   and opens WhatsApp with it pre-filled — the salon just replies to confirm.

No database, no server, no login — the whole thing runs in the visitor's browser.

## Design system
- **Palette:** sky-blue, defined once as CSS custom properties at the top of `style.css`
  (`--gold`, `--rosegold`, `--bg`, `--ink`, etc. — names are historical, values are blue).
  Change the hex values in `:root` to re-theme the entire site in one place.
- **Fonts:** Playfair Display (headings), Manrope (body), DM Sans (labels/prices), via Google Fonts CDN.
- **Icons:** Font Awesome via CDN.
- Fully responsive (320px–1920px+), with a dark/light mode toggle and a 5-language switcher
  (EN / RU / KZ / KG / UZ) in the header of every page.

## Fastest way to customize for a real client (~1–2 hours)
1. **Swap photos.** Every `<img>` currently points to a free stock photo (Pexels). Replace
   `src="..."` with your own file in `images/` — keep the same `class` so sizing/shape/shadows
   carry over automatically.
2. **Find & replace** the salon name ("Aurelie"), address, phone, email, WhatsApp number
   (`15551234567` appears in floating buttons, footer, and the WhatsApp booking link), and
   social links.
3. **Edit services** in the `services__grid` section of `index.html` **and** in `services.html`
   (both lists should match — they're currently kept in sync by hand, not shared automatically).
4. **Update colors** in `style.css` under `:root` if the client has existing brand colors.
5. **Google Map** — replace `.map-placeholder` with a real `<iframe>` embed from Google Maps
   ("Share" → "Embed a map").
6. **Translations** — RU/KZ/KG/UZ text lives in the `translations` object near the top of
   `script.js`. These were machine-translated for the demo; have a native speaker proofread
   before using with a real local client, especially for the language your clients actually speak.

## Selling this
- Sell finished, customized sites directly to local salons ($150–400 each) rather than only
  as an anonymous marketplace template — a faster path to real revenue with fewer clients needed.
- Use this exact file as your live portfolio piece when reaching out to prospects.
- Optionally list the vanilla-JS version on ThemeForest/Envato as a secondary, passive channel.

# Aurelie — Premium Beauty Salon Website Template

A production-ready, offline-first website built with plain HTML5, CSS3 and vanilla JavaScript.
No frameworks, no build step, no backend — open `index.html` and it works.

## Files
```
/project
  index.html      → structure & content
  style.css       → design system + all styling
  script.js       → all interactivity
  /images         → drop real client photography here
  /icons          → favicon.svg (brand mark placeholder)
  /fonts          → optional local font files (Google Fonts are loaded via CDN by default)
```

## What's already built in
Sticky/transparent header, animated mobile menu, parallax hero with animated stat counters,
about + timeline, "why us" cards, 12 service cards, special offers, price table, filterable
masonry gallery with lightbox + before/after slider, team grid, testimonial slider, video
modal, 10-question FAQ accordion, validated booking form with success state, contact block,
footer, floating WhatsApp/Call/Book buttons, back-to-top, scroll progress bar, loading screen,
dark/light mode toggle, and an EN/RU language switcher.

## Fastest way to customize for a real client (~1-2 hours)
1. **Swap placeholders for real photos.** Every image is a `.placeholder-img` div — replace
   each with `<img src="images/your-photo.jpg" alt="...">` and keep the same class names so
   sizing/radius/shadows carry over automatically.
2. **Find & replace** the salon name ("Aurelie"), address, phone, email, and social links —
   they appear in the header logo, hero, contact section and footer.
3. **Edit `services__grid`** in `index.html` — update service names, durations and prices to
   match the client's actual price list (mirrors into the price table automatically if you
   keep the `data-i18n` keys in sync, or just edit both sections directly).
4. **Update colors** in `style.css` under `:root` (6 tokens: `--bg`, `--ink`, `--rosegold`,
   `--gold`, `--beige`, `--bg-alt`) if the client has existing brand colors.
5. **Connect the booking form** to a real backend if the client wants automated bookings —
   the simplest no-code options are Formspree, Getform, or a WhatsApp `mailto:`/`wa.me` link.
   As shipped, the form validates client-side and shows a success message (no server needed).
6. **Google Map** — replace `.map-placeholder` with an actual `<iframe>` embed from Google
   Maps ("Share" → "Embed a map").

## Selling this
- Sell finished, customized sites directly to local salons ($150–400 each) rather than only
  as an anonymous marketplace template — faster path to real revenue with fewer units needed.
- Use this exact file as your live portfolio piece when reaching out to prospects.
- Optionally list the vanilla-JS version on ThemeForest/Envato as a secondary, passive channel.

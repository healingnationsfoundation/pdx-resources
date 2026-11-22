# PDX Resources

Mobile resource finder for Operation Nightwatch guests. Jobs, food, shelter, health care, showers and laundry, clothing and supplies, recovery, and ID services in Portland, OR. Run by [Healing Nations Foundation](https://www.healingnationsfoundation.org/). Live at **https://resources.healingnationsfoundation.org**.

## What this is

A single-page web app that helps people experiencing homelessness find services in Portland. No login, no tracking, no data collection. Scan a QR code, tap a category, find what's open right now.

## Deploy

This is a static site. Drop it anywhere that serves HTML.

**GitHub Pages (free):**
1. Push this repo to GitHub
2. Go to Settings > Pages
3. Set source to `main` branch, root folder
4. Your site is live at `https://<username>.github.io/pdx-resources/`

**Cloudflare Pages (free):**
1. Connect this repo in the Cloudflare dashboard
2. Build command: (none)
3. Output directory: `/`

## Update resources

All resource data lives in `resources.json`. Edit it, commit, push. The site updates automatically.

The same file is published at https://resources.healingnationsfoundation.org/resources.json, so other tools can use the verified list. Healing Nations Foundation's Honest Day recovery app is one of them. Don't rename or remove fields without checking with the maintainer.

Each resource object (leave out fields you don't need):
```js
{
  "name": "Organization Name",
  "sub": "Subtitle / program name",
  "cat": ["work", "food", "shelter", "health", "hygiene", "supplies", "recovery", "id", "training", "more"],
  "desc": "What they offer.",
  "detail": "Additional context.",
  "highlight": "Important callout shown in green box",
  "addr": "Plain street address for directions link",
  "geo": [45.52321, -122.67815],  // optional: lat, lon of addr, for "Nearest first"
  "hours": { "mon": "08:00-16:00", "tue": null },  // walk-in hours only; null = closed; "21:00-06:30" = overnight
  "closed": ["2026-11-26", "2026-12-25"],  // optional: published holiday closures
  "stops": [{ "date": "2026-11-23", "time": "11:00-14:00", "place": "Site name", "addr": "Street address" }],  // optional: dated stops for a service that moves; use instead of hours
  "hoursText": "Human-readable hours string",
  "phone": "5031234567",  // digits only, for tel: link
  "url": "example.org",   // no https://, added automatically
  "urlLabel": "Get the app",  // optional button text instead of "Website"
  "noId": true  // shows "No ID Needed" badge
}
```

To preview changes, serve the folder (browsers won't load `resources.json` from a file opened straight from disk): `python -m http.server 4190`, then open http://localhost:4190.

## Donate section (for businesses)

[`donate.html`](https://resources.healingnationsfoundation.org/donate.html) helps Portland restaurants, grocers, bakeries, caterers, farms and shops get extra food and supplies to the right place fast. A business taps what it has (prepared/catered, refrigerated, produce, bakery, packaged, hygiene supplies, clothing) and whether it needs a pickup. It then sees who takes it, what they don't take, drop-off hours, notice needed, and how to call, with food-rescue programs that pick up listed first. Each listing shows its source and the date it was checked. The page also summarizes the federal and Oregon Good Samaritan donation laws, quoted from the official statutes, and offers an email to Healing Nations Foundation when nothing matches.

Recipients live in `donations.json`, separate from `resources.json`. See [CLAUDE.md](CLAUDE.md#how-to-update-donation-recipients) for the fields. 13 recipients verified November 21, 2026.

## QR code

Print a QR code pointing to your deployed URL and post it at Nightwatch (1432 SW 13th Ave). Guests scan it with their phone camera.

A QR code or link can open straight to a category, or to what's open right now: add `#food`, `#shelter`, `#health`, `#shelter+open`, or `#open` to the end of the address.

## Verified

All 129 resources verified active as of November 21, 2026.

## Contributing

Help is welcome, and you don't need to code. If hours have changed, a program has closed, or something's missing, [open an issue](../../issues/new/choose) and tell us how you know. Every change must be verified before it goes live. See [CONTRIBUTING.md](CONTRIBUTING.md).

Never add personal information about guests or volunteers to this repository. It's public.

## License

Dedicated to the public domain under [CC0 1.0](LICENSE). Use it however you want, including for other cities.

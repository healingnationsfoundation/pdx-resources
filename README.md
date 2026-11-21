# PDX Resources

Mobile resource finder for Operation Nightwatch guests. Jobs, food, shelter, hygiene, and ID services in Portland, OR.

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

All resource data lives in the `RESOURCES` array inside `index.html`. Edit the array, commit, push. The site updates automatically.

Each resource object:
```js
{
  name: "Organization Name",
  sub: "Subtitle / program name",
  cat: ["work", "food", "shelter", "hygiene", "id", "training"],
  desc: "What they offer.",
  detail: "Additional context.",
  highlight: "Important callout shown in green box",
  addr: "Street address for directions link",
  hours: { mon:"08:00-16:00", tue:null, ... },  // null = closed that day
  hoursText: "Human-readable hours string",
  phone: "5031234567",  // digits only, for tel: link
  url: "example.org",   // no https://, added automatically
  noId: true  // shows "No ID Needed" badge
}
```

## QR code

Print a QR code pointing to your deployed URL and post it at Nightwatch (1432 SW 13th Ave). Guests scan it with their phone camera.

## Verified

All 40 resources verified active as of November 21, 2026.

## Contributing

Help is welcome, and you don't need to code. If hours have changed, a program has closed, or something's missing, [open an issue](../../issues/new/choose) and tell us how you know. Every change must be verified before it goes live. See [CONTRIBUTING.md](CONTRIBUTING.md).

Never add personal information about guests or volunteers to this repository. It's public.

## License

Dedicated to the public domain under [CC0 1.0](LICENSE). Use it however you want, including for other cities.

# PDX Resources - Claude Code Instructions

## What this project is
A mobile-first resource finder for people experiencing homelessness in Portland, OR. Built for Operation Nightwatch guests and run by Healing Nations Foundation (HNF). Live at https://resources.healingnationsfoundation.org. No build step, no dependencies, no backend.

## Architecture
- `index.html` — the page: styles and logic.
- `resources.json` — every resource and category. The page fetches it on load.
- `resources.json` is a shared contract. HNF's Honest Day recovery app (separate, private repo) is meant to read it from https://resources.healingnationsfoundation.org/resources.json. Never rename or remove a field, change a category id, or change the file's shape without checking with the maintainer first. Adding new optional fields is fine.
- `donate.html` + `donations.json` — the Donate section, for businesses (restaurants, grocers, bakeries, caterers, farms, shops) with surplus food or supplies, not for guests. Linked from the guest page's footer. `donations.json` is its own file so `resources.json` stays unchanged; it isn't a shared contract yet, but keep its field names stable anyway.
- `sw.js` — keeps the guide working with no signal. Network first: online visitors always get the latest page and list, and the saved copy is refreshed; offline, the last saved copy is served with an `X-PDX-Offline` header so the page shows a "No connection" note. Same-origin files only. If you change its caching rules, bump `CACHE`.
- On the page, listings are sorted open now first, then opening later today, then no set hours, then closed (data order within each group). Badges say until when a place is open or when it opens next, from `hours`, `closed` and `stops`.
- Search needs every word to match and maps everyday words to categories (`SYNONYMS` in `index.html`: "bed" finds shelter, "blanket" finds Clothes & Supplies, "doctor" finds Health). Add a word there when guests search for something and get nothing.
- No frameworks. No build tools. No node_modules. Plain HTML/CSS/JS.
- Deployed as a static site via GitHub Pages from `main`. The `CNAME` file holds the custom domain; leave it alone.

## How to update resources
Edit `resources.json`. Each resource has: name, sub, cat (array of category ids), desc, detail, highlight, addr, hours (object keyed by day abbreviation with "HH:MM-HH:MM" strings or null), hoursText, phone (digits only), url (no protocol prefix), urlLabel (button text, optional), noId (boolean). Leave a field out rather than setting it to null.

Category ids (defined in `resources.json` under `categories`): "work", "food", "shelter", "health", "hygiene", "supplies", "recovery", "id", "training", "more". The page's icon for each lives in `CATEGORY_EMOJI` in `index.html`.

- Tag a resource only with categories it actually provides. "hygiene" (shown as "Showers & Laundry") means showers or laundry; "supplies" (shown as "Clothes & Supplies") means the place gives out clothing, blankets, sleeping bags, socks, hygiene kits or other gear; "id" means ID and document replacement; "health" means medical, dental, or mental health care, harm reduction, and health coverage; "recovery" means addiction recovery or substance use help (detox and naloxone fit both). Phones, transit, computers, legal help, crisis lines, mail, storage and pets go in "more" (shown as "Phone, Legal & More"). Labels can change; ids can't.
- Only set `hours` for times someone can walk in and get the service. It drives the Open Now / Closed badge. Orientation times, application windows and arrival cutoffs go in `hoursText` only.
- A slot whose close time is earlier than its open time runs past midnight (e.g. "21:00-06:30" for an overnight shelter). "00:00-24:00" means open all day (24/7 phone lines). A day can hold several windows separated by commas: "06:45-07:45,13:00-16:00". For phone-only services, `hours` are the hours the line is answered.
- Holiday closures: `closed` is a list of dates ("YYYY-MM-DD") when the organization says it is closed. On those days the card shows "Closed today (holiday)" and "Open now" leaves it out. Add dates only when the organization publishes them (its own page or 211info); never assume a place closes on a holiday. When an organization names holidays ("Thanksgiving and Christmas"), list the actual dates for the next 12 months and add more as the year turns over.
- Dated stops: for a service that moves by date (the county mobile clinic), use `stops`, a list of `{ "date": "YYYY-MM-DD", "time": "HH:MM-HH:MM", "place": "...", "addr": "..." }`, instead of `hours`. The card lists the next stops as direction links, shows "Open Now" during a stop, and drops each stop once it ends. With no stops left it counts as "no set hours". The mobile clinic's stops are refreshed automatically: `.github/workflows/refresh-mobile-clinic.yml` runs `scripts/refresh-mobile-clinic.mjs` every Sunday and Wednesday morning, which reads the county calendar (healthcenter.multco.us/events-and-stories/mobile-clinic-calendar), keeps the next 6 weeks, and commits only if something changed. Don't hand-edit those stops; they'll be overwritten. If the run fails (the county changed its page), fix the parser in the script; the old stops keep expiring on their own meanwhile. Run it by hand with `node scripts/refresh-mobile-clinic.mjs`.
- The "Open now" button shows only listings whose `hours` say they are open this minute; listings without `hours` are counted as "no set hours: call ahead", never shown as open. So set `hours` whenever walk-in hours are confirmed.
- The page view lives in the URL hash, so links and QR codes can open straight to a category: `#food`, `#shelter+open`, `#open`, or `#shelter+today` ("Later today": open now or opening later today, good for evening shelter and meals). Category ids are the hash names; don't rename them.
- `addr` is used for the Directions link, so keep it a plain street address. Put notes in `detail`.
- `geo` is [latitude, longitude] for `addr`, used only for "Nearest first" (distance is worked out on the phone; the location is never sent or saved). When you add or change an address, look it up with the US Census geocoder (geocoding.geo.census.gov, onelineaddress) and check the matched address is the same street, not SE vs NE. For intersections or landmarks, place it by hand. Round to 5 decimals.
- Each card has "Share this place": a link ending in `#place=<name-slug>` opens the guide to that listing. Renaming a listing changes its slug, so old shared links stop finding it.
- Every field is shown as plain text. Don't put HTML in the data.

## How to update donation recipients
Edit `donations.json`. `kinds` are the "What do you have?" choices: "hot" (prepared/catered), "cold" (meat, dairy, refrigerated), "produce", "bakery", "packaged", "hygiene", "clothing". Each recipient has: name, sub, desc, accepts (array of kind ids), acceptsText, notAccepted, pickup (boolean), pickupText, dropoff (boolean), dropoffText, dropoffHours (same format as `hours`; drives the "Taking drop-offs now" badge), leadTime, minimum, foodSafety, addr, phone (digits only), email, formUrl, formLabel, url (no protocol), sources (array of URLs without protocol), checked ("YYYY-MM-DD"). Leave out fields you can't confirm. `law` holds the Good Samaritan summaries, each with title, text (array of paragraphs), url, urlLabel, checked.

- Tag a kind only if the organization's own page (or 211info) says they take it. Don't infer "they rescue restaurant food, so they must take dairy."
- Every recipient needs `sources` and `checked`. They're shown on the card.
- Only set `dropoffHours` for stated drop-off times for the things the listing says they take. If the hours only cover clothing, or aren't stated, put what you know in `dropoffText`.
- Pickup programs are listed first automatically.
- Don't add food-safety rules unless the recipient or an official agency (OHA, ODA, Multnomah County) publishes them. Don't change the law text without re-reading the statutes (42 U.S.C. 1791 on govinfo.gov or uscode.house.gov; ORS 30.890 and 30.892 on oregonlegislature.gov). It is a summary, not legal advice.
- No staff members' personal emails or names, even when an organization's page lists them. Use the organization's general contact.

## Constraints
- Must work on old phones with slow connections. No heavy libraries.
- Should eventually work with JavaScript disabled. Today the app needs JavaScript to render; progressive enhancement is a future goal.
- No login, no accounts, no tracking, no cookies, no analytics.
- No requests to outside servers (no web fonts, CDNs, or third-party scripts). Use system fonts. Plain links out (maps, phone, websites, the App Store) are fine.
- All resources must be individually verified before updating.
- Touch targets minimum 44px.
- Must look good in dark mode (many users are outside at night).

## Style
- Keep it simple. These users have 12% battery and no patience for loading screens.
- Big buttons, high contrast, readable at arm's length.
- No decorative elements that don't serve a function.

## Testing
The page loads `resources.json` with fetch, which browsers block for files opened straight from disk. Serve the folder instead:

```
python -m http.server 4190 --bind 127.0.0.1
```

Then open http://localhost:4190 and use Chrome DevTools mobile emulation (iPhone SE or similar small screen) to verify layout. Check both light and dark mode.

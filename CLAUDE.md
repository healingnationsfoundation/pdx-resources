# PDX Resources - Claude Code Instructions

## What this project is
A mobile-first resource finder for people experiencing homelessness in Portland, OR. Built for Operation Nightwatch guests and run by Healing Nations Foundation (HNF). Live at https://resources.healingnationsfoundation.org. No build step, no dependencies, no backend.

## Architecture
- `index.html` — the page: styles and logic.
- `resources.json` — every resource and category. The page fetches it on load.
- `resources.json` is a shared contract. HNF's Honest Day recovery app (separate, private repo) is meant to read it from https://resources.healingnationsfoundation.org/resources.json. Never rename or remove a field, change a category id, or change the file's shape without checking with the maintainer first. Adding new optional fields is fine.
- `donate.html` + `donations.json` — the Donate section, for businesses (restaurants, grocers, bakeries, caterers, farms, shops) with surplus food or supplies, not for guests. Linked from the guest page's footer. `donations.json` is its own file so `resources.json` stays unchanged; it isn't a shared contract yet, but keep its field names stable anyway.
- No frameworks. No build tools. No node_modules. Plain HTML/CSS/JS.
- Deployed as a static site via GitHub Pages from `main`. The `CNAME` file holds the custom domain; leave it alone.

## How to update resources
Edit `resources.json`. Each resource has: name, sub, cat (array of category ids), desc, detail, highlight, addr, hours (object keyed by day abbreviation with "HH:MM-HH:MM" strings or null), hoursText, phone (digits only), url (no protocol prefix), urlLabel (button text, optional), noId (boolean). Leave a field out rather than setting it to null.

Category ids (defined in `resources.json` under `categories`): "work", "food", "shelter", "health", "hygiene", "recovery", "id", "training", "more". The page's icon for each lives in `CATEGORY_EMOJI` in `index.html`.

- Tag a resource only with categories it actually provides. "hygiene" (shown as "Clean") means showers or laundry; "id" means ID and document replacement; "health" means medical, dental, or mental health care, harm reduction, and health coverage; "recovery" means addiction recovery or substance use help (detox and naloxone fit both). Phones, transit, computers, legal help and crisis lines go in "more".
- Only set `hours` for times someone can walk in and get the service. It drives the Open Now / Closed badge. Orientation times, application windows and arrival cutoffs go in `hoursText` only.
- A slot whose close time is earlier than its open time runs past midnight (e.g. "21:00-06:30" for an overnight shelter).
- `addr` is used for the Directions link, so keep it a plain street address. Put notes in `detail`.
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

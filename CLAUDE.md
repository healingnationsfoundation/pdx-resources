# PDX Resources - Claude Code Instructions

## What this project is
A mobile-first resource finder for people experiencing homelessness in Portland, OR. Built for Operation Nightwatch guests and run by Healing Nations Foundation (HNF). Live at https://resources.healingnationsfoundation.org. No build step, no dependencies, no backend.

## Architecture
- `index.html` — the page: styles and logic.
- `resources.json` — every resource and category. The page fetches it on load.
- `resources.json` is a shared contract. HNF's Honest Day recovery app (separate, private repo) is meant to read it from https://resources.healingnationsfoundation.org/resources.json. Never rename or remove a field, change a category id, or change the file's shape without checking with the maintainer first. Adding new optional fields is fine.
- No frameworks. No build tools. No node_modules. Plain HTML/CSS/JS.
- Deployed as a static site via GitHub Pages from `main`. The `CNAME` file holds the custom domain; leave it alone.

## How to update resources
Edit `resources.json`. Each resource has: name, sub, cat (array of category ids), desc, detail, highlight, addr, hours (object keyed by day abbreviation with "HH:MM-HH:MM" strings or null), hoursText, phone (digits only), url (no protocol prefix), urlLabel (button text, optional), noId (boolean). Leave a field out rather than setting it to null.

Category ids (defined in `resources.json` under `categories`): "work", "food", "shelter", "hygiene", "recovery", "id", "training", "more". The page's icon for each lives in `CATEGORY_EMOJI` in `index.html`.

- Tag a resource only with categories it actually provides. "hygiene" (shown as "Clean") means showers or laundry; "id" means ID and document replacement; "recovery" means addiction recovery or substance use help. Phones, transit, computers, legal help and crisis lines go in "more".
- Only set `hours` for times someone can walk in and get the service. It drives the Open Now / Closed badge. Orientation times, application windows and arrival cutoffs go in `hoursText` only.
- A slot whose close time is earlier than its open time runs past midnight (e.g. "21:00-06:30" for an overnight shelter).
- `addr` is used for the Directions link, so keep it a plain street address. Put notes in `detail`.
- Every field is shown as plain text. Don't put HTML in the data.

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

# PDX Resources - Claude Code Instructions

## What this project is
A mobile-first resource finder for people experiencing homelessness in Portland, OR. Built for Operation Nightwatch guests. Single HTML file, no build step, no dependencies, no backend.

## Architecture
- `index.html` — the entire app. All resource data, styles, and logic in one file.
- Resource data lives in the `RESOURCES` array in the inline `<script>` block.
- No frameworks. No build tools. No node_modules. Plain HTML/CSS/JS.
- Deployed as a static site via GitHub Pages.

## How to update resources
Edit the `RESOURCES` array in `index.html`. Each object has: name, sub, cat (array of category strings), desc, detail, highlight, addr, hours (object keyed by day abbreviation with "HH:MM-HH:MM" strings or null), hoursText, phone (digits only), url (no protocol prefix), noId (boolean).

Valid categories: "work", "food", "shelter", "hygiene", "id", "training"

## Constraints
- Must work on old phones with slow connections. No heavy libraries.
- Must work without JavaScript disabled (progressive enhancement is a future goal).
- No login, no accounts, no tracking, no cookies, no analytics.
- All resources must be individually verified before updating.
- Touch targets minimum 44px.
- Must look good in dark mode (many users are outside at night).

## Style
- Keep it simple. These users have 12% battery and no patience for loading screens.
- Big buttons, high contrast, readable at arm's length.
- No decorative elements that don't serve a function.

## Testing
Open index.html in a browser. Use Chrome DevTools mobile emulation (iPhone SE or similar small screen) to verify layout. Check both light and dark mode.

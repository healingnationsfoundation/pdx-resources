# Contributing to PDX Resources

Thanks for helping. This page is used by people experiencing homelessness in Portland, often at night, on a low battery, with no way to double-check what it says. If it lists the wrong hours, someone walks across town for nothing. Accuracy matters more than anything else here.

## The easiest way to help: report what's changed

You don't need to know how to code.

- **Something on the page is wrong** (hours changed, a program closed, a phone number doesn't work): [open a "Report wrong info" issue](../../issues/new?template=wrong-info.yml).
- **A resource is missing**: [open a "Suggest a resource" issue](../../issues/new?template=new-resource.yml).
- **No GitHub account?** Email admin@healingnationsfoundation.org, or tap "Report a problem" on any listing on the site.

Tell us how you know. "I called them today" or "their website says so, here's the link" is perfect.

## Rules for every resource change

1. **Verify it first.** Every change needs a source: a phone call to the organization, its official website or social media, 211info, or a recent news story. Say what the source was, and when you checked, in your issue or pull request.
2. **One organization per change** where possible. That makes each change easy to check.
3. **Don't guess hours.** If you can't confirm a day's hours, leave that day as `null` (closed/unknown) and put what you know in `hoursText`.
4. **Keep it short and plain.** People read this standing outside on a small screen. Write `desc` and `detail` the way you'd say it out loud.

## Privacy: never commit personal information

This repository is public, and everything in it, including its history, is visible to anyone.

- Never add names, photos, phone numbers or any other details about guests or volunteers.
- Never add counts, check-ins, tallies or notes from shelters, meal sites or outreach.
- Only list organizations' public contact information.

The page itself must stay free of tracking: no analytics, cookies, accounts, or requests to outside servers (including web fonts and CDNs).

## Handling tips from guests (text line and email)

Guests can text or email tips through the "Report a problem" links. Tips go to a private inbox, never straight to the page or to public GitHub issues.

1. **Verify before publishing.** A tip is a lead, not a fact. Confirm it with the organization or another source from the list above, then make the change.
2. **Keep tips private.** Don't paste a tip's text, sender's number or email into an issue, pull request or commit. Describe the change in your own words ("Hygiene4All moved Tuesday showers to Wednesday, confirmed by phone 2026-11-21").
3. **Organizations and services only.** Never publish places where people sleep or camp, or anything that identifies a person, even if a guest suggests it. Listing them publicly can get people swept.
4. **No "unconfirmed" listings.** Don't publish tips with a "reported by a guest" label. If it can't be confirmed yet, it stays off the page.
5. **Count tips, not people.** It's fine to keep totals by topic (for example, "12 tips about meal times in November") to show what guests need. Don't keep a record of who sent what.

## Changing the code

The page is `index.html` (styles and logic) plus `resources.json` (every resource). There's no build step and nothing to install.

1. Fork the repo and make your change. Resource changes go in `resources.json`; see [README.md](README.md#update-resources) for the fields.
2. Preview it: run `python -m http.server 4190` in the folder and open http://localhost:4190. Check it on a small phone screen (Chrome DevTools, iPhone SE size) in both light and dark mode.
3. Open a pull request describing what you changed and how you checked it.

`resources.json` is also read by other tools, including Healing Nations Foundation's Honest Day app. Don't rename or remove fields or category ids in a pull request; open an issue to discuss it first.

Design rules (also in [CLAUDE.md](CLAUDE.md)):

- Must work on old phones with slow connections. No frameworks or heavy libraries.
- Touch targets at least 44px.
- High contrast, readable at arm's length, good in dark mode.
- No decoration that doesn't serve a purpose.

## License

By contributing, you agree that your contribution is dedicated to the public domain under [CC0 1.0](LICENSE), like the rest of the project.

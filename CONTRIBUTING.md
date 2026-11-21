# Contributing to PDX Resources

Thanks for helping. This page is used by people experiencing homelessness in Portland, often at night, on a low battery, with no way to double-check what it says. If it lists the wrong hours, someone walks across town for nothing. Accuracy matters more than anything else here.

## The easiest way to help: report what's changed

You don't need to know how to code.

- **Something on the page is wrong** (hours changed, a program closed, a phone number doesn't work): [open a "Report wrong info" issue](../../issues/new?template=wrong-info.yml).
- **A resource is missing**: [open a "Suggest a resource" issue](../../issues/new?template=new-resource.yml).

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

## Changing the code

Everything lives in `index.html`: the resource data, styles and logic. There's no build step and nothing to install.

1. Fork the repo and make your change.
2. Open `index.html` in a browser. Check it on a small phone screen (Chrome DevTools, iPhone SE size) in both light and dark mode.
3. Open a pull request describing what you changed and how you checked it.

Resource data is the `RESOURCES` array near the top of the `<script>` block. See [README.md](README.md#update-resources) for the fields.

Design rules (also in [CLAUDE.md](CLAUDE.md)):

- Must work on old phones with slow connections. No frameworks or heavy libraries.
- Touch targets at least 44px.
- High contrast, readable at arm's length, good in dark mode.
- No decoration that doesn't serve a purpose.

## License

By contributing, you agree that your contribution is dedicated to the public domain under [CC0 1.0](LICENSE), like the rest of the project.

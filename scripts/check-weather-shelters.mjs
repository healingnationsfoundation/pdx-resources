// Checks whether Multnomah County's emergency severe-weather shelters are open
// tonight, from the County's own page, and writes alerts.json for the guide's banner.
// Also saves the National Weather Service forecast for Portland (see the end).
// Run by .github/workflows/check-weather-shelters.yml every hour; by hand:
//   node scripts/check-weather-shelters.mjs
//
// Careful by design:
// - "open" only when the page lists severe weather shelters under "Open" and not
//   under "Not open"; "closed" only when they're clearly under "Not open".
//   Anything else is "unknown", and the page shows no banner.
// - Writes only when the status or the County's "Updated" date changes, or once a
//   day while open (so the page can hide a banner the check stopped confirming).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SOURCE = 'https://www.multco.us/care-when-its-cold';
const FILE = new URL('../alerts.json', import.meta.url);

const res = await fetch(SOURCE, { headers: { 'User-Agent': 'pdx-resources weather-shelter check (github.com/healingnationsfoundation/pdx-resources)' } });
if (!res.ok) throw new Error(`County page returned HTTP ${res.status}`);
const text = (await res.text())
  .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/\s+/g, ' ');

const updated = (text.match(/Updated:\s*([A-Z][a-z]+day,\s*[A-Z][a-z]+\.?\s*\d{1,2},\s*\d{4})/) || [])[1] || null;
const openPart = (text.match(/Open (?:today\/)?tonight:(.{0,700}?)(?:Not open tonight:|Anyone in Multnomah County|$)/i) || [])[1] || '';
const notOpenPart = (text.match(/Not open tonight:(.{0,300})/i) || [])[1] || '';
const SWS = /severe weather shelter|warming shelter|warming center/i;
let status = 'unknown';
if (SWS.test(notOpenPart.slice(0, 120))) status = 'closed';
else if (SWS.test(openPart) && !/Not open tonight:[^.]{0,120}(severe weather shelter|warming)/i.test(text)) status = 'open';

const now = new Date();
const portlandDay = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(d);
const old = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
const prev = old.severeWeather || {};
const next = { status, countyUpdated: updated, checked: now.toISOString(), source: SOURCE };
const changed = prev.status !== status || prev.countyUpdated !== updated
  || (status === 'open' && (!prev.checked || portlandDay(new Date(prev.checked)) !== portlandDay(now)));
console.log(`Severe weather shelters: ${status} (County updated: ${updated || 'not found'})`);
// National Weather Service forecast for Portland (api.weather.gov, free, no key). The page shows
// tonight's low and today's high, with a cold or heat warning. The phone never calls NWS: only this
// script does, and the page reads alerts.json. A failure here never blocks the shelter check.
// Saved when NWS issues a new forecast or the first period changes (a few times a day).
let forecast = old.forecast || null, fChanged = false;
try {
  const UA = { headers: { 'User-Agent': 'pdx-resources forecast check (github.com/healingnationsfoundation/pdx-resources)', Accept: 'application/geo+json' } };
  const pt = await (await fetch('https://api.weather.gov/points/45.5152,-122.6784', UA)).json();
  const fc = await (await fetch(pt.properties.forecast, UA)).json();
  const periods = fc.properties.periods.slice(0, 4).map(p => ({
    name: p.name, start: p.startTime, end: p.endTime, isDaytime: p.isDaytime,
    temp: p.temperature, unit: p.temperatureUnit, short: p.shortForecast }));
  const f = { updated: fc.properties.updateTime, periods, source: 'https://forecast.weather.gov/MapClick.php?lat=45.5152&lon=-122.6784' };
  fChanged = !forecast || forecast.updated !== f.updated || (forecast.periods && forecast.periods[0].name) !== f.periods[0].name;
  if (fChanged) forecast = f;
  console.log(`Forecast: ${periods.slice(0, 2).map(p => `${p.name} ${p.temp}${p.unit} ${p.short}`).join('; ')}`);
} catch (e) { console.log('Forecast not updated: ' + e.message); }

if (changed || fChanged) {
  writeFileSync(FILE, JSON.stringify({ severeWeather: changed ? next : prev, ...(forecast ? { forecast } : {}) }, null, 2) + '\n');
  console.log('alerts.json updated.');
} else console.log('No change.');

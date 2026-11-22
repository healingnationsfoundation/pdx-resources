// Refreshes the Multnomah County Mobile Clinic's dated stops in resources.json
// from the county's own calendar. Run by .github/workflows/refresh-mobile-clinic.yml
// every week; you can also run it by hand: node scripts/refresh-mobile-clinic.mjs
//
// Safety rules:
// - The only source is the county's calendar page. Nothing is guessed.
// - If the page can't be read, or any row doesn't parse, it stops without
//   changing anything. Old stops still drop off the card on their own.
// - Stops at places on EXCLUDE are left out (the guide never lists camps).
// - Everything is stored as plain text; the page escapes it when showing it.

import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'https://healthcenter.multco.us/events-and-stories/mobile-clinic-calendar?location=All&service=All';
const NAME = 'Multnomah County Mobile Clinic';
const FILE = new URL('../resources.json', import.meta.url);
const WEEKS_AHEAD = 6;
const EXCLUDE = [/dignity village/i];

const decode = s => s
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/\s+/g, ' ').trim();

function to24(t) {
  const m = /^(\d{1,2}):(\d{2})\s*([ap])\.?m\.?$/i.exec(t.trim());
  if (!m) throw new Error(`Unreadable time "${t}"`);
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === 'p') h += 12;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

function field(row, name) {
  const m = new RegExp(`views-field-field-${name}"[^>]*>([\\s\\S]*?)</div></div>`).exec(row)
    || new RegExp(`views-field-field-${name}"[^>]*>([\\s\\S]*?)</div>`).exec(row);
  return m ? decode(m[1]).replace(/^Services provided\s*/, '') : '';
}

function parse(html) {
  const rows = html.split('<div class="view-row">').slice(1);
  if (!rows.length) throw new Error('No calendar rows found; the page layout may have changed.');
  return rows.map(row => {
    const date = /<time datetime="(\d{4}-\d{2}-\d{2})T/.exec(row)?.[1];
    const span = /<\/time>\s*<br\s*\/?>\s*([^<]+)<\/h3>/.exec(row)?.[1];
    const place = decode(/views-field-field-clinic"[\s\S]*?<strong[^>]*>([\s\S]*?)<\/strong>/.exec(row)?.[1] || '');
    const addr = field(row, 'address');
    const services = field(row, 'clinic-services');
    const note = field(row, 'note');
    if (!date || !span || !place || !addr) throw new Error(`Row didn't parse: ${decode(row).slice(0, 160)}`);
    const [open, close] = span.split(/\s*[-–]\s*/);
    if (!close) throw new Error(`Unreadable time range "${span}"`);
    const time = `${to24(open)}-${to24(close)}`;
    const dental = /dental/i.test(services), medical = /medical/i.test(services);
    const extra = [
      medical && dental ? 'dental cleanings too' : !medical && dental ? 'dental cleanings only' : '',
      note,
    ].filter(Boolean).join('; ');
    return { date, time, place: extra ? `${place} (${extra})` : place, addr };
  });
}

function localToday() {
  // Portland date, whatever time zone the runner uses.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
}

const res = await fetch(SOURCE, { headers: { 'User-Agent': 'pdx-resources stop refresh (github.com/healingnationsfoundation/pdx-resources)' } });
if (!res.ok) throw new Error(`Calendar returned HTTP ${res.status}`);
const all = parse(await res.text());

const today = localToday();
const until = new Date(`${today}T12:00:00Z`);
until.setUTCDate(until.getUTCDate() + WEEKS_AHEAD * 7);
const last = until.toISOString().slice(0, 10);

const stops = all
  .filter(s => s.date >= today && s.date <= last)
  .filter(s => !EXCLUDE.some(re => re.test(s.place)))
  .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

const data = JSON.parse(readFileSync(FILE, 'utf8'));
const r = data.resources.find(x => x.name === NAME);
if (!r) throw new Error(`No listing named ${NAME}`);

const before = JSON.stringify(r.stops || []);
if (JSON.stringify(stops) === before) {
  console.log(`No change: ${stops.length} stops through ${last}.`);
} else {
  r.stops = stops;
  writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(`Updated: ${stops.length} stops through ${last}.`);
  for (const s of stops) console.log(`  ${s.date} ${s.time}  ${s.place}`);
}

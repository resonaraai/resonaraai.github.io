import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const required = [
  'docs/index.html',
  'docs/styles.css',
  'docs/app.js',
  'docs/sw.js',
  'docs/manifest.webmanifest',
  'docs/assets/icon.svg',
  'docs/assets/icon-192.png',
  'docs/assets/icon-512.png',
  'docs/assets/resonara-mark.svg',
  'docs/assets/resonara-logo.png',
  'docs/assets/resonara-og.png',
  'docs/assets/ASSET_SOURCE.md',
  'docs/.nojekyll',
  '.github/workflows/pages.yml'
];

for (const file of required) {
  if (!existsSync(resolve(root, file))) fail(`Missing ${file}`);
}

const html = readFile('docs/index.html');
const sw = readFile('docs/sw.js');
const manifest = JSON.parse(readFile('docs/manifest.webmanifest'));
const app = readFile('docs/app.js');

assert(html.includes('<title>Resonara</title>'), 'HTML title must be Resonara');
assert(html.includes('manifest.webmanifest'), 'HTML must reference manifest');
assert(html.includes('app.js'), 'HTML must reference app.js');
assert(html.includes('resonara-logo.png'), 'HTML must use official Resonara image');
assert(manifest.name === 'Resonara', 'Manifest name must be Resonara');
assert(manifest.display === 'standalone', 'Manifest display must be standalone');
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest needs icons');

for (const asset of ['./index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/resonara-mark.svg', './assets/resonara-logo.png', './assets/resonara-og.png']) {
  assert(sw.includes(asset), `Service worker cache list missing ${asset}`);
}

for (const endpoint of ['/api/transcribe', '/api/speak']) {
  assert(app.includes(endpoint), `PWA-first endpoint missing: ${endpoint}`);
}
assert(app.includes('legacy-server-turn'), 'Legacy mode option missing');
assert(app.includes('crisisPatterns'), 'Browser safety path missing');
assert(!app.includes('OPENAI_API_KEY'), 'Client must not contain API keys');

const selectedIds = [...app.matchAll(/querySelector\('#([^']+)'\)/g)].map((match) => match[1]);
const missingIds = selectedIds.filter((id) => !html.includes(`id="${id}"`));
assert(missingIds.length === 0, `HTML missing IDs used by app.js: ${missingIds.join(', ')}`);


console.log('PWA validation passed.');

function readFile(file) {
  return readFileSync(resolve(root, file), 'utf8');
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

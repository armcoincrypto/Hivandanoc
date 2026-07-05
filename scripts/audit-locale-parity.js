#!/usr/bin/env node
/**
 * Strict live locale parity audit — visible body text must match selected language.
 * Usage: node scripts/audit-locale-parity.js [BASE_URL]
 */
const fs = require('fs');
const https = require('https');
const http = require('http');
const { getLaunchedServiceSlugs } = require('../server/services/service-pages');
const { getLaunchedConditionSlugs } = require('../server/services/condition-pages');
const { getLaunchedKnowledgeSlugs } = require('../server/services/knowledge-pages');
const { getPublishedDoctorSlugs } = require('../server/services/doctor-pages');
const { buildPublicContent } = require('../server/db/helpers');
const { AUDIT_NAME_ALLOWLIST } = require('../server/services/locale-content');

const BASE = (process.argv[2] || process.env.LOCALE_AUDIT_BASE || 'https://healthyspinedoc.com').replace(
  /\/$/,
  ''
);
// Match production CMS when discovering doctor slugs locally
if (!process.env.CMS_DATA_DIR && fs.existsSync('/var/lib/hivandanoc-cms/cms.db')) {
  process.env.CMS_DATA_DIR = '/var/lib/hivandanoc-cms';
}
const LANGS = ['hy', 'ru', 'en'];

const ARMENIAN_RE = /[\u0531-\u0587]{2,}/g;
const CYRILLIC_RE = /[\u0400-\u04FF]{2,}/g;
const OLD_GMAIL_RE = /gmail\.com/i;

const ALLOWLIST_FRAGMENTS = [
  ...AUDIT_NAME_ALLOWLIST,
  'HY',
  'RU',
  'EN',
  'Healthy Spine',
  'Здоровый позвоночник',
  'Առողջ ողնաշար'
];

const STATIC_ROUTES = [
  '/',
  '/services',
  '/conditions',
  '/knowledge',
  '/find-a-doctor',
  '/locations',
  '/about',
  '/contact',
  '/consultation-process',
  '/spine-specialist-yerevan',
  '/editorial-policy'
];

function buildRoutes() {
  const routes = [...STATIC_ROUTES];
  for (const slug of getLaunchedServiceSlugs()) routes.push(`/services/${slug}`);
  for (const slug of getLaunchedConditionSlugs()) routes.push(`/conditions/${slug}`);
  for (const slug of getLaunchedKnowledgeSlugs()) routes.push(`/knowledge/${slug}`);
  for (const slug of getPublishedDoctorSlugs(buildPublicContent('hy'))) routes.push(`/doctors/${slug}`);
  return routes;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.request(url, { headers: { 'User-Agent': 'HealthySpine-Locale-Audit/1.0' } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
    req.end();
  });
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAllowlisted(sample) {
  const s = String(sample || '').trim();
  if (!s) return true;
  if (/^(HY|RU|EN)$/.test(s)) return true;
  return ALLOWLIST_FRAGMENTS.some((frag) => s.includes(frag));
}

function findLeaks(text, re, lang) {
  const hits = [];
  const matches = text.match(re) || [];
  for (const m of matches) {
    if (isAllowlisted(m)) continue;
    hits.push(m.slice(0, 120));
  }
  return [...new Set(hits)];
}

function langQuery(route, lang) {
  if (lang === 'hy') return route;
  const sep = route.includes('?') ? '&' : '?';
  return `${route}${sep}lang=${lang}`;
}

async function auditRoute(route, lang) {
  const url = `${BASE}${langQuery(route, lang)}`;
  const issues = [];
  let text = '';

  try {
    const { status, body } = await fetchUrl(url);
    if (status !== 200) {
      issues.push({ type: 'http', sample: `HTTP ${status}` });
      return { route, lang, url, issues, text: '' };
    }
    text = stripHtml(body);

    if (OLD_GMAIL_RE.test(body) || OLD_GMAIL_RE.test(text)) {
      issues.push({ type: 'old_gmail', sample: 'gmail.com found' });
    }

    if (lang === 'en') {
      const arm = findLeaks(text, ARMENIAN_RE, lang);
      const cyr = findLeaks(text, CYRILLIC_RE, lang);
      arm.forEach((sample) => issues.push({ type: 'en_armenian', sample }));
      cyr.forEach((sample) => issues.push({ type: 'en_cyrillic', sample }));
    } else if (lang === 'ru') {
      const arm = findLeaks(text, ARMENIAN_RE, lang);
      arm.forEach((sample) => issues.push({ type: 'ru_armenian', sample }));
    } else if (lang === 'hy') {
      if (!ARMENIAN_RE.test(text)) {
        issues.push({ type: 'hy_missing_armenian', sample: 'No Armenian script in visible text' });
      }
    }
  } catch (err) {
    issues.push({ type: 'fetch_error', sample: String(err.message || err) });
  }

  return { route, lang, url, issues, text };
}

async function main() {
  const routes = buildRoutes();
  const results = [];
  let enLeak = 0;
  let ruLeak = 0;
  let hyFail = 0;
  let oldGmail = 0;

  console.log(`==> Locale parity audit: ${BASE}`);
  console.log(`    Routes: ${routes.length} × ${LANGS.length} = ${routes.length * LANGS.length} fetches\n`);

  for (const route of routes) {
    for (const lang of LANGS) {
      const row = await auditRoute(route, lang);
      results.push(row);
      for (const issue of row.issues) {
        if (issue.type === 'en_armenian' || issue.type === 'en_cyrillic') enLeak += 1;
        if (issue.type === 'ru_armenian') ruLeak += 1;
        if (issue.type === 'hy_missing_armenian') hyFail += 1;
        if (issue.type === 'old_gmail') oldGmail += 1;
        console.log(`FAIL [${lang}] ${route} (${issue.type}): ${issue.sample}`);
      }
    }
  }

  const totalChecks = routes.length * LANGS.length;
  const failedRoutes = new Set(results.filter((r) => r.issues.length).map((r) => `${r.lang}:${r.route}`));

  console.log('\n==> Summary');
  console.log(`Routes crawled: ${routes.length}`);
  console.log(`Locale fetches: ${totalChecks}`);
  console.log(`Failed route/lang pairs: ${failedRoutes.size}`);
  console.log(`EN Armenian/Cyrillic leakage hits: ${enLeak}`);
  console.log(`RU Armenian leakage hits: ${ruLeak}`);
  console.log(`HY missing-Armenian hits: ${hyFail}`);
  console.log(`Old Gmail hits: ${oldGmail}`);

  const pass =
    enLeak === 0 && ruLeak === 0 && oldGmail === 0 && hyFail === 0 && failedRoutes.size === 0;

  if (pass) {
    console.log('\nLOCALE_PARITY_PASS');
    process.exit(0);
  }

  console.log('\nLOCALE_PARITY_FAIL');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});

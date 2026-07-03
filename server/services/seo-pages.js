const fs = require('fs');
const path = require('path');
const { buildPublicContent } = require('../db/helpers');
const { getLaunchedServiceSlugs } = require('./service-pages');
const { clinicNode, localBusinessNode, clinicName } = require('./entity-schema');

const SITE_ROOT = path.join(__dirname, '../..');
const BASE = (process.env.PUBLIC_SITE_URL || 'https://healthyspinedoc.com').replace(/\/$/, '');

let hyDictCache = null;

function loadLangDict(lang = 'hy') {
  if (lang === 'hy' && hyDictCache) return hyDictCache;
  try {
    const dict = JSON.parse(fs.readFileSync(path.join(SITE_ROOT, `lang/${lang}.json`), 'utf8'));
    if (lang === 'hy') hyDictCache = dict;
    return dict;
  } catch {
    return {};
  }
}

function dictPath(dict, key) {
  return key.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), dict);
}

function homeCrawlBlock(data) {
  const h = data?.hospital || {};
  const dict = loadLangDict('hy');
  const conditions = (dict.content?.conditions || data?.conditions || []).slice(0, 8);
  const conditionItems = conditions.length
    ? conditions.map((c) => `<li>${esc(typeof c === 'string' ? c : c.name || c)}</li>`).join('')
    : '';
  const nav = `
    <nav class="seo-crawl-nav" aria-label="Կայքի բաժիններ">
      <a href="/services">Ծառայություններ</a> ·
      <a href="/conditions">Ախտորոշումներ</a> ·
      <a href="/knowledge">Գիտելիքների կենտրոն</a> ·
      <a href="/patient-care">Բուժում և ծառայություններ</a> ·
      <a href="/find-a-doctor">Գտնել բժիշկ</a> ·
      <a href="/locations">Հասցեներ</a> ·
      <a href="/contact">Կապ</a> ·
      <a href="/about">Մեր մասին</a>
    </nav>`;
  const conditionLinks = `<p><a href="/conditions/back-pain-treatment">Մեջքի ցավ</a> · <a href="/conditions/neck-pain-treatment">Պարանոցի ցավ</a> · <a href="/conditions">Բոլոր ախտորոշումները</a></p>`;
  return `<section class="seo-crawl-content" id="seo-crawl-content">
    <h2>${esc(h.name || 'Առողջ ողնաշար')}</h2>
    <p>${esc(h.about || h.mission || '«Առողջ ողնաշար» — պոզանոցի և հոդերի վերականգնողական կենտրոն Երևանում։')}</p>
    ${h.mission ? `<p>${esc(h.mission)}</p>` : ''}
    ${conditionItems ? `<h3>Բուժվող վիճակներ</h3><ul>${conditionItems}</ul>` : ''}
    ${conditionLinks}
    <p><strong>Հեռախոս.</strong> ${esc(h.phone || '')} · <strong>Հասցե.</strong> ${esc(h.address || 'Երևան, Հայաստան')}</p>
    ${nav}
  </section>`;
}

function resolveRouteMeta(route, data) {
  if (typeof route.resolveMeta === 'function') return route.resolveMeta(data);
  return {
    title: route.title,
    description: route.description,
    h1: route.h1,
    tagline: route.tagline
  };
}

/** Clean URL → source HTML file + SEO profile */
const ROUTES = {
  '/': {
    file: 'index.html',
    pageKey: 'home',
    resolveMeta: (data) => {
      const h = data?.hospital || {};
      const name = h.name || 'Առողջ ողնաշար';
      return {
        title: `${name} — Վերականգնողական կենտրոն`,
        description:
          h.about ||
          '«Առողջ ողնաշար» — պոզանոցի և հոդերի վերականգնողական կենտրոն Երևանում։',
        h1: name,
        tagline:
          h.heroTagline ||
          h.tagline ||
          'Պոզանոցի, հոդերի և շարժական համակարգի հիվանդությունների բուժում'
      };
    },
    bodyHtml: (data) => homeCrawlBlock(data),
    jsonLd: (data, url) => [clinicNode(data), breadcrumb(url, 'Գլխավոր')]
  },
  '/find-a-doctor': {
    file: 'doctors.html',
    pageKey: 'doctors',
    title: 'Գտնել բժիշկ — Առողջ ողնաշար',
    description:
      'Գտեք պոզանոցի, հոդերի և վերականգնողական մասնագետներ «Առողջ ողնաշար» կենտրոնում։ Որոնեք ըստ մասնագիտության և գրանցվեք առցանց։',
    h1: 'Գտնել բժիշկ',
    tagline: 'Մասնագետներ պոզանոցի, հոդերի և շարժական համակարգի վերականգնման ոլորտում։',
    bodyHtml: (data) => {
      const items = (data.doctors || [])
        .slice(0, 24)
        .map(
          (d) =>
            `<li><strong>${esc(d.name)}</strong> — ${esc(d.role || '')}${d.location ? ` (${esc(d.location)})` : ''}</li>`
        )
        .join('');
      return `<section class="seo-crawl-content" id="seo-crawl-content"><h2>Մեր բժիշկները</h2><ul>${items}</ul></section>`;
    },
    jsonLd: (data, url) => [
      clinicNode(data),
      breadcrumb(url, 'Գտնել բժիշկ'),
      {
        '@type': 'WebPage',
        name: 'Գտնել բժիշկ',
        url,
        description:
          'Գտեք պոզանոցի, հոդերի և վերականգնողական մասնագետներ «Առողջ ողնաշար» կենտրոնում։',
        isPartOf: { '@type': 'WebSite', name: clinicName(data), url: `${BASE}/` }
      }
    ]
  },
  '/patient-care': {
    file: 'departments.html',
    pageKey: 'departments',
    title: 'Բուժում և ծառայություններ — Առողջ ողնաշար',
    description:
      'Պոզանոցի, հոդերի և շարժական համակարգի վերականգնողական ծառայություններ «Առողջ ողնաշար» կենտրոնում — ֆիզիոթերապիա, ախտորոշում և վերականգնման ծրագրեր։',
    h1: 'Բուժում և ծառայություններ',
    tagline: 'Պոզանոցի և հոդերի համապարփակ վերականգնողական և բուժման ծրագրեր։',
    bodyHtml: (data) => {
      const launched = getLaunchedServiceSlugs();
      const items = (data.departments || [])
        .slice(0, 30)
        .map((s) => {
          const link = launched.includes(s.id)
            ? `<a href="/services/${esc(s.id)}">${esc(s.name)}</a>`
            : `<strong>${esc(s.name)}</strong>`;
          return `<li>${link}${s.description ? ` — ${esc(s.description)}` : ''}</li>`;
        })
        .join('');
      return `<section class="seo-crawl-content" id="seo-crawl-content">
        <p><a href="/services">Ծառայությունների հիմնական էջ</a> — պոզանոցի և հոդերի վերականգնողական ծառայություններ Երևանում։</p>
        <h2>Ծառայություններ և ծրագրեր</h2><ul>${items}</ul></section>`;
    },
    jsonLd: (data, url) => {
      const graphs = [clinicNode(data), breadcrumb(url, 'Բուժում և ծառայություններ')];
      (data.departments || []).slice(0, 30).forEach((s) => {
        graphs.push({
          '@type': 'MedicalTherapy',
          name: s.name,
          description: s.description || '',
          provider: { '@type': 'MedicalClinic', name: clinicName(data) }
        });
      });
      return graphs;
    }
  },
  '/about': {
    file: 'about.html',
    pageKey: 'about',
    title: 'Մեր մասին — Առողջ ողնաշար',
    description:
      '«Առողջ ողնաշար» վերականգնողական կենտրոնի մասին — առաքելություն, թիմ, արժեքներ և ապացուցված պոզանոցի և հոդերի խնամք։',
    h1: 'Մեր մասին',
    tagline: 'Կենտրոնի պատմություն, առաքելություն և արժեքներ։',
    bodyHtml: (data) => {
      const h = data.hospital || {};
      return `<section class="seo-crawl-content" id="seo-crawl-content"><p>${esc(h.about || h.mission || '«Առողջ ողնաշար» վերականգնողական կենտրոն Երևանում։')}</p></section>`;
    },
    jsonLd: (data, url) => [clinicNode(data), breadcrumb(url, 'Մեր մասին')]
  },
  '/contact': {
    file: 'contacts.html',
    pageKey: 'contacts',
    title: 'Կապ — Առողջ ողնաշար',
    description:
      'Կապ «Առողջ ողնաշար» կենտրոնի հետ — հեռախոս, էլ. փոստ, աշխատանքային ժամեր և առցանց գրանցում Երևանում։',
    h1: 'Կապ',
    tagline: 'Զանգահարեք, գրեք կամ ուղարկեք հաղորդագրություն գրանցման համար։',
    bodyHtml: (data) => contactBlock(data, 'contact'),
    jsonLd: (data, url) => [localBusinessNode(data, url), breadcrumb(url, 'Կապ')]
  },
  '/locations': {
    file: 'contacts.html',
    pageKey: 'locations',
    title: 'Հասցեներ — Առողջ ողնաշար',
    description:
      '«Առողջ ողնաշար» կլինիկայի հասցեն Երևանում — հասցե, ուղղություններ, հեռախոս և աշխատանքային ժամեր։',
    h1: 'Մեր հասցեն',
    tagline: '«Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում։',
    bodyHtml: (data) => contactBlock(data, 'locations'),
    jsonLd: (data, url) => [localBusinessNode(data, url), breadcrumb(url, 'Հասցեներ')]
  }
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function breadcrumb(url, name) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Գլխավոր', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name, item: url }
    ]
  };
}

function contactBlock(data, variant) {
  const h = data?.hospital || {};
  const map =
    variant === 'locations'
      ? `<p><strong>Հասցե.</strong> ${esc(h.address || 'Երևան, Հայաստան')}</p><p>Քարտեզը և ուղղությունները հասանելի են այս էջում։</p>`
      : '';
  return `<section class="seo-crawl-content" id="seo-crawl-content">
    <p><strong>Հեռախոս.</strong> ${esc(h.phone || '')}</p>
    <p><strong>Էլ. փոստ.</strong> ${esc(h.email || '')}</p>
    <p><strong>Աշխատանքային ժամեր.</strong> ${esc(h.hours || '')}</p>
    ${map}
  </section>`;
}

function fillI18nPlaceholders(html, lang = 'hy') {
  const dict = loadLangDict(lang);
  let out = html.replace(
    /(<([a-z][a-z0-9]*)[^>]*\sdata-i18n="([^"]+)"[^>]*>)—(<\/\2>)/gi,
    (_match, open, _tag, key, close) => {
      const val = dictPath(dict, key);
      return val ? `${open}${esc(val)}${close}` : `${open}${close}`;
    }
  );
  out = out.replace(/(<a href="\/contact" class="hss-link">)—(<\/a>)/g, '$1Կապ$2');
  return out;
}

function injectHomeHero(html, meta) {
  let out = html;
  out = out.replace(/(<h1[^>]*id="hero-title"[^>]*>)[^<]*(<\/h1>)/, `$1${esc(meta.h1)}$2`);
  out = out.replace(
    /(<p class="hss-hero__tagline"[^>]*id="hero-subtitle"[^>]*>)[^<]*(<\/p>)/,
    `$1${esc(meta.tagline)}$2`
  );
  return out;
}

function stripHomeDynamicPlaceholders(html) {
  const ids = [
    'home-feature-title',
    'home-feature-desc',
    'back-in-game-title',
    'back-in-game-link',
    'expertise-title',
    'expertise-text'
  ];
  let out = html;
  for (const id of ids) {
    const re = new RegExp(`(<[^>]+id="${id}"[^>]*>)—(<\/[^>]+>)`, 'g');
    out = out.replace(re, '$1$2');
  }
  return out;
}

function headTags(meta, canonicalPath) {
  const url = `${BASE}${canonicalPath}`;
  const image = `${BASE}/images/brand/logo.png`;
  return `
    <link rel="icon" href="${BASE}/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="${BASE}/favicon.ico" type="image/x-icon">
    <meta name="description" content="${esc(meta.description)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Healthy Spine">
    <meta property="og:title" content="${esc(meta.title)}">
    <meta property="og:description" content="${esc(meta.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(meta.title)}">
    <meta name="twitter:description" content="${esc(meta.description)}">
    <meta name="twitter:image" content="${image}">`;
}

function injectJsonLdScript(graphs) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graphs })}</script>`;
}

function replaceFirstHeroText(html, meta) {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  out = out.replace(/(<h1[^>]*data-i18n="pages\.[^"]+"[^>]*>)[^<]*(<\/h1>)/, `$1${esc(meta.h1)}$2`);
  out = out.replace(
    /(<p class="hss-hero__tagline"[^>]*data-i18n="pages\.[^"]+"[^>]*>)[^<]*(<\/p>)/,
    `$1${esc(meta.tagline)}$2`
  );
  out = out.replace(/(<h1 class="hss-about-section__title"[^>]*id="about-article-title"[^>]*>)[^<]*(<\/h1>)/, `$1${esc(meta.h1)}$2`);
  out = out.replace(/(<p class="hss-about-section__lead"[^>]*id="about-text"[^>]*>)[^<]*(<\/p>)/, `$1${esc(meta.tagline)}$2`);
  return out;
}

function injectContactFields(html, data) {
  const h = data?.hospital || {};
  let out = html;
  out = out.replace(/(<p id="contact-phone"[^>]*>)[^<]*(<\/p>)/, `$1${esc(h.phone || '')}$2`);
  out = out.replace(/(<p id="contact-email"[^>]*>)[^<]*(<\/p>)/, `$1${esc(h.email || '')}$2`);
  out = out.replace(/(<p id="contact-address"[^>]*>)[^<]*(<\/p>)/, `$1${esc(h.address || '')}$2`);
  out = out.replace(/(<p id="contact-hours"[^>]*>)[^<]*(<\/p>)/, `$1${esc(h.hours || '')}$2`);
  return out;
}

function serveSeoPage(routePath) {
  const route = ROUTES[routePath];
  if (!route) return null;

  const filePath = path.join(SITE_ROOT, route.file);
  if (!fs.existsSync(filePath)) return null;

  const data = buildPublicContent('hy');
  let html = fs.readFileSync(filePath, 'utf8');
  const url = `${BASE}${routePath}`;

  html = html.replace(/<meta name="description"[^>]*>/gi, '');
  html = html.replace(/<meta name="robots"[^>]*>/gi, '');
  html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<link rel="alternate"[^>]*>/gi, '');
  html = html.replace(/<meta property="og:[^"]+"[^>]*>/gi, '');
  html = html.replace(/<meta name="twitter:[^"]+"[^>]*>/gi, '');
  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');

  const meta = resolveRouteMeta(route, data);
  const tags = headTags(meta, routePath);
  html = html.replace('</head>', `${tags}\n${injectJsonLdScript(route.jsonLd(data, url))}\n</head>`);

  html = replaceFirstHeroText(html, meta);

  if (route.pageKey === 'home') {
    html = injectHomeHero(html, meta);
    html = fillI18nPlaceholders(html, 'hy');
    html = stripHomeDynamicPlaceholders(html);
    const phoneDigits = String(data?.hospital?.phone || '').replace(/\D/g, '');
    if (phoneDigits) {
      html = html.replace(/tel:\+37410000000/g, `tel:+${phoneDigits}`);
    }
  }

  if (route.pageKey === 'contacts' || route.pageKey === 'locations') {
    html = injectContactFields(html, data);
  }

  const body = route.bodyHtml(data);
  if (body) {
    if (html.includes('id="doctors-grid"')) {
      html = html.replace(/(<div class="hss-doctor-list" id="doctors-grid">)\s*(<\/div>)/, `$1${body}$2`);
    } else if (html.includes('id="departments-grid"')) {
      html = html.replace(/(<div id="departments-grid">)\s*(<\/div>)/, `$1${body}$2`);
    } else if (html.includes('id="main-content"')) {
      html = html.replace(/(<main[^>]*id="main-content"[^>]*>)/, `$1${body}`);
    } else {
      html = html.replace('</body>', `${body}\n</body>`);
    }
  }

  html = html.replace(
    '<body',
    `<body data-seo-canonical="${esc(routePath)}" data-seo-page="${esc(route.pageKey)}"`
  );

  return html;
}

module.exports = { ROUTES, serveSeoPage, BASE };

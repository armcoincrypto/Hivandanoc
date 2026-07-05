/**
 * SEO locale hints — canonical URLs stay Armenian; UI language is user-controlled (HY/RU/EN).
 * Navigation helpers keep ?lang=ru|en on internal links when that locale is active.
 */
(function (root) {
  const CANONICAL_PREFIXES = [
    '/patient-care',
    '/services',
    '/conditions',
    '/knowledge',
    '/about',
    '/contact',
    '/locations',
    '/find-a-doctor'
  ];

  const SUPPORTED_LANGS = ['hy', 'ru', 'en'];
  const STORAGE_KEY = 'gkb_lang';

  function normalizePath(pathname) {
    const p = (pathname || '/').replace(/\/$/, '') || '/';
    return p;
  }

  function isCanonicalSeoPath(pathname) {
    const p = normalizePath(pathname);
    if (p === '/') return true;
    return CANONICAL_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
  }

  /** Used for SEO/hreflang only — does not block language switcher. */
  function isCanonicalSeoPage() {
    if (typeof location !== 'undefined') return isCanonicalSeoPath(location.pathname);
    return false;
  }

  function normalizeLang(lang) {
    return SUPPORTED_LANGS.includes(lang) ? lang : 'hy';
  }

  /** Active UI locale: URL param wins, then boot/i18n, then localStorage. */
  function getActiveLang() {
    if (typeof location !== 'undefined') {
      try {
        const qp = new URLSearchParams(location.search).get('lang');
        if (qp && SUPPORTED_LANGS.includes(qp)) return qp;
      } catch {
        /* ignore */
      }
    }
    if (typeof root.__I18N_BOOT_LANG__ === 'string') {
      return normalizeLang(root.__I18N_BOOT_LANG__);
    }
    if (typeof root.I18n !== 'undefined' && typeof root.I18n.getLang === 'function') {
      return normalizeLang(root.I18n.getLang());
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch {
      /* private mode */
    }
    return 'hy';
  }

  /** Append ?lang=ru|en to internal paths; HY uses clean URLs. */
  function withLang(path, lang) {
    const active = normalizeLang(lang != null ? lang : getActiveLang());
    if (!path || path === '#' || active === 'hy') return path || '/';
    if (/^(mailto:|tel:|javascript:|https?:)/i.test(path)) return path;
    if (!path.startsWith('/')) return path;

    const hashIdx = path.indexOf('#');
    const hash = hashIdx >= 0 ? path.slice(hashIdx) : '';
    const base = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
    const qIdx = base.indexOf('?');
    const pathname = qIdx >= 0 ? base.slice(0, qIdx) : base;
    const params = new URLSearchParams(qIdx >= 0 ? base.slice(qIdx + 1) : '');
    params.set('lang', active);
    const qs = params.toString();
    return `${pathname}?${qs}${hash}`;
  }

  /** Rewrite root-relative href attributes for RU/EN browsing. */
  function patchDocumentLinks(lang) {
    if (typeof document === 'undefined') return;
    const active = normalizeLang(lang != null ? lang : getActiveLang());
    if (active === 'hy') return;

    document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('//')) return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
      anchor.setAttribute('href', withLang(href, active));
    });
  }

  function langUrl(targetLang) {
    if (typeof location === 'undefined') return '/';
    const lang = normalizeLang(targetLang);
    const url = new URL(location.href);
    if (lang === 'hy') url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    return url.pathname + url.search + url.hash;
  }

  root.LocalePolicy = {
    isCanonicalSeoPath,
    isCanonicalSeoPage,
    normalizePath,
    getActiveLang,
    withLang,
    patchDocumentLinks,
    langUrl,
    SUPPORTED_LANGS
  };
})(typeof window !== 'undefined' ? window : global);

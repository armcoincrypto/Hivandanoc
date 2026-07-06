/**
 * SEO locale hints — canonical URLs stay Armenian; UI language is user-controlled (HY/RU/EN).
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

  /** Active UI lang from URL ?lang= (HY uses clean URLs). */
  function getActiveLang() {
    if (typeof location === 'undefined') return 'hy';
    const lang = new URLSearchParams(location.search).get('lang');
    if (lang === 'en' || lang === 'ru') return lang;
    return 'hy';
  }

  function withLang(path, lang) {
    if (!lang || lang === 'hy') return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}lang=${encodeURIComponent(lang)}`;
  }

  /** Build same-page URL for language switcher navigation. */
  function langUrl(lang) {
    if (typeof location === 'undefined') return '/';
    const url = new URL(location.href);
    if (!lang || lang === 'hy') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    return url.pathname + url.search + url.hash;
  }

  /** Patch internal anchor hrefs under root (nav/footer/shell). Skips assets. */
  function patchDocumentLinks(root, lang) {
    lang = lang || getActiveLang();
    const scope = root && root.querySelectorAll ? root : typeof document !== 'undefined' ? document : null;
    if (!scope) return;
    scope.querySelectorAll('a[href^="/"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      const hashIdx = href.indexOf('#');
      const hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
      const path = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
      a.setAttribute('href', withLang(path, lang) + hash);
    });
  }

  root.LocalePolicy = {
    isCanonicalSeoPath,
    isCanonicalSeoPage,
    normalizePath,
    getActiveLang,
    withLang,
    langUrl,
    patchDocumentLinks
  };
})(typeof window !== 'undefined' ? window : global);

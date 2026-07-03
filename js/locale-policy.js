/**
 * P0T.4 — Shared locale policy for public SEO routes (Armenian-only).
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

  function isCanonicalSeoPage() {
    if (typeof document !== 'undefined' && document.body?.hasAttribute('data-seo-canonical')) {
      return true;
    }
    if (typeof location !== 'undefined') return isCanonicalSeoPath(location.pathname);
    return false;
  }

  root.LocalePolicy = { isCanonicalSeoPath, isCanonicalSeoPage, normalizePath };
})(typeof window !== 'undefined' ? window : global);

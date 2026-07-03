/**
 * P0T.4 — Strip ?lang= query parameter via 301 to canonical URL.
 * Canonical public pages are Armenian-only; lang params caused mixed-language output.
 */
const LANG_CODES = new Set(['hy', 'ru', 'en']);

function stripLangQuery(req) {
  const lang = req.query.lang;
  if (!lang || !LANG_CODES.has(String(lang).toLowerCase())) return null;

  const q = { ...req.query };
  delete q.lang;
  const keys = Object.keys(q);
  if (!keys.length) return req.path || '/';

  const params = new URLSearchParams();
  for (const key of keys) {
    const val = q[key];
    if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
    else if (val != null) params.append(key, String(val));
  }
  const qs = params.toString();
  return qs ? `${req.path}?${qs}` : req.path || '/';
}

function localeRedirectMiddleware(req, res, next) {
  const target = stripLangQuery(req);
  if (target == null) return next();
  return res.redirect(301, target);
}

module.exports = { localeRedirectMiddleware, stripLangQuery };

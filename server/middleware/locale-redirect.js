/**
 * Canonicalize ?lang= query — duplicate or invalid values redirect to a single valid param.
 */
const { parseLangParam } = require('../services/i18n-ssr');

const LANG_CODES = new Set(['hy', 'ru', 'en']);

function buildPathWithoutLang(req, resolvedLang) {
  const q = { ...req.query };
  delete q.lang;
  if (resolvedLang && resolvedLang !== 'hy') {
    q.lang = resolvedLang;
  }
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
  if (!Object.prototype.hasOwnProperty.call(req.query, 'lang')) return next();

  const raw = req.query.lang;
  const resolved = parseLangParam(raw);
  const isDuplicate = Array.isArray(raw);
  const isInvalid = raw != null && !resolved;

  if (!isDuplicate && !isInvalid) return next();

  const target = buildPathWithoutLang(req, resolved);
  const currentPath = req.path || '/';
  const currentQs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const current = currentQs ? `${currentPath}${currentQs}` : currentPath;

  if (target === current) return next();
  return res.redirect(301, target);
}

function stripLangQuery(req) {
  const lang = parseLangParam(req.query.lang);
  if (!lang) return null;
  return buildPathWithoutLang(req, lang === 'hy' ? null : lang);
}

module.exports = { localeRedirectMiddleware, stripLangQuery, LANG_CODES };

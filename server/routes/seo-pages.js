const express = require('express');
const { ROUTES, serveSeoPage } = require('../services/seo-pages');
const { serveServicesHub, serveServicePage } = require('../services/service-pages');
const { serveConditionsHub, serveConditionPage } = require('../services/condition-pages');
const { serveKnowledgeHub, serveKnowledgeArticle } = require('../services/knowledge-pages');
const { LAUNCHED_AUTHORITY_SLUGS, servePage } = require('../services/local-authority-pages');
const { serveDoctorPage } = require('../services/doctor-pages');
const { normalizeLang } = require('../services/i18n-ssr');

const router = express.Router();

function sendLocaleHtml(req, res, html) {
  if (!html) return res.status(404).send('Not found');
  const lang = normalizeLang(req.query.lang);
  if (lang !== 'hy') {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Vary', 'Accept-Language');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  res.type('html').send(html);
}

Object.keys(ROUTES).forEach((routePath) => {
  router.get(routePath, (req, res) => {
    const lang = normalizeLang(req.query.lang);
    sendLocaleHtml(req, res, serveSeoPage(routePath, lang));
  });
});

LAUNCHED_AUTHORITY_SLUGS.forEach((routePath) => {
  router.get(routePath, (req, res) => {
    const lang = normalizeLang(req.query.lang);
    sendLocaleHtml(req, res, servePage(routePath, lang));
  });
});

router.get('/services', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveServicesHub(lang));
});

router.get('/services/:slug', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveServicePage(req.params.slug, lang));
});

router.get('/conditions', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveConditionsHub(lang));
});

router.get('/conditions/:slug', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveConditionPage(req.params.slug, lang));
});

router.get('/knowledge', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveKnowledgeHub(lang));
});

router.get('/knowledge/:slug', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveKnowledgeArticle(req.params.slug, lang));
});

router.get('/doctors/:slug', (req, res) => {
  const lang = normalizeLang(req.query.lang);
  sendLocaleHtml(req, res, serveDoctorPage(req.params.slug, lang));
});

module.exports = router;

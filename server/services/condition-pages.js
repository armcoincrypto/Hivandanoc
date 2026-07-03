const fs = require('fs');
const path = require('path');
const { buildPublicContent } = require('../db/helpers');
const { clinicNode, clinicName } = require('./entity-schema');
const { getKnowledgeLinksForCondition, KNOWLEDGE_CONFIG } = require('./knowledge-pages');

const SITE_ROOT = path.join(__dirname, '../..');
const BASE = (process.env.PUBLIC_SITE_URL || 'https://healthyspinedoc.com').replace(/\/$/, '');

/** P3.3 launch batch + P1.2-A expansion */
const LAUNCHED_CONDITION_SLUGS = ['back-pain-treatment', 'neck-pain-treatment', 'sciatica', 'herniated-disc', 'lower-back-pain', 'leg-numbness'];

const CONDITION_CONFIG = {
  'back-pain-treatment': {
    h1: 'Մեջքի ցավ և վերականգնում',
    tagline: 'Կոնսերվատիվ մոտեցում պոզանոցի և գոտկային ցավի գնահատման և վերականգնման համար Երևանում',
    titleSuffix: 'Մեջքի ցավ — վերականգնում և խորհրդատվություն',
    description:
      'Պոզանոցի և գոտկային ցավի գնահատում և վերականգնողական աջակցություն «Առողջ ողնաշար» կենտրոնում Երևանում։ Մանուալ թերապիա, ֆիզիոթերապիա և կոնսերվատիվ բուժում։',
    intro: `Մեջքի ցավը հաճախ հանդիպող բողոք է, որը կարող է առաջանալ տարբեր պատճառներով՝ մկանային լարվածությունից մինչև դիսկի խնդիրներ կամ երկարատև նստած աշխատանք։ 
      «Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում կարող է առաջարկել կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր՝ պոզանոցի և գոտկային շրջանի ցավի կառավարման աջակցության համար, մասնագետի խորհրդատվությունից հետո։`,
    symptoms: [
      'Ցավ պոզանոցի կամ գոտկային շրջանում, մի կողմում կամ երկու կողմում',
      'Շարժման կամ կեցվածքի փոփոխության ժամանակ ցավի ուժգնացում',
      'Մկանների կարկամություն կամ լարվածություն',
      'Շարժունակության սահմանափակում',
      'Ցավ, որը կարող է ճառագայթել ոտքի կամ ուրույն գոտիի ուղղությամբ (ըստ գնահատման)'
    ],
    whenToSeek: [
      'Եթե ցավը տևում է մի քանի օրից ավելի և չի նվազում հանգստից հետո',
      'Եթե ցավը խանգարում է առօրյա գործունեությանը, քնին կամ աշխատանքին',
      'Եթե աստիճանաբար խտանում են նյարդային ախտանիշները (թմրածություն, թուլություն)',
      'Եթե ցավը սկսվել է վնասվածքից, ընկնելուց կամ ծանր բարձրացումից հետո',
      'Արտակարգ իրավիճակներում (ուժեղ ցավ, շարժման կորստ, միզապարկի կամ մலքի խանգարում) դիմեք 103'
    ],
    serviceSlugs: ['manual-therapy', 'physiotherapy', 'hernia-treatment', 'osteopathy'],
    servicesIntro:
      'Մեջքի ցավի դեպքում վերականգնողական կենտրոնում կարող են դիտարկվել հետևյալ ծառայությունները՝ միայն մասնագետի գնահատումից հետո։ Դրանք հաճախ կիրառվում են որպես կոնսերվատիվ պլանի մաս և կարող են համակցվել միմյանց։'
  },
  'neck-pain-treatment': {
    h1: 'Պարանոցի ցավ և վերականգնում',
    tagline: 'Կոնսերվատիվ մոտեցում պարանոցի ցավի, կարկամության և շարժունակության խնդիրների գնահատման համար',
    titleSuffix: 'Պարանոցի ցավ — վերականգնում և խորհրդատվություն',
    description:
      'Պարանոցի ցավի և կարկամության գնահատում և վերականգնողական աջակցություն «Առողջ ողնաշար» կենտրոնում Երևանում։ Մանուալ թերապիա, ֆիզիոթերապիա, օստեոպաթիա։',
    intro: `Պարանոցի ցավը կարող է կապված լինել մկանների լարվածության, կեցվածքի, երկարատև աշխատանքի համակարգչի դիմաց կամ շարժական համակարգի այլ խնդիրների հետ։ 
      «Առողջ ողնաշար» կենտրոնը Երևանում կարող է առաջարկել կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր՝ պարանոցի ցավի և շարժունակության աջակցության համար, առանց բժշկական ախտորոշում տալու կամ բուժման երաշխիքի։`,
    symptoms: [
      'Պարանոցի կարկամություն կամ ցավ շարժման ժամանակ',
      'Գլուխը շրջելիս կամ կեցվածքը փոխելիս անհանգստություն',
      'Ոլոքների կամ վերևի մասի լարվածություն',
      'Գլուխի ծանրության զգացում',
      'Հաճախակի գլուխի ցավեր, եթե դրանք ուղեկցում են պարանոցի ցավին (պահանջում է գնահատում)'
    ],
    whenToSeek: [
      'Եթե պարանոցի ցավը չի նվազում մի քանի օրում',
      'Եթե ցավը ուղեկցվում է ձեռքերի խմբավորվածությամբ կամ թուլությամբ',
      'Եթե ցավը առաջացել է վնասվածքից կամ ճանապարհատրանսպորտային դեպքից հետո',
      'Եթե ցավը խանգարում է քնին, աշխատանքին կամ վարելուն',
      'Արտակարգ ախտանիշներ (ուժեղ գլուխի ցավ, տեսողության խանգարում, տենտունություն) — դիմեք 103'
    ],
    serviceSlugs: ['manual-therapy', 'physiotherapy', 'osteopathy'],
    servicesIntro:
      'Պարանոցի ցավի դեպքում կարող են դիտարկվել հետևյալ վերականգնողական ծառայությունները՝ ըստ մասնագետի ցուցումների։ Դրանք կարող են օգնել շարժունակության բարելավման և ցավի կառավարման աջակցության համար։'
  },
  'sciatica': {
    h1: 'Իշիաս և նյարդային ցավ',
    tagline: 'Կոնսերվատիվ մոտեցում իշիասի սիմպտոմների գնահատման և վերականգնման համար',
    titleSuffix: 'Իշիաս — վերականգնում և խորհրդատվություն',
    description:
      'Իշիասի և նյարդային ցավի գնահատում և վերականգնողական աջակցություն «Առողջ ողնաշար» կենտրոնում Երևանում։ Մանուալ թերապիա, տրակցիա, ֆիզիոթերապիա։',
    intro: `Իշիասը հաճախ նկարգրվում է որպես ցավ, որը կարող է ճառագայթել գոտկային շրջանից ոտքի ուղղությամբ, և կապված լինել նյարդի ճնշման հետ։ 
      «Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում կարող է առաջարկել կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր՝ մասնագետի խորհրդատվությունից հետո։`,
    symptoms: [
      'Ցավ գոտկային մասում, որը կարող է ճառագայթել ոտքի ուղղությամբ',
      'Խմբավորում կամ թուլություն ոտքում',
      'Իզգի ցավ կամ ծակող ցավ ոտքի հետևի մասում',
      'Ցավի ուժգնացում նստած դիրքում',
      'Շարժման կամ հազի ժամանակ ցավի սրացում'
    ],
    whenToSeek: [
      'Եթե ցավը չի նվազում մի քանի օրում',
      'Եթե աստիճանաբար խտանում են թմրածությունը կամ թուլությունը',
      'Եթե ցավը խանգարում է քնին կամ առօրյա գործունեությանը',
      'Եթե ցավը ուղեկցվում է միզապարկի կամ մալքի խանգարումով',
      'Արտակարգ իրավիճակներում դիմեք 103'
    ],
    serviceSlugs: ['hernia-treatment', 'manual-therapy', 'physiotherapy', 'traction'],
    servicesIntro:
      'Իշիասի դեպքում վերականգնողական կենտրոնում կարող են դիտարկվել հետևյալ ծառայությունները՝ միայն մասնագետի գնահատումից հետո։'
  },
  'herniated-disc': {
    h1: 'Միջողային սկավառակի ճողվածք',
    tagline: 'Կոնսերվատիվ մոտեցում միջողային սկավառակի ճողվածքի գնահատման և վերականգնման համար',
    titleSuffix: 'Միջողային սկավառակի ճողվածք — վերականգնում և խորհրդատվություն',
    description:
      'Միջողային սկավառակի ճողվածքի գնահատում և կոնսերվատիվ վերականգնողական աջակցություն «Առողջ ողնաշար» կենտրոնում Երևանում։ Տրակցիա, մանուալ թերապիա, ֆիզիոթերապիա։',
    intro: `Միջողային սկավառակի ճողվածքը կարող է ուղեկցվել մեջքի ցավով, նյարդային ախտանիշներով կամ շարժման սահմանաֆակմամբ։ 
      «Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում կարող է առաջարկել կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր՝ մասնագետի խորհրդատվությունից հետո։`,
    symptoms: [
      'Մեջքի կամ գոտկային ցավ',
      'Ցավ, որը կարող է ճառագայթել ոտքի ուղղությամբ',
      'Թմրածություն կամ թուլություն',
      'Մկանային թուլություն',
      'Շարժունակության սահմանաֆակում'
    ],
    whenToSeek: [
      'Եթե ցավը տևում է մի քանի օրից ավելի և չի նվազում հանգստից հետո',
      'Եթե ցավը խանգարում է առօրյա գործունեությանը',
      'Եթե աստիճանաբար խտանում են թմրածությունը կամ թուլությունը',
      'Եթե ցավը սկսվել է վնասվածքից հետո',
      'Արտակարգ իրավիճակներում (միզապարկի կամ մալքի խանգարում) դիմեք 103'
    ],
    serviceSlugs: ['hernia-treatment', 'manual-therapy', 'physiotherapy', 'traction'],
    servicesIntro:
      'Միջողային սկավառակի ճողվածքի դեպքում վերականգնողական կենտրոնում կարող են դիտարկվել հետևյալ ծառայությունները՝ միայն մասնագետի գնահատումից հետո։'
  },
  'lower-back-pain': {
    h1: 'Գոտկային մասի ցավ',
    tagline: 'Կոնսերվատիվ մոտեցում գոտկային մասի ցավի գնահատման և վերականգնման համար',
    titleSuffix: 'Գոտկային մասի ցավ — վերականգնում և խորհրդատվություն',
    description:
      'Գոտկային մասի ցավի գնահատում և վերականգնողական աջակցություն «Առողջ ողնաշար» կենտրոնում Երևանում։ Մանուալ թերապիա, ֆիզիոթերապիա, օստեոպաթիա։',
    intro: `Գոտկային մասի ցավը հաճախ հանդիպող բողոք է, որը կարող է առաջանալ տարբեր պատճառներով՝ մկանային լարվածությունից մինչև դիսկի խնդիրներ կամ երկարատև նստած աշխատանք։ 
      «Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում կարող է առաջարկել կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր՝ մասնագետի խորհրդատվությունից հետո։`,
    symptoms: [
      'Ցավ գոտկային մասում, մի կողմում կամ երկու կողմում',
      'Ցավի ուժգնացում նստած դիրքում կամ կանգնելիս',
      'Մկանային լարվածություն կամ կարկամություն գոտկային շրջանում',
      'Շարժունակության սահմանաֆակում',
      'Ցավ, որը կարող է ճառագայթել ոտքի ուղղությամբ (ըստ գնահատման)'
    ],
    whenToSeek: [
      'Եթե ցավը տևում է մի քանի օրից ավելի և չի նվազում հանգստից հետո',
      'Եթե ցավը խանգարում է առօրյա գործունեությանը, քնին կամ աշխատանքին',
      'Եթե աստիճանաբար խտանում են նյարդային ախտանիշները (թմրածություն, թուլություն)',
      'Եթե ցավը սկսվել է վնասվածքից, ընկնելուց կամ ծանր բարձրացումից հետո',
      'Արտակարգ իրավիճակներում (ուժեղ ցավ, շարժման կորստ, միզապարկի կամ մալքի խանգարում) դիմեք 103'
    ],
    serviceSlugs: ['manual-therapy', 'physiotherapy', 'osteopathy', 'hernia-treatment'],
    servicesIntro:
      'Գոտկային մասի ցավի դեպքում վերականգնողական կենտրոնում կարող են դիտարկվել հետևյալ ծառայությունները՝ միայն մասնագետի գնահատումից հետո։'
  },
  'leg-numbness': {
    h1: 'Ոտքի թմրածություն և նյարդային ախտանիշներ',
    tagline: 'Կոնսերվատիվ մոտեցում ոտքի թմրածության և նյարդային ախտանիշների գնահատման համար',
    titleSuffix: 'Ոտքի թմրածություն — վերականգնում և խորհրդատվություն',
    description:
      'Ոտքի թմրածության և նյարդային ախտանիշների գնահատում և վերականգնողական աջակցություն «Առողջ ողնաշար» կենտրոնում Երևանում։',
    intro: `Ոտքի թմրածությունը կարող է առաջանալ տարբեր պատճառներով, այդ թվում՝ նյարդի ճնշմանից։ Այն երբեմն կապվում է գոտկային շրջանի ցավի կամ դիսկի խնդիրների հետ, բայց կարող է ունենալ նաև այլ պատճառներ։ 
      «Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում կարող է առաջարկել կոնսերվատիվ գնահատում՝ մասնագետի խորհրդատվությունից հետո։`,
    symptoms: [
      'Խմբավորում կամ «մկան» զգացում ոտքում',
      'Թուլություն կամ ցավ ոտքի հետևի մասում',
      'Զգացողության նվազում կամ փոփոխություն',
      'Ցավ, որը կարող է ուժգնանալ նստած դիրքում',
      'Ախտանիշներ, որոնք չեն անցնում մի քանի օրում'
    ],
    whenToSeek: [
      'Եթե թմրածությունը չի անցնում մի քանի օրում',
      'Եթե աստիճանաբար խտանում է թուլությունը',
      'Եթե ուղեկցվում է միզապարկի կամ մալքի խանգարումով',
      'Եթե ախտանիշները սկսվել են վնասվածքից հետո',
      'Արտակարգ իրավիճակներում դիմեք 103'
    ],
    serviceSlugs: ['hernia-treatment', 'manual-therapy', 'physiotherapy', 'traction'],
    servicesIntro:
      'Ոտքի թմրածության և նյարդային ախտանիշների դեպքում վերականգնողական կենտրոնում կարող են դիտարկվել հետևյալ ծառայությունները՝ միայն մասնագետի գնահատումից հետո։'
  }
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.item
    }))
  };
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

function findService(data, slug) {
  return (data?.departments || []).find((s) => s.id === slug);
}

function ctaBlock() {
  return `<nav class="seo-service-cta" aria-label="Next steps">
    <p><a href="/contact" class="hss-btn hss-btn--primary">Գրանցվել ընդունելության</a>
    <a href="/contact" class="hss-btn hss-btn--outline">Կապ</a>
    <a href="/locations" class="hss-link">Հասցե և ժամեր</a></p>
  </nav>`;
}

function safetyNote() {
  return `<section class="seo-service-section">
    <h2>Կարևոր նշում</h2>
    <div class="hss-prose">
      <p>Այս էջը տեղեկատվական է և չի փոխարինում բժշկական ախտորոշումը կամ խորհրդատվությունը։ Յուրաքանչյուր դեպք գնահատվում է առանձին՝ հաշվի առնելով բողոքները, պատմությունը և առկա ուսումնասիրությունները։</p>
      <p>Բուժման արդյունքները կարող են տարբեր լինել։ Կենտրոնը չի երաշխավորում կոնկրետ արդյունքներ կամ ամբողջական ազատում ցավից։</p>
    </div>
  </section>`;
}

function conditionMeta(config, data) {
  const name = clinicName(data);
  return {
    title: `${config.titleSuffix} — ${name} | Երևան`,
    description: config.description.slice(0, 160),
    h1: config.h1,
    tagline: config.tagline
  };
}

function knowledgeLinksHtml(slugs) {
  const list = slugs
    .map((id) => {
      const c = KNOWLEDGE_CONFIG[id];
      if (!c) return '';
      return `<li><a href="/knowledge/${esc(id)}"><strong>${esc(c.h1)}</strong></a></li>`;
    })
    .join('');
  return list
    ? `<section class="seo-service-section"><h2>Կապված հոդվածներ</h2><ul class="hss-list">${list}</ul><p><a href="/knowledge" class="hss-link">Գիտելիքների կենտրոն</a></p></section>`
    : '';
}

function knowledgeLinksHtml(slugs) {
  const list = slugs
    .map((id) => {
      const c = KNOWLEDGE_CONFIG[id];
      if (!c) return '';
      return `<li><a href="/knowledge/${esc(id)}"><strong>${esc(c.h1)}</strong></a></li>`;
    })
    .join('');
  return list
    ? `<section class="seo-service-section"><h2>Կապված հոդվածներ</h2><ul class="hss-list">${list}</ul><p><a href="/knowledge" class="hss-link">Գիտելիքների կենտրոն</a></p></section>`
    : '';
}

function serviceLinksHtml(data, slugs, intro) {
  const items = slugs
    .map((id) => findService(data, id))
    .filter(Boolean)
    .map(
      (s) =>
        `<li><a href="/services/${esc(s.id)}"><strong>${esc(s.name)}</strong></a>${s.description ? ` — ${esc(s.description)}` : ''}</li>`
    )
    .join('');
  return `<section class="seo-service-section">
    <h2>Կապված ծառայություններ կենտրոնում</h2>
    <div class="hss-prose"><p>${intro}</p></div>
    <ul class="hss-list">${items}</ul>
    <p><a href="/services" class="hss-link">Բոլոր ծառայությունները</a> · <a href="/conditions" class="hss-link">Այլ ախտորոշումներ</a></p>
  </section>`;
}

function conditionBodyHtml(data, slug, config) {
  const h = data?.hospital || {};
  const symptomList = config.symptoms.map((s) => `<li>${esc(s)}</li>`).join('');
  const whenList = config.whenToSeek.map((s) => `<li>${esc(s)}</li>`).join('');

  return `<article class="seo-crawl-content seo-condition-page" id="seo-crawl-content">
    <nav class="seo-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Գլխավոր</a> › <a href="/conditions">Ախտորոշումներ</a> › <span>${esc(config.h1)}</span>
    </nav>
    <div class="hss-prose">
      <p>${config.intro}</p>
      <p>Կենտրոնը մասնագիտացված է պոզանոցի, հոդերի և շարժական համակարգի կոնսերվատիվ վերականգնման վրա։ 
      Խորհրդատվությունը կարող է օգնել պարզել, թե որ վերականգնողական մոտեցումները կարող են հարմար լինել ձեր բողոքներին։</p>
    </div>
    <section class="seo-service-section">
      <h2>Հաճախ հանդիպող ախտանիշներ</h2>
      <p class="hss-prose">Ստորև ներկայացված են ախտանիշներ, որոնք մարդիկ հաճախ նկարագրում են։ Դրանք չեն հավասարեցվում ախտորոշման և պահանջում են մասնագետի գնահատում։</p>
      <ul class="hss-list">${symptomList}</ul>
    </section>
    <section class="seo-service-section">
      <h2>Երբ կարող է օգտակար լինել գնահատումը</h2>
      <ul class="hss-list">${whenList}</ul>
    </section>
    ${serviceLinksHtml(data, config.serviceSlugs, config.servicesIntro)}
    ${knowledgeLinksHtml(getKnowledgeLinksForCondition(slug))}
    <section class="seo-service-section">
      <h2>Ինչ սպասել կլինիկայում</h2>
      <div class="hss-prose">
        <p>Առաջին այցի ժամանակ մասնագետը կարող է հավաքել բողոքների պատմությունը, կատարել ստուգում և քննարկել հնարավոր հաջորդ քայլերը։ 
        Վերականգնողական պլանը, եթե առաջարկվի, կարող է ներառել մի քանի հանդիպում և տնային խորհուրդներ՝ ըստ անհատական գնահատման։</p>
        <p><strong>Հասցե:</strong> ${esc(h.address || 'Yerevan, Armenia')} · <strong>Հեռախոս:</strong> ${esc(h.phone || '')}</p>
      </div>
    </section>
    ${safetyNote()}
    <p><a href="/conditions" class="hss-link">← Բոլոր ախտորոշումները</a></p>
    ${ctaBlock()}
  </article>`;
}

function conditionJsonLd(data, config, url) {
  return [
    {
      '@type': 'MedicalWebPage',
      name: config.h1,
      url,
      description: config.description,
      isPartOf: { '@type': 'WebSite', name: clinicName(data), url: `${BASE}/` },
      publisher: clinicNode(data)
    },
    clinicNode(data),
    breadcrumb([
      { name: 'Գլխավոր', item: `${BASE}/` },
      { name: 'Ախտորոշումներ', item: `${BASE}/conditions` },
      { name: config.h1, item: url }
    ])
  ];
}

function hubMeta(data) {
  const name = clinicName(data);
  return {
    title: `${name} — Ախտորոշումներ և ցավի գնահատում | Երևան`,
    description:
      'Մեջքի և պարանոցի ցավի վերաբերյալ տեղեկատվություն և վերականգնողական խորհրդատվություն «Առողջ ողնաշար» կենտրոնում Երևանում։',
    h1: 'Ախտորոշումներ և ցավի թեմաներ',
    tagline: 'Տեղեկատվականան էջեր՝ ախտանիշային որոնումից ծառայությունների վերականգնողական մոտեցումներ'
  };
}

function hubBodyHtml() {
  const pages = LAUNCHED_CONDITION_SLUGS.map((slug) => CONDITION_CONFIG[slug]);
  return `<article class="seo-crawl-content seo-conditions-hub" id="seo-crawl-content">
    <nav class="seo-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Գլխավոր</a> › <span>Ախտորոշումներ</span>
    </nav>
    <div class="hss-prose">
      <p>Այս բաժինը տեղեկատվական է և կարող է օգնել հասկանալ, թե երբ վերականգնողական խորհրդատվությունը կարող է հարմար լինել։ 
      Էջերը չեն տալիս ախտորոշում և չեն երաշխավորում բուժման արդյունք։</p>
    </div>
    <section class="seo-service-section">
      <h2>Հասանելի թեմաներ</h2>
      <ul class="hss-list">${pages
        .map(
          (c, i) =>
            `<li><a href="/conditions/${esc(LAUNCHED_CONDITION_SLUGS[i])}"><strong>${esc(c.h1)}</strong></a> — ${esc(c.tagline)}</li>`
        )
        .join('')}</ul>
    </section>
    <p><a href="/services" class="hss-link">Ծառայություններ</a> · <a href="/knowledge" class="hss-link">Գիտելիքների կենտրոն</a> · <a href="/contact" class="hss-link">Կապ</a> · <a href="/locations" class="hss-link">Հասցե</a></p>
    ${ctaBlock()}
  </article>`;
}

function hubJsonLd(data, url) {
  return [
    {
      '@type': 'WebPage',
      name: 'Ախտորոշումներ',
      url,
      description: hubMeta(data).description,
      isPartOf: { '@type': 'WebSite', name: clinicName(data), url: `${BASE}/` }
    },
    clinicNode(data),
    breadcrumb([
      { name: 'Գլխավոր', item: `${BASE}/` },
      { name: 'Ախտորոշումներ', item: url }
    ])
  ];
}

function prepareHtml(fileName, meta, canonicalPath, bodyHtml, jsonLdGraphs) {
  const filePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(filePath)) return null;

  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/<meta name="description"[^>]*>/gi, '');
  html = html.replace(/<meta name="robots"[^>]*>/gi, '');
  html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<link rel="alternate"[^>]*>/gi, '');
  html = html.replace(/<meta property="og:[^"]+"[^>]*>/gi, '');
  html = html.replace(/<meta name="twitter:[^"]+"[^>]*>/gi, '');
  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = html.replace(
    '</head>',
    `${headTags(meta, canonicalPath)}\n${injectJsonLdScript(jsonLdGraphs)}\n</head>`
  );

  html = html.replace(/(<h1[^>]*data-i18n="pages\.[^"]+"[^>]*>)[^<]*(<\/h1>)/, `$1${esc(meta.h1)}$2`);
  html = html.replace(/(<h1 id="condition-hero-title">)[^<]*(<\/h1>)/, `$1${esc(meta.h1)}$2`);
  html = html.replace(/(<p class="hss-hero__tagline"[^>]*>)[^<]*(<\/p>)/, `$1${esc(meta.tagline)}$2`);
  html = html.replace(/(<p class="hss-hero__tagline" id="condition-hero-tagline">)[^<]*(<\/p>)/, `$1${esc(meta.tagline)}$2`);

  const rootId = fileName === 'conditions.html' ? 'conditions-hub-root' : 'condition-page-root';
  if (html.includes(`id="${rootId}"`)) {
    html = html.replace(new RegExp(`(<div class="hss-wrap" id="${rootId}">)\\s*(</div>)`), `$1${bodyHtml}$2`);
  }

  html = html.replace(/<body([^>]*)>/, `<body$1 data-seo-canonical="${esc(canonicalPath)}">`);

  return html;
}

function serveConditionsHub() {
  const data = buildPublicContent('hy');
  const meta = hubMeta(data);
  const body = hubBodyHtml();
  const url = `${BASE}/conditions`;
  return prepareHtml('conditions.html', meta, '/conditions', body, hubJsonLd(data, url));
}

function serveConditionPage(slug) {
  if (!LAUNCHED_CONDITION_SLUGS.includes(slug)) return null;
  const config = CONDITION_CONFIG[slug];
  if (!config) return null;

  const data = buildPublicContent('hy');
  const meta = conditionMeta(config, data);
  const body = conditionBodyHtml(data, slug, config);
  const url = `${BASE}/conditions/${slug}`;
  const html = prepareHtml('condition.html', meta, `/conditions/${slug}`, body, conditionJsonLd(data, config, url));
  if (html) {
    return html.replace('data-condition-slug=""', `data-condition-slug="${esc(slug)}"`);
  }
  return html;
}

function getLaunchedConditionSlugs() {
  return [...LAUNCHED_CONDITION_SLUGS];
}

module.exports = {
  LAUNCHED_CONDITION_SLUGS,
  CONDITION_CONFIG,
  serveConditionsHub,
  serveConditionPage,
  getLaunchedConditionSlugs
};

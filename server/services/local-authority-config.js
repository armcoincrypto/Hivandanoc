/**
 * P1.5 Page configurations — Local SEO + E-E-A-T Authority
 * Armenian content for all authority pages.
 */
const { clinicNode, localBusinessNode, BASE } = require('./entity-schema');

const CLINIC_ADDRESS = '6 Մարգարյան փ., Երևան 0078';
const CLINIC_PHONE = '+374 (93) 27-48-88';
const CLINIC_HOURS = 'Երկ–Ուրբ 8:00–20:00, Շբթ 9:00–15:00';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function contactBlock() {
  return `<section class="seo-service-section">
      <h2>Կապ հաստատել</h2>
      <p><strong>Հասցե՝</strong> ${CLINIC_ADDRESS}</p>
      <p><strong>Հեռախոս՝</strong> ${CLINIC_PHONE}</p>
      <p><strong>Աշխատանքային ժամեր՝</strong> ${CLINIC_HOURS}</p>
    </section>`;
}

function serviceLinks() {
  return `<ul class="hss-list">
        <li><a href="/services/manual-therapy">Մանուալ թերապիա</a></li>
        <li><a href="/services/osteopathy">Օստեոպաթիա</a></li>
        <li><a href="/services/physiotherapy">Ֆիզիոթերապիա</a></li>
        <li><a href="/services/kinesiotherapy">Կինեզիոթերապիա</a></li>
        <li><a href="/services/traction">Տրակցիա</a></li>
        <li><a href="/services/acupuncture">Ասեղնաբուժություն</a></li>
      </ul>`;
}

function conditionLinks() {
  return `<ul class="hss-list">
        <li><a href="/conditions/back-pain-treatment">Մեջքի ցավ և վերականգնում</a></li>
        <li><a href="/conditions/neck-pain-treatment">Պարանոցի ցավ և վերականգնում</a></li>
        <li><a href="/conditions/sciatica">Իշիաս և նյարդային ցավ</a></li>
        <li><a href="/conditions/herniated-disc">Սկավառակի ճողվածք</a></li>
        <li><a href="/conditions/lower-back-pain">Գոտկային մասի ցավ</a></li>
        <li><a href="/conditions/scoliosis-pain">Սկոլիոզ</a></li>
        <li><a href="/conditions/osteochondrosis">Օստեոխոնդրոզ</a></li>
      </ul>`;
}

function knowledgeLinks() {
  return `<p><a href="/knowledge/back-pain-causes">Մեջքի ցավի պատճառներ</a> ·
    <a href="/knowledge/sciatica-symptoms">Իշիասի ախտանիշներ</a> ·
    <a href="/knowledge/herniated-disc-symptoms">Սկավառակի ախտանիշներ</a> ·
    <a href="/knowledge/posture-and-spine-health">Կեցվածք և ողնաշար</a></p>`;
}

const PAGES = {};

// ---- PHASE A: Local SEO Landing Pages ----

PAGES['/spine-specialist-yerevan'] = {
  path: '/spine-specialist-yerevan',
  pageKey: 'local-spine-specialist',
  title: 'Ողնաշարի մասնագետ Երևանում — Առողջ ողնաշար',
  h1: 'Ողնաշարի մասնագետ Երևանում',
  tagline: 'Կոնսերվատիվ մոտեցում ողնաշարի, հոդերի և շարժական համակարգի վերականգնողական կենտրոնում',
  description: 'Ողնաշարի մասնագետ Երևանում—կոնսերվատիվ գնահատում, մանուալ թերապիա, օստեոպաթիա և վերականգնողական ծրագրեր։',
  faq: [
    { q: 'Ինչ անում է ողնաշարի մասնագետը', a: 'Ողնաշարի մասնագետը զբաղվում է ողնաշարի, հոդերի և շարժական համակարգի խնդիրների գնահատման և կոնսերվատիվ վերականգնման հարցերով։' },
    { q: 'Ինչպես ընտրել մասնագետ', a: 'Կապ հաստատեք հեռախոսով կամ օնլայն գրանցման ձևով։ Սկզբնական գնահատումը տևում է 20–40 րոպե։' },
    { q: 'Ինչ հիվանդություններ են բուժվում', a: 'Կենտրոնում գնահատվում են մեջքի, պարանոցի, գոտկային ցավեր, իշիաս, սկոլիոզ, օստեոխոնդրոզ, հոդերի խնդիրներ և կեցվածքի խանգարումներ։' }
  ],
  schema: (data, url) => [localBusinessNode(data, url)],
  body: (data) => `<div class="hss-prose">
      <p>«Առողջ ողնաշար» վերականգնողական կենտրոնը Երևանում մասնագիտացված է ողնաշարի, հոդերի և շարժական համակարգի խնդիրների կոնսերվատիվ վերականգնման վրա։ Կենտրոնը աշխատում է կոնսերվատիվ մոտեցումով՝ մանուալ թերապիա, օստեոպաթիա, ՖթՈ, կինեզիոթերապիա և այլ մեթոդներ։</p>
      <p>Մասնագետները գնահատում են յուրաքանչյուր դեպք և կազմում անհատականացված վերականգնողական պլան։ Արդյունքները կարող են տարբեր լինել։</p>
    </div>
    <section class="seo-service-section">
      <h2>Ծառայություններ</h2>
      ${serviceLinks()}
    </section>
    <section class="seo-service-section">
      <h2>Ինչ վիճակներ են գնահատվում</h2>
      ${conditionLinks()}
    </section>
    ${contactBlock()}
    <p><a href="/find-a-doctor" class="hss-link">Գտնել մասնագետ</a> · <a href="/about-doctor" class="hss-link">Բժշկի մասին</a> · <a href="/knowledge" class="hss-link">Գիտելիքների կենտրոն</a></p>`
};

PAGES['/back-pain-treatment-yerevan'] = {
  path: '/back-pain-treatment-yerevan',
  pageKey: 'local-back-pain',
  title: 'Մեջքի ցավի բուժում Երևանում — Առողջ ողնաշար',
  h1: 'Մեջքի ցավի բուժում Երևանում',
  tagline: 'Կոնսերվատիվ մոտեցում մեջքի և գոտկային ցավի գնահատման և վերականգնման համար',
  description: 'Մեջքի ցավի կոնսերվատիվ բուժում Երևանում—մանուալ թերապիա, ՖթՈ, կինեզիոթերապիա «Առողջ ողնաշար» կենտրոնում։',
  faq: [
    { q: 'Ինչպես է բուժվում մեջքի ցավը', a: 'Կենտրոնում կիրառվում է կոնսերվատիվ մոտեցում—մանուալ թերապիա, օստեոպաթիա, ՖթՈ և կինեզիոթերապիա։ Արդյունքները կարող են տարբեր լինել։' },
    { q: 'Ինչքան այց է պահանջվում', a: 'Սկզբնական գնահատումը տևում է 20–40 րոպե։ Մասնագետը գնահատում է բողքները, ստուգում են շարժունակությունը և կազմում պլան։' }
  ],
  schema: (data, url) => [localBusinessNode(data, url)],
  body: (data) => `<div class="hss-prose">
      <p>Մեջքի ցավը հաճախ հանդիպող բողք է, որը կարող է առաջանալ մկանային լարվածությունից մինչև դիսկի խնդիրներ կամ երկարատև նստած աշխատանք։ «Առողջ ողնաշար» կենտրոնը Երևանում առաջարկում է կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր։</p>
      <p>Կենտրոնի մասնագետները կիրառում են մանուալ թերապիա, օստեոպաթիա, ՖթՈ և կինեզիոթերապիա։ Յուրաքանչյուր դեպք գնահատվում է անհատապես և համակցվում է արդյունավետ վերականգնողական մեթոդների հետ։</p>
    </div>
    <section class="seo-service-section">
      <h2>Կիրառվող մեթոդներ</h2>
      ${serviceLinks()}
    </section>
    <section class="seo-service-section">
      <h2>Կապված վիճակներ</h2>
      ${conditionLinks()}
    </section>
    ${contactBlock()}
    ${knowledgeLinks()}`
};

PAGES['/sciatica-treatment-yerevan'] = {
  path: '/sciatica-treatment-yerevan',
  pageKey: 'local-sciatica',
  title: 'Իշիասի բուժում Երևանում — Առողջ ողնաշար',
  h1: 'Իշիասի բուժում Երևանում',
  tagline: 'Կոնսերվատիվ մոտեցում իշիասի և նյարդային ցավի գնահատման և վերականգնման համար',
  description: 'Իշիասի կոնսերվատիվ բուժում Երևանում—մանուալ թերապիա, տրակցիա, ՖթՈ «Առողջ ողնաշար» կենտրոնում։',
  faq: [
    { q: 'Ինչ է իշիասը', a: 'Իշիասը նկարագրվում է որպես ցավ գոտկային մասից ոտքի ուղղությամբ, կապված նյարդի ճնշման հետ։' },
    { q: 'Ինչպես է բուժվում իշիասը', a: 'Կենտրոնում կիրառվում է մանուալ թերապիա, տրակցիա, ՖթՈ և կինեզիոթերապիա։ Պլանը կազմվում է գնահատումից հետո։' }
  ],
  schema: (data, url) => [localBusinessNode(data, url)],
  body: (data) => `<div class="hss-prose">
      <p>Իշիասը հաճախ նկարագրվում է որպես ցավ գոտկային մասից ոտքի ուղղությամբ, կապված նյարդի ճնշման հետ։ «Առողջ ողնաշար» կենտրոնը Երևանում առաջարկում է իշիասի կոնսերվատիվ գնահատում և վերականգնողական ծրագրեր։</p>
      <p>Վերականգնողական պլանը կազմվում է մասնագետի գնահատումից հետո և կարող է ներառել մանուալ թերապիա, տրակցիա, ՖթՈ և այլ մեթոդներ։</p>
    </div>
    <section class="seo-service-section">
      <h2>Կիրառվող թերապևտիկ մեթոդներ</h2>
      <ul class="hss-list">
        <li><a href="/services/manual-therapy">Մանուալ թերապիա</a></li>
        <li><a href="/services/traction">Տրակցիա</a></li>
        <li><a href="/services/physiotherapy">Ֆիզիոթերապիա</a></li>
        <li><a href="/services/kinesiotherapy">Կինեզիոթերապիա</a></li>
      </ul>
    </section>
    ${contactBlock()}
    <p><a href="/conditions/sciatica" class="hss-link">Իշիաս — մանրամասն</a> · <a href="/knowledge/sciatica-symptoms" class="hss-link">Իշիասի ախտանիշներ</a> · <a href="/knowledge/sciatica-recovery-time" class="hss-link">Վերականգնման ժամկետներ</a></p>`
};

PAGES['/herniated-disc-treatment-yerevan'] = {
  path: '/herniated-disc-treatment-yerevan',
  pageKey: 'local-herniated-disc',
  title: 'Սկավառակի ճողվածքի բուժում Երևանում — Առողջ ողնաշար',
  h1: 'Սկավառակի ճողվածքի բուժում Երևանում',
  tagline: 'Կոնսերվատիվ մոտեցում միջողային սկավառակի ճողվածքի գնահատման համար',
  description: 'Սկավառակի ճողվածքի կոնսերվատիվ բուժում Երևանում—մանուալ թերապիա, տրակցիա «Առողջ ողնաշար» կենտրոնում։',
  faq: [
    { q: 'Ինչ է սկավառակի ճողվածքը', a: 'Սկավառակի ճողվածքը առաջանում է, երբ միջողային սկավառակի միջուկը դուրս է գալիս և կարող է ճնշել նյարդը։' },
    { q: 'Կարելի՟ է բուժել առանց վիրահատության', a: 'Շատ դեպքերում կոնսերվատիվ մոտեցումները կարող են օգնել։ Մասնագետը գնահատում է դեպքը և որոշում է համապատասխան պլան։' }
  ],
  schema: (data, url) => [localBusinessNode(data, url)],
  body: (data) => `<div class="hss-prose">
      <p>Սկավառակի ճողվածքը կարող է առաջացնել ցավ, թմրածություն և շարժունակության սահմանափակում։ «Առողջ ողնաշար» կենտրոնը Երևանում կիրառում է կոնսերվատիվ մոտեցումներ։</p>
    </div>
    <section class="seo-service-section">
      <h2>Կիրառվող մեթոդներ</h2>
      <ul class="hss-list">
        <li><a href="/services/hernia-treatment">Սկավառակի ճողվածքի բուժում</a></li>
        <li><a href="/services/manual-therapy">Մանուալ թերապիա</a></li>
        <li><a href="/services/traction">Տրակցիա</a></li>
        <li><a href="/services/physiotherapy">Ֆիզիոթերապիա</a></li>
      </ul>
    </section>
    ${contactBlock()}
    <p><a href="/conditions/herniated-disc" class="hss-link">Սկավառակի ճողվածք — մանրամասն</a> · <a href="/knowledge/herniated-disc-symptoms" class="hss-link">Սկավառակի ախտանիշներ</a></p>`
};

PAGES['/neck-pain-treatment-yerevan'] = {
  path: '/neck-pain-treatment-yerevan',
  pageKey: 'local-neck-pain',
  title: 'Պարանոցի ցավի բուժում Երևանում — Առողջ ողնաշար',
  h1: 'Պարանոցի ցավի բուժում Երևանում',
  tagline: 'Կոնսերվատիվ մոտեցում պարանոցի ցավի և կարկամության գնահատման համար',
  description: 'Պարանոցի ցավի կոնսերվատիվ բուժում Երևանում—մանուալ թերապիա, օստեոպաթիա «Առողջ ողնաշար» կենտրոնում։',
  faq: [
    { q: 'Ինչպես է բուժվում պարանոցի ցավը', a: 'Կենտրոնում կիրառվում են մանուալ թերապիա, օստեոպաթիա և ՖթՈ պարանոցի ցավի կառավարման համար։' },
    { q: 'Երբ պետք է դիմել մասնագետի', a: 'Եթե պարանոցի ցավը տևում է մի քանի օրից ավելի, ուղեկցվում է թմրածությամբ կամ խանգարում է առօրյա գործունեությանը։' }
  ],
  schema: (data, url) => [localBusinessNode(data, url)],
  body: (data) => `<div class="hss-prose">
      <p>Պարանոցի ցավը կարող է կապված լինել մկանների լարվածության, կեցվածքի, համակարգչի դիմաց երկարատև աշխատանքի հետ։ «Առողջ ողնաշար» կենտրոնը Երևանում առաջարկում է պարանոցի ցավի կոնսերվատիվ գնահատում և վերականգնողական աջակցություն։</p>
    </div>
    <section class="seo-service-section">
      <h2>Կիրառվող մեթոդներ</h2>
      <ul class="hss-list">
        <li><a href="/services/manual-therapy">Մանուալ թերապիա</a></li>
        <li><a href="/services/osteopathy">Օստեոպաթիա</a></li>
        <li><a href="/services/physiotherapy">Ֆիզիոթերապիա</a></li>
      </ul>
    </section>
    ${contactBlock()}
    <p><a href="/conditions/neck-pain-treatment" class="hss-link">Պարանոցի ցավ — մանրամասն</a> · <a href="/knowledge/neck-pain-causes" class="hss-link">Պարանոցի ցավի պատճառներ</a></p>`
};

PAGES['/orthopedic-consultation-yerevan'] = {
  path: '/orthopedic-consultation-yerevan',
  pageKey: 'local-orthopedic',
  title: 'Օրթոպեդիկ խորհրդատվություն Երևանում — Առողջ ողնաշար',
  h1: 'Օրթոպեդիկ խորհրդատվություն Երևանում',
  tagline: 'Օրթոպեդիկ-տրավմատոլոգի խորհրդատվություն ողնաշարի և հոդերի խնդիրների համար',
  description: 'Օրթոպեդիկ խորհրդատվություն Երևանում—ողնաշարի, հոդերի և շարժական համակարգի գնահատում «Առողջ ողնաշար» կենտրոնում։',
  faq: [
    { q: 'Ինչ է ներառում խորհրդատվությունը', a: 'Սկզբնական գնահատումը ներառում է բողքների հավաքում, ստուգում և վերականգնողական պլանի կազմում։' },
    { q: 'Ինչքան տևում է խորհրդատվությունը', a: 'Սկզբնական գնահատումը տևում է 20–40 րոպե։ Խորհուրդ է տրվում վերցնել նախորդ հետազոտությունների արդյունքները։' }
  ],
  schema: (data, url) => [localBusinessNode(data, url)],
  body: (data) => `<div class="hss-prose">
      <p>«Առողջ ողնաշար» կենտրոնում կարող եք ստանալ օրթոպեդիկ-տրավմատոլոգի խորհրդատվություն։ Մասնագետը գնահատում է բողքները, ստուգում շարժունակությունը և կազմում վերականգնողական պլան։</p>
    </div>
    <section class="seo-service-section">
      <h2>Ընդ գնահատվում են</h2>
      ${conditionLinks()}
    </section>
    ${contactBlock()}
    <p><a href="/services/consult-spine" class="hss-link">Օրթոպեդի խորհրդատվություն</a> · <a href="/consultation-process" class="hss-link">Խորհրդատվության գործընթաց</a></p>`
};


// ---- PHASE B: Doctor Authority Page ----

PAGES['/about-doctor'] = {
  path: '/about-doctor',
  pageKey: 'about-doctor',
  title: 'Բժշկի մասին — Առողջ ողնաշար',
  h1: 'Մասնագիտական թիմ',
  tagline: 'Ողնաշարի, հոդերի և շարժական համակարգի վերականգնողական մասնագետներ',
  description: '«Առողջ ողնաշար» կենտրոնի մասնագիտական թիմը—որակավորում, կրթություն, միջազգային վերապատրաստում և մասնագիտացում։',
  faq: [
    { q: 'Ինչ կրթություն ունի մասնագետը', a: 'Երևանի Մխիթար Հերացու անվան պետական բժշկական համալսարան (ԵՊԲՀ), օրդինատուրաներ մանուալ թերապիայի և ֆիզիկական ռեաբիլիտացիայի ոլորտում։ Միջազգային վերապատրաստում՝ ISICO, SOSORT, Osteo World School և այլն։' },
    { q: 'Ինչ վիճակներ են բուժվում', a: 'Ողնաշարի և հոդերի կոնսերվատիվ բուժում, մանկական սկոլիոզ և կորսետավորում, սագիտալ խանգարումներ, մանուալ թերապիա, օստեոպաթիա, կինեզիոթերապիա։' }
  ],
  schema: (data, url) => [{
    '@type': 'MedicalWebPage',
    name: 'Բժշկի մասին',
    url,
    description: '«Առողջ ողնաշար» կենտրոնի մասնագիտական թիմը։',
    isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' }
  }],
  body: (data) => '<div class="hss-prose">' +
    '<p>«Առողջ ողնաշար» վերականգնողական կենտրոնի մասնագիտական թիմը ունի 10+ տարվա փորձ ողնաշարի և հոդերի կոնսերվատիվ վերականգնման ոլորտում։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Կրթություն և վերապատրաստում</h2>' +
    '<ul class="hss-list">' +
    '<li>Երևանի Մխիթար Հերացու անվան պետական բժշկական համալսարան (ԵՊԲՀ)</li>' +
    '<li>Օրդինատուրա՝ մանուալ թերապիա</li>' +
    '<li>ISICO Institute (Milan)՝ մանկական իդիոպաթիկ սկոլիոզի կոնսերվատիվ բուժում</li>' +
    '<li>SIAS, LION, BSPTS, KATARINA SCHROTH մեթոդաբանություններ</li>' +
    '<li>Medical Skills Courses (London)</li>' +
    '<li>Osteo World School</li>' +
    '<li>Antwerpen Back Pain Management Institute</li>' +
    '</ul></section>' +
    '<section class="seo-service-section">' +
    '<h2>Անդամություններ</h2>' +
    '<ul class="hss-list">' +
    '<li>Ցավի բժշկության ասոցիացիա</li>' +
    '<li>SOSORT (International Society on Scoliosis Orthopaedic and Rehabilitation Treatment)</li>' +
    '</ul></section>' +
    '<section class="seo-service-section">' +
    '<h2>Բուժման փիլիսոֆիա</h2>' +
    '<div class="hss-prose"><p>Կենտրոնը աշխատում է կոնսերվատիվ մոտեցումով՝ առանց վիրահատության։ Յուրաքանչյուր դեպք գնահատվում է անհատապես, և վերականգնողական պլանը կազմվում է հիվանդի կլինիկական պատկերի հիման վրա։</p></div>' +
    '</section>' +
    '<section class="seo-service-section"><h2>Ծառայություններ</h2>' + serviceLinks() + '</section>' +
    '<section class="seo-service-section"><h2>Գնահատվող վիճակներ</h2>' + conditionLinks() + '</section>' +
    contactBlock() +
    '<p><a href="/find-a-doctor" class="hss-link">Գտնել մասնագետ</a> · <a href="/spine-specialist-yerevan" class="hss-link">Ողնաշարի մասնագետ Երևանում</a></p>'
};

// ---- PHASE C: Medical Trust Pages ----

PAGES['/editorial-policy'] = {
  path: '/editorial-policy',
  pageKey: 'editorial-policy',
  title: 'Խմբագրական քաղաքականություն — Առողջ ողնաշար',
  h1: 'Խմբագրական քաղաքականություն',
  tagline: 'Կայքի բովանդակության ստանդարտները և գործընթացները',
  description: '«Առողջ ողնաշար» կայքի խմբագրական քաղաքականություն՝ բովանդակության ստանդարտներ, թարմացման գործընթաց և չեզոքության սկզբունքներ։',
  faq: null,
  schema: (data, url) => [{ '@type': 'WebPage', name: 'Խմբագրական քաղաքականություն', url, isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' } }],
  body: (data) => '<div class="hss-prose">' +
    '<p>«Առողջ ողնաշար» կայքի բովանդակությունը ստեղծվում և վերանայվում է մասնագիտական թիմի կողմից։ Մեր նպատակը տեղեկատվական, չեզոք և հուսալի բովանդակություն տրամադրելն է։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Բովանդակության ստանդարտներ</h2>' +
    '<ul class="hss-list">' +
    '<li>Բովանդակությունը հիմնվում է վերականգնողական բժշկության ապացույցների և կլինիկական փորձի վրա</li>' +
    '<li>Բժշկական տեղեկատվությունը չի փոխարինում ախտորոշում կամ բուժում</li>' +
    '<li>Տեղեկատվությունը պարբերաբար թարմացվում է բժշկական նոր տվյալներին համապատասխան</li>' +
    '<li>Խոստացվում ենք չեզոքության և հավասարակշռության սկզբունքներ</li>' +
    '</ul></section>' +
    '<section class="seo-service-section">' +
    '<h2>Տեղեկատվության թարմացման գործընթաց</h2>' +
    '<ul class="hss-list">' +
    '<li>Տեղեկատվությունը վերանայվում է պարբերաբար</li>' +
    '<li>Սխալները ուղղվում և լրացվում են տեղեկացվածից հետո</li>' +
    '<li>Հնացած տեղեկատվությունը կարող է հեռացվել, եթե հայտնաբերվի սխալ</li>' +
    '</ul></section>' +
    '<p><a href="/medical-review-policy" class="hss-link">Բժշկական վերանայման քաղաքականություն</a> · <a href="/about-doctor" class="hss-link">Բժշկի մասին</a> · <a href="/knowledge" class="hss-link">Գիտելիքների կենտրոն</a></p>'
};

PAGES['/medical-review-policy'] = {
  path: '/medical-review-policy',
  pageKey: 'medical-review-policy',
  title: 'Բժշկական վերանայման քաղաքականություն — Առողջ ողնաշար',
  h1: 'Բժշկական վերանայման քաղաքականություն',
  tagline: 'Ինչպես է վերանայվում բժշկական բովանդակությունը կայքում',
  description: '«Առողջ ողնաշար» կայքի բժշկական վերանայման գործընթացը՝ վերանայողի պարտականություններ և որակի ստանդարտներ։',
  faq: null,
  schema: (data, url) => [{ '@type': 'WebPage', name: 'Բժշկական վերանայման քաղաքականություն', url, isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' } }],
  body: (data) => '<div class="hss-prose">' +
    '<p>«Առողջ ողնաշար» կայքի բժշկական բովանդակությունը վերանայվում է մասնագիտական թիմի կողմից։ Վերանայողը ստուգում է բովանդակության ճշտությունը, աղբյուրների հուսալիությունը և համապատասխանությունը։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Վերանայողի պարտականություններ</h2>' +
    '<ul class="hss-list">' +
    '<li>Բովանդակության գիտական ճշտության ստուգում</li>' +
    '<li>Աղբյուրների վալիդացիա և ստուգում</li>' +
    '<li>Եզրահանգստի համապատասխանության ստուգում</li>' +
    '<li>Վերջնական հաստատման համար պատասխանատվություն</li>' +
    '</ul></section>' +
    '<p><a href="/editorial-policy" class="hss-link">Խմբագրական քաղաքականություն</a> · <a href="/about-doctor" class="hss-link">Բժշկի մասին</a></p>'
};

PAGES['/patient-consultation-guide'] = {
  path: '/patient-consultation-guide',
  pageKey: 'patient-consultation-guide',
  title: 'Հիվանդի ուղեցույց խորհրդատվության համար — Առողջ ողնաշար',
  h1: 'Հիվանդի ուղեցույց խորհրդատվության համար',
  tagline: 'Ինչպես պատրաստվել առաջին այցին',
  description: 'Պատրաստվել խորհրդատվությանը «Առողջ ողնաշար» կենտրոնում՝ ինչ վերցնել, ինչ սպասել և ինչպես պատրաստվել։',
  faq: [
    { q: 'Ինչ վերցնել առաջին այցին', a: 'Վերցրեք առկա հետազոտությունների արդյունքները (ՄՌՏ, Ռենտգեն, ՈւԿՏ), ընդունվող դեղերի ցանկը և բողքների նկարագրությունը։' },
    { q: 'Ինչքան տևում է առաջին այցը', a: 'Սկզբնական գնահատումը տևում է 20–40 րոպե, կախված դեպքի բարդությունից։' }
  ],
  schema: (data, url) => [{ '@type': 'WebPage', name: 'Հիվանդի ուղեցույց', url, isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' } }],
  body: (data) => '<div class="hss-prose">' +
    '<p>Այս ուղեցույցը կօգնի ձեզ պատրաստվել առաջին այցը «Առողջ ողնաշար» կենտրոնում։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Ինչ վերցնել</h2>' +
    '<ul class="hss-list">' +
    '<li>Հետազոտությունների արդյունքներ (ՄՌՏ, Ռենտգեն, ՈւԿՏ)</li>' +
    '<li>Ընդունվող դեղերի ցանկ</li>' +
    '<li>Բողքների նկարագրություն (երբ, ինչպես, որտեղ, ինչը սրացնում է)</li>' +
    '<li>Հարմար հագուստ</li>' +
    '</ul></section>' +
    '<section class="seo-service-section">' +
    '<h2>Ինչ սպասել</h2>' +
    '<ul class="hss-list">' +
    '<li>Մասնագետը կգնահատի բողքները և շարժունակությունը</li>' +
    '<li>Կկազմվի վերականգնողական պլան</li>' +
    '<li>Կստանաք տնային խորհուրդներ</li>' +
    '<li>Սկզբնական գնահատումը տևում է 20–40 րոպե</li>' +
    '</ul></section>' +
    contactBlock() +
    '<p><a href="/consultation-process" class="hss-link">Խորհրդատվության գործընթաց</a> · <a href="/about-doctor" class="hss-link">Բժշկի մասին</a> · <a href="/spine-specialist-yerevan" class="hss-link">Ողնաշարի մասնագետ Երևանում</a></p>'
};

// ---- PHASE D: Authority Asset Pages ----

PAGES['/media-and-expert-commentary'] = {
  path: '/media-and-expert-commentary',
  pageKey: 'media-expert',
  title: 'Լրատվական միջոցներ և փորձագիտական մեկնաբանություն — Առողջ ողնաշար',
  h1: 'Լրատվական միջոցներ և փորձագիտական մեկնաբանություն',
  tagline: 'Սպայնի առողջության մասին փորձագիտական մեկնաբանություն',
  description: '«Առողջ ողնաշար» կենտրոնի փորձագիտական մեկնաբանություն՝ ողնաշարի առողջության, կեցվածքի և վերականգնման թեմաներ։',
  faq: null,
  schema: (data, url) => [{ '@type': 'WebPage', name: 'Լրատվական միջոցներ', url, isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' } }],
  body: (data) => '<div class="hss-prose">' +
    '<p>«Առողջ ողնաշար» կենտրոնի մասնագետները հասանելի են փորձագիտական մեկնաբանության համար ողնաշարի առողջության, կեցվածքի, վերականգնման և կանխարգելման թեմաներով։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Փորձագիտական թեմաներ</h2>' +
    '<ul class="hss-list">' +
    '<li>Սկոլիոզի կանխարգելում և կոնսերվատիվ մոտեցումներ</li>' +
    '<li>Ողնաշարի առողջություն և կեցվածք</li>' +
    '<li>Սպորտային վնասվածքներից վերականգնում</li>' +
    '<li>Աշխատանքային էրգոնոմիկա և կեցվածք</li>' +
    '</ul></section>' +
    '<section class="seo-service-section">' +
    '<h2>Կապ հաստատել</h2>' +
    '<p>Լրատվական միջոցների, հարցազրույցների կամ մեկնաբանությունների համար կապ հաստատեք էլ. փոստով՝ spinemedicalclinic@gmail.com</p>' +
    '</section>' +
    '<p><a href="/about-doctor" class="hss-link">Բժշկի մասին</a> · <a href="/spine-health-resources" class="hss-link">Ռեսուրսներ</a></p>'
};

PAGES['/spine-health-resources'] = {
  path: '/spine-health-resources',
  pageKey: 'spine-resources',
  title: 'Ողնաշարի առողջության ռեսուրսներ — Առողջ ողնաշար',
  h1: 'Ողնաշարի առողջության ռեսուրսներ',
  tagline: 'Տեղեկատվական նյութեր ըստ վիճակների, ախտանիշների և թերապևտիկ մեթոդների',
  description: 'Ողնաշարի առողջության ռեսուրսներ՝ հոդվածներ, ուղեցույցներ և տեղեկատվական նյութեր ողնաշարի առողջության վերաբերյալ։',
  faq: null,
  schema: (data, url) => [{ '@type': 'WebPage', name: 'Ողնաշարի առողջության ռեսուրսներ', url, isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' } }],
  body: (data) => '<div class="hss-prose">' +
    '<p>Այս էջում հավաքված են կենտրոնի կողմից ստեղծված տեղեկատվական նյութերը։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Ըստ վիճակների</h2>' +
    conditionLinks() + '</section>' +
    '<section class="seo-service-section">' +
    '<h2>Ըստ թերապևտիկ մեթոդների</h2>' +
    serviceLinks() + '</section>' +
    '<section class="seo-service-section">' +
    '<h2>Գիտելիքների կենտրոն</h2>' +
    knowledgeLinks() +
    '<p><a href="/knowledge" class="hss-link">Բոլոր հոդվածները</a></p>' +
    '</section>' +
    '<p><a href="/about-doctor" class="hss-link">Բժշկի մասին</a> · <a href="/editorial-policy" class="hss-link">Խմբագրական քաղաքականություն</a></p>'
};

PAGES['/for-clinics-and-referrers'] = {
  path: '/for-clinics-and-referrers',
  pageKey: 'for-clinics',
  title: 'Կլինիկաների և ուղղորդողների համար — Առողջ ողնաշար',
  h1: 'Կլինիկաների և ուղղորդողների համար',
  tagline: 'Մասնագիտական համագործակցության տեղեկատվություն',
  description: 'Համագործակցություն «Առողջ ողնաշար» կենտրոնի հետ՝ ուղղորդող կլինիկաների և մասնագետների համար։',
  faq: null,
  schema: (data, url) => [{ '@type': 'WebPage', name: 'Կլինիկաների և ուղղորդողների համար', url, isPartOf: { '@type': 'WebSite', name: 'Առողջ ողնաշար', url: BASE + '/' } }],
  body: (data) => '<div class="hss-prose">' +
    '<p>«Առողջ ողնաշար» վերականգնողական կենտրոնը համագործակցում է այլ կլինիկաների և մասնագետների հետ։ Եթե ձեր հիվանդին անհրաժեշտ է կոնսերվատիվ վերականգնողական գնահատում, կարող եք ուղղորդել մեզ հետ։</p>' +
    '</div>' +
    '<section class="seo-service-section">' +
    '<h2>Գնահատվող վիճակներ</h2>' +
    conditionLinks() + '</section>' +
    '<section class="seo-service-section">' +
    '<h2>Մեր ծառայությունները</h2>' +
    serviceLinks() + '</section>' +
    contactBlock() +
    '<p><a href="/about-doctor" class="hss-link">Բժշկի մասին</a> · <a href="/spine-specialist-yerevan" class="hss-link">Ողնաշարի մասնագետ Երևանում</a></p>'
};

module.exports = { PAGES };

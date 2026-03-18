/**
 * SportKeepr — main.js
 * i18n engine, language switcher, scroll animations
 */

// translations is loaded via translations.js (must be included before this file)

const pageTitles = {
    en: 'SportKeepr — The Smart Basketball Scoresheet',
    fr: 'SportKeepr — La Feuille de Match Intelligente',
    it: 'SportKeepr — Il Referto di Gara Intelligente'
  };

  function applyLang(lang) {
    const t = translations[lang];
    if (!t) return;
    document.documentElement.lang = lang;
    document.title = pageTitles[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    try { localStorage.setItem('sk_lang', lang); } catch(e) {}
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  // Init: saved preference → browser language → default EN
  let init = 'en';
  try { init = localStorage.getItem('sk_lang') || init; } catch(e) {}
  if (!translations[init]) {
    const br = (navigator.language || '').slice(0, 2);
    init = translations[br] ? br : 'en';
  }
  applyLang(init);

  // Scroll fade-in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

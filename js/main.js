/**
 * SportKeepr — main.js
 * i18n engine, language switcher, scroll animations, contact form
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

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // HTML content (allows <em> etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // <option> inside select
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  try { localStorage.setItem('sk_lang', lang); } catch(e) {}
}

// Lang switcher
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

// ── Scroll fade-in ─────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Contact form ───────────────────────────────────────────────────────────
function handleContact() {
  const t = translations[init] || translations.en;

  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const role    = document.getElementById('contact-role').value;
  const message = document.getElementById('contact-message').value.trim();
  const btn      = document.getElementById('contact-submit');
  const feedback = document.getElementById('contact-feedback');

  // Reset
  feedback.style.display = 'none';
  feedback.className = 'contact-note';

  // Validation
  if (!name || !email || !message) {
    feedback.textContent = t['contact.errorEmpty'];
    feedback.classList.add('error');
    feedback.style.display = 'block';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    feedback.textContent = t['contact.errorEmail'];
    feedback.classList.add('error');
    feedback.style.display = 'block';
    return;
  }

  // Sending state
  btn.classList.add('sending');
  btn.querySelector('span').textContent = t['contact.sending'];

  // Build mailto and open mail client
  const subject = encodeURIComponent(`[SportKeepr] Message from ${name}${role ? ' (' + role + ')' : ''}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRole: ${role || '—'}\n\n${message}`);
  window.location.href = `mailto:sportkeepr@gmail.com?subject=${subject}&body=${body}`;

  // Reset button after short delay
  setTimeout(() => {
    btn.classList.remove('sending');
    btn.classList.add('success');
    btn.querySelector('span').textContent = t['contact.send'];
    feedback.textContent = t['contact.successMsg'];
    feedback.classList.add('success');
    feedback.style.display = 'block';

    // Reset form
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-role').value = '';
    document.getElementById('contact-message').value = '';

    setTimeout(() => btn.classList.remove('success'), 3000);
  }, 800);
}

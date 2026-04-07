const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const yearEl = document.getElementById('year');
const languageLinks = document.querySelectorAll('.lang-link');
const languageStorageKey = 'vortexlabs-language';

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

if (languageLinks.length) {
  languageLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const selectedLanguage = (link.dataset.language || link.textContent || 'en').trim().toLowerCase();
      window.localStorage.setItem(languageStorageKey, selectedLanguage);
    });
  });

  const currentPath = window.location.pathname;
  const isEnglishEntry = currentPath === '/' || currentPath.endsWith('/index.html');
  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  const browserLanguages = navigator.languages || [navigator.language || 'en'];
  const browserPrefersGerman = browserLanguages.some((language) => language.toLowerCase().startsWith('de'));

  if (isEnglishEntry && (savedLanguage === 'de' || (!savedLanguage && browserPrefersGerman))) {
    const germanUrl = new URL('de.html', window.location.href);
    if (window.location.pathname !== germanUrl.pathname) {
      window.location.replace(germanUrl.href);
    }
  }
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

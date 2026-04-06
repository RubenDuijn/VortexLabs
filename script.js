const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const yearEl = document.getElementById('year');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
